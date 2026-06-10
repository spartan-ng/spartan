import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render } from '@testing-library/angular';
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
	let rafSpy: jest.SpyInstance;

	beforeEach(() => {
		// Run the RAF-scheduled layout commit synchronously so the drag result is observable.
		rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => (cb(0), 0));
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
});
