import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { render } from '@testing-library/angular';
import { BrnDrawerImports } from '../index';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));

@Component({
	selector: 'brn-drawer-swipe-area-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawer [modal]="modal()">
			<div
				brnDrawerSwipeArea
				[disabled]="disabled()"
				data-testid="swipe-area"
				style="position: fixed; inset-inline: 0; bottom: 0; height: 40px"
			></div>
			<div *brnDrawerPortal brnDrawerViewport style="position: fixed; inset: 0">
				<div brnDrawerPopup data-testid="popup" style="position: fixed; inset-inline: 0; bottom: 0; height: 300px">
					<div brnDrawerContent>Content</div>
				</div>
			</div>
		</div>
		<button data-testid="outside" style="position: fixed; top: 0; left: 0">Outside</button>
	`,
})
class SwipeAreaHost {
	public readonly disabled = input(false);
	public readonly modal = input<boolean>(false);
}

const swipeArea = () => document.querySelector('[data-testid="swipe-area"]') as HTMLElement;
const popup = () => document.querySelector<HTMLElement>('[data-testid="popup"]');

function pointer(target: Element, type: string, x: number, y: number) {
	const event = new PointerEvent(type, {
		bubbles: true,
		cancelable: true,
		composed: true,
		pointerId: 1,
		pointerType: 'mouse',
		isPrimary: true,
		button: 0,
		buttons: type === 'pointerup' ? 0 : 1,
		clientX: x,
		clientY: y,
	});
	target.dispatchEvent(event);
}

/** Drags up from the swipe area by `distance`, slowly enough not to count as a flick. */
async function dragUp(distance: number, { release = true } = {}) {
	const area = swipeArea();
	const rect = area.getBoundingClientRect();
	const x = rect.left + rect.width / 2;
	const startY = rect.top + rect.height / 2;
	const steps = 10;

	pointer(area, 'pointerdown', x, startY);
	for (let step = 1; step <= steps; step++) {
		pointer(area, 'pointermove', x, startY - (distance * step) / steps);
		await wait(30);
	}
	if (!release) return { x, y: startY - distance };

	// Rest before releasing, so the release velocity is zero and only the distance counts.
	await wait(200);
	pointer(area, 'pointerup', x, startY - distance);
	return { x, y: startY - distance };
}

describe('BrnDrawerSwipeArea', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('exposes its state and the opening swipe direction', async () => {
		await render(SwipeAreaHost);
		const area = swipeArea();

		expect(area.getAttribute('role')).toBe('presentation');
		expect(area.getAttribute('aria-hidden')).toBe('true');
		expect(area.hasAttribute('data-closed')).toBe(true);
		expect(area.getAttribute('data-swipe-direction')).toBe('up');
		expect(area.style.touchAction).toBe('pan-x');
	});

	it('opens the drawer while dragging and moves the popup with the pointer', async () => {
		const view = await render(SwipeAreaHost);

		await dragUp(100, { release: false });
		view.detectChanges();
		await frame();

		expect(popup()).toBeTruthy();
		expect(popup()?.hasAttribute('data-swiping')).toBe(true);
		// The popup is 300px tall and dragged 100px open, so 200px of it is still hidden.
		expect(popup()?.style.getPropertyValue('--drawer-swipe-movement-y')).toBe('200px');
		expect(swipeArea().hasAttribute('data-swiping')).toBe(true);
	});

	it('stays open when released past half of the popup', async () => {
		const view = await render(SwipeAreaHost);

		await dragUp(200);
		view.detectChanges();
		await wait(50);

		expect(popup()?.getAttribute('data-state')).toBe('open');
		expect(popup()?.hasAttribute('data-swiping')).toBe(false);
		expect(popup()?.style.getPropertyValue('--drawer-swipe-movement-y')).toBe('');
	});

	it('closes again when released before half of the popup', async () => {
		const view = await render(SwipeAreaHost);

		await dragUp(80);
		view.detectChanges();
		await wait(50);

		expect(popup()?.getAttribute('data-state') ?? 'closed').toBe('closed');
	});

	it('swallows the release click, so the drawer it just opened stays open', async () => {
		const view = await render(SwipeAreaHost);

		const { x, y } = await dragUp(200);
		swipeArea().dispatchEvent(
			new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1, clientX: x, clientY: y }),
		);
		view.detectChanges();
		await wait(50);
		expect(popup()?.getAttribute('data-state')).toBe('open');

		// A deliberate outside press afterwards still dismisses the non-modal drawer.
		const outside = document.querySelector('[data-testid="outside"]') as HTMLElement;
		pointer(outside, 'pointerdown', 5, 5);
		pointer(outside, 'pointerup', 5, 5);
		outside.dispatchEvent(
			new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1, clientX: 5, clientY: 5 }),
		);
		view.detectChanges();
		await wait(50);
		expect(popup()?.getAttribute('data-state') ?? 'closed').toBe('closed');
	});

	it('lets the click through after a gesture that leaves the drawer closed', async () => {
		const view = await render(SwipeAreaHost);
		const listener = vi.fn();
		document.addEventListener('click', listener);

		const { x, y } = await dragUp(80);
		swipeArea().dispatchEvent(
			new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1, clientX: x, clientY: y }),
		);
		view.detectChanges();
		document.removeEventListener('click', listener);

		expect(listener).toHaveBeenCalledTimes(1);
	});

	it('does nothing when disabled', async () => {
		const view = await render(SwipeAreaHost, { inputs: { disabled: true } });

		expect(swipeArea().hasAttribute('data-disabled')).toBe(true);
		expect(swipeArea().style.pointerEvents).toBe('none');
		await dragUp(200);
		view.detectChanges();
		await wait(50);

		expect(popup()).toBeNull();
	});
});
