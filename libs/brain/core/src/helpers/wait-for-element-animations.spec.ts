import { getActiveElementAnimations, waitForAnimations, waitForElementAnimations } from './wait-for-element-animations';

const mount = (): HTMLElement => {
	const el = document.createElement('div');
	document.body.appendChild(el);
	return el;
};

describe('getActiveElementAnimations', () => {
	const created: HTMLElement[] = [];
	afterEach(() => {
		created.forEach((el) => el.remove());
		created.length = 0;
	});
	const track = (el: HTMLElement) => (created.push(el), el);

	it('returns running animations on the element', () => {
		const el = track(mount());
		el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1000 });

		const animations = getActiveElementAnimations([el]);
		expect(animations.length).toBe(1);
	});

	it('excludes finished animations', async () => {
		const el = track(mount());
		const animation = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 10 });
		await animation.finished;

		expect(getActiveElementAnimations([el])).toEqual([]);
	});

	it('ignores null/undefined elements and elements without getAnimations', () => {
		const el = track(mount());
		el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1000 });
		const fake = { getAnimations: undefined } as unknown as HTMLElement;

		const animations = getActiveElementAnimations([null, undefined, fake, el]);
		expect(animations.length).toBe(1);
	});

	it('collects subtree animations', () => {
		const parent = track(mount());
		const child = document.createElement('span');
		parent.appendChild(child);
		child.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1000 });

		expect(getActiveElementAnimations([parent]).length).toBe(1);
	});
});

describe('waitForAnimations', () => {
	const created: HTMLElement[] = [];
	afterEach(() => {
		created.forEach((el) => el.remove());
		created.length = 0;
	});
	const track = (el: HTMLElement) => (created.push(el), el);

	it('resolves immediately when there are no animations', async () => {
		await expect(waitForAnimations([])).resolves.toBeUndefined();
	});

	it('resolves once the animation finishes', async () => {
		const el = track(mount());
		const animation = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 30 });

		let settled = false;
		const wait = waitForAnimations([animation]).then(() => (settled = true));
		expect(settled).toBe(false);
		await wait;
		expect(settled).toBe(true);
		expect(animation.playState).toBe('finished');
	});

	// The fallback timer guarantees teardown even if an animation never reaches `finished`
	// (e.g. paused/stuck), so the overlay can never get wedged open.
	it('resolves via the fallback timer when an animation never finishes', async () => {
		const el = track(mount());
		const animation = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 50 });
		animation.pause(); // .finished will never resolve on its own

		// fallback = endTime (50) + buffer (50) = ~100ms; allow generous headroom.
		await expect(
			Promise.race([waitForAnimations([animation]), new Promise((_, r) => setTimeout(r, 2000))]),
		).resolves.toBeUndefined();
	});
});

describe('waitForElementAnimations', () => {
	it('waits for active animations on the element to finish', async () => {
		const el = mount();
		const animation = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 30 });

		await waitForElementAnimations(el);
		expect(animation.playState).toBe('finished');
		el.remove();
	});

	it('resolves immediately when the element has no animations', async () => {
		const el = mount();
		await expect(waitForElementAnimations(el)).resolves.toBeUndefined();
		el.remove();
	});
});
