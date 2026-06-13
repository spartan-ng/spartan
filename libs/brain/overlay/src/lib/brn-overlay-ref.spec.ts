import type { OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { BrnOverlayOptions } from './brn-overlay-options';
import { BrnOverlayRef } from './brn-overlay-ref';
import { defaultOptions } from './brn-overlay-token';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: '',
})
class RenderHost {}

function createAnimation() {
	let finish!: () => void;
	const finished = new Promise<void>((resolve) => {
		finish = resolve;
	});
	return {
		animation: { finished, playState: 'running' } as Animation,
		finish,
	};
}

function createOverlayRef(optionOverrides: Partial<BrnOverlayOptions> = {}) {
	const overlayElement = document.createElement('div');
	const backdropElement = document.createElement('div');
	const dispose = jest.fn();
	const updatePosition = jest.fn();
	const addPanelClass = jest.fn();
	const removePanelClass = jest.fn();

	const cdkRef = {
		overlayElement,
		backdropElement,
		dispose,
		updatePosition,
		addPanelClass,
		removePanelClass,
	} as unknown as OverlayRef;

	const options: BrnOverlayOptions = {
		...defaultOptions,
		ariaDescribedBy: null,
		ariaLabelledBy: null,
		id: 'test-overlay',
		...optionOverrides,
	};
	const onDisposed = jest.fn();
	const ref = new BrnOverlayRef(cdkRef, TestBed.inject(Injector), 1, options, onDisposed);

	return { backdropElement, dispose, onDisposed, overlayElement, ref };
}

async function renderNextFrame(): Promise<void> {
	const fixture = TestBed.createComponent(RenderHost);
	fixture.detectChanges();
	await fixture.whenStable();
	await Promise.resolve();
}

describe(BrnOverlayRef.name, () => {
	beforeEach(() => {
		TestBed.configureTestingModule({ imports: [RenderHost] });
	});

	it('disposes after rendering the closed state when no exit animation starts', async () => {
		const { dispose, overlayElement, ref } = createOverlayRef();
		Object.defineProperty(overlayElement, 'getAnimations', { value: jest.fn(() => []) });

		ref.close();

		expect(ref.phase()).toBe('closing');
		expect(ref.state()).toBe('closed');
		expect(overlayElement.dataset['state']).toBe('closed');
		expect(dispose).not.toHaveBeenCalled();

		await renderNextFrame();

		expect(dispose).toHaveBeenCalledTimes(1);
		expect(ref.phase()).toBe('closed');
	});

	it('keeps the overlay mounted until a newly-started exit animation finishes', async () => {
		const { animation, finish } = createAnimation();
		const { dispose, overlayElement, ref } = createOverlayRef();
		const getAnimations = jest.fn().mockReturnValueOnce([]).mockReturnValueOnce([animation]);
		Object.defineProperty(overlayElement, 'getAnimations', { value: getAnimations });

		ref.close();
		await renderNextFrame();

		expect(dispose).not.toHaveBeenCalled();

		finish();
		await Promise.resolve();
		await Promise.resolve();

		expect(dispose).toHaveBeenCalledTimes(1);
	});

	it('does not wait for an unrelated animation that was already running', async () => {
		const { animation } = createAnimation();
		const { dispose, overlayElement, ref } = createOverlayRef();
		Object.defineProperty(overlayElement, 'getAnimations', { value: jest.fn(() => [animation]) });

		ref.close();
		await renderNextFrame();

		expect(dispose).toHaveBeenCalledTimes(1);
	});

	it('does not dispose an overlay reopened while its exit animation is running', async () => {
		const { animation, finish } = createAnimation();
		const { dispose, overlayElement, ref } = createOverlayRef();
		Object.defineProperty(overlayElement, 'getAnimations', {
			value: jest.fn().mockReturnValueOnce([]).mockReturnValueOnce([animation]),
		});

		ref.close();
		await renderNextFrame();
		ref.reopen();
		finish();
		await Promise.resolve();
		await Promise.resolve();

		expect(ref.phase()).toBe('open');
		expect(ref.state()).toBe('open');
		expect(dispose).not.toHaveBeenCalled();
	});

	it('applies dismissal policy only to interaction-driven close requests', async () => {
		const { dispose, overlayElement, ref } = createOverlayRef({
			closeOnOutsidePointerEvents: false,
			disableClose: true,
		});
		Object.defineProperty(overlayElement, 'getAnimations', { value: jest.fn(() => []) });

		expect(ref.dismiss('outside')).toBe(false);
		expect(ref.state()).toBe('open');

		ref.close();
		await renderNextFrame();

		expect(dispose).toHaveBeenCalledTimes(1);
	});
});
