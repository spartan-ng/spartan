import { TestBed } from '@angular/core/testing';
import { injectSkipDelay, type SkipDelay } from './skip-delay';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function create(skipDelayDuration: () => number): SkipDelay {
	return TestBed.runInInjectionContext(() => injectSkipDelay(skipDelayDuration));
}

describe('injectSkipDelay', () => {
	it('requires a delay until a member opens', () => {
		const skip = create(() => 50);
		expect(skip.isOpenDelayed()).toBe(true);

		skip.open();
		expect(skip.isOpenDelayed()).toBe(false);
	});

	it('keeps skipping within the window after close, then re-requires the delay', async () => {
		const skip = create(() => 50);
		skip.open();
		skip.close();

		expect(skip.isOpenDelayed()).toBe(false);
		await wait(90);
		expect(skip.isOpenDelayed()).toBe(true);
	});

	it('a new open cancels the pending reset', async () => {
		const skip = create(() => 50);
		skip.open();
		skip.close();
		await wait(20);

		skip.open();
		await wait(60);
		expect(skip.isOpenDelayed()).toBe(false);
	});

	it('never skips when skipDelayDuration is 0', async () => {
		const skip = create(() => 0);
		skip.open();
		expect(skip.isOpenDelayed()).toBe(true);

		skip.close();
		await wait(10);
		expect(skip.isOpenDelayed()).toBe(true);
	});
});
