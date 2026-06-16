import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render } from '@testing-library/angular';
import type { MockInstance } from 'vitest';
import { BrnResizableGroup } from './brn-resizable-group';
import { BrnResizableHandle } from './brn-resizable-handle';
import { BrnResizablePanel } from './brn-resizable-panel';

@Component({
	imports: [BrnResizableGroup, BrnResizablePanel, BrnResizableHandle],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<brn-resizable-group [(layout)]="layout">
			<brn-resizable-panel />
			<brn-resizable-handle />
			<brn-resizable-panel />
		</brn-resizable-group>
	`,
})
class ResizableHost {
	public readonly layout = signal<number[]>([50, 50]);
}

describe('BrnResizableGroup horizontal RTL resize', () => {
	let rafSpy: MockInstance;

	beforeEach(() => {
		// Run the RAF-scheduled layout commit synchronously so the drag result is observable.
		rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => (cb(0), 0));
	});

	afterEach(() => rafSpy.mockRestore());

	const setup = async () => {
		const view = await render(ResizableHost);
		view.detectChanges();
		const group = document.querySelector('[data-slot="resizable-panel-group"]') as HTMLElement;
		// jsdom reports offsetWidth as 0; give the group a concrete width so deltas resolve to percentages.
		Object.defineProperty(group, 'offsetWidth', { value: 200, configurable: true });
		const handle = document.querySelector('brn-resizable-handle') as HTMLElement;
		return { ...view, handle };
	};

	const dragRightBy = (handle: HTMLElement, px: number) => {
		const at = (clientX: number) => ({ bubbles: true, cancelable: true, clientX, clientY: 0, button: 0 });
		handle.dispatchEvent(new MouseEvent('mousedown', at(100)));
		document.dispatchEvent(new MouseEvent('mousemove', at(100 + px)));
		document.dispatchEvent(new MouseEvent('mouseup', at(100 + px)));
	};

	const firstPanelSize = () =>
		Number(document.querySelector('[data-slot="resizable-panel"]')?.getAttribute('data-panel-size'));

	it('grows the first panel when dragging the handle right in LTR', async () => {
		const { handle, detectChanges } = await setup();
		TestBed.inject(Directionality).valueSignal.set('ltr');

		dragRightBy(handle, 20); // +20px of 200px = +10%
		detectChanges();

		expect(firstPanelSize()).toBeGreaterThan(50);
	});

	it('shrinks the first panel when dragging right in RTL (delta mirrored)', async () => {
		const { handle, detectChanges } = await setup();
		TestBed.inject(Directionality).valueSignal.set('rtl');

		dragRightBy(handle, 20);
		detectChanges();

		expect(firstPanelSize()).toBeLessThan(50);
	});

	it('detaches document listeners and restores the cursor when destroyed mid-drag', async () => {
		const { handle, fixture } = await setup();
		TestBed.inject(Directionality).valueSignal.set('ltr');

		const at = (clientX: number) => ({ bubbles: true, cancelable: true, clientX, clientY: 0, button: 0 });

		// begin a drag but never release the pointer
		handle.dispatchEvent(new MouseEvent('mousedown', at(100)));
		expect(document.body.style.cursor).toBe('ew-resize');

		const removeSpy = vi.spyOn(document, 'removeEventListener');

		// destroy the group while the drag is still active
		fixture.destroy();

		// every document listener is detached and the global cursor is restored
		expect(document.body.style.cursor).toBe('default');
		for (const type of ['mousemove', 'touchmove', 'mouseup', 'touchend', 'touchcancel']) {
			expect(removeSpy).toHaveBeenCalledWith(type, expect.any(Function));
		}

		// a late move must not reach a torn-down handler
		expect(() => document.dispatchEvent(new MouseEvent('mousemove', at(180)))).not.toThrow();

		removeSpy.mockRestore();
	});

	it('ends the drag and restores the cursor when a touch is cancelled (touchcancel)', async () => {
		const { handle } = await setup();
		TestBed.inject(Directionality).valueSignal.set('ltr');

		// begin a drag
		handle.dispatchEvent(
			new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 100, clientY: 0, button: 0 }),
		);
		expect(document.body.style.cursor).toBe('ew-resize');

		// the system interrupts the touch: touchcancel fires instead of touchend
		document.dispatchEvent(new Event('touchcancel', { bubbles: true }));

		// the drag is torn down: cursor restored and listeners gone (a late move is a no-op)
		expect(document.body.style.cursor).toBe('default');
		expect(() =>
			document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 180, clientY: 0 })),
		).not.toThrow();
	});
});
