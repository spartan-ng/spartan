import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrnPopover } from '@spartan-ng/brain/popover';
import { fireEvent, render } from '@testing-library/angular';
import { HlmPopover } from './hlm-popover';
import { HlmPopoverContent } from './hlm-popover-content';
import { HlmPopoverPortal } from './hlm-popover-portal';
import { HlmPopoverTrigger } from './hlm-popover-trigger';

const flush = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
	await new Promise((resolve) => setTimeout(resolve, 0));
};

@Component({
	selector: 'hlm-popover-overlay-host',
	imports: [HlmPopover, HlmPopoverContent, HlmPopoverPortal, HlmPopoverTrigger],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-popover [autoFocus]="autoFocus()" [closeOnOutsidePointerEvents]="closeOnOutside()">
			<button hlmPopoverTrigger>open</button>
			<hlm-popover-content *hlmPopoverPortal="let ctx">
				<input data-testid="field" />
			</hlm-popover-content>
		</hlm-popover>
	`,
})
class PopoverOverlayHost {
	public readonly autoFocus = input(true);
	public readonly closeOnOutside = input(true);
}

@Component({
	selector: 'hlm-popover-two-host',
	imports: [HlmPopover, HlmPopoverContent, HlmPopoverPortal, HlmPopoverTrigger],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-popover>
			<button hlmPopoverTrigger data-testid="t1">one</button>
			<hlm-popover-content *hlmPopoverPortal="let ctx"><span>one</span></hlm-popover-content>
		</hlm-popover>
		<hlm-popover>
			<button hlmPopoverTrigger data-testid="t2">two</button>
			<hlm-popover-content *hlmPopoverPortal="let ctx"><span>two</span></hlm-popover-content>
		</hlm-popover>
	`,
})
class PopoverTwoHost {}

const popoverOf = (view: Awaited<ReturnType<typeof render>>) =>
	view.fixture.debugElement.query(By.directive(HlmPopover)).injector.get(BrnPopover);

describe('HlmPopover overlay behaviour', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('is non-modal: opens without a backdrop (issue #3)', async () => {
		const view = await render(PopoverOverlayHost);
		popoverOf(view).open();
		view.detectChanges();
		await flush();

		expect(document.querySelector('.cdk-overlay-pane')).toBeTruthy();
		expect(document.querySelector('.cdk-overlay-backdrop')).toBeNull();
	});

	it('does not move focus into the content when autoFocus is disabled', async () => {
		const view = await render(PopoverOverlayHost, { inputs: { autoFocus: false } });
		const trigger = view.container.querySelector('button[hlmPopoverTrigger]') as HTMLButtonElement;

		trigger.focus();
		trigger.click();
		view.detectChanges();
		await flush();

		expect(document.querySelector('[data-testid="field"]')).toBeTruthy();
		expect(document.activeElement).toBe(trigger);
	});

	it('does not dismiss on outside pointer events when closeOnOutsidePointerEvents is false', async () => {
		const view = await render(PopoverOverlayHost, { inputs: { closeOnOutside: false } });
		const popover = popoverOf(view);

		popover.open();
		view.detectChanges();
		await flush();
		expect(popover.stateComputed()).toBe('open');

		fireEvent.pointerDown(document.body);
		fireEvent.click(document.body);
		view.detectChanges();
		await flush();

		expect(popover.stateComputed()).toBe('open');
	});

	it('assigns a unique overlay id per instance (no duplicate-id collision)', async () => {
		const view = await render(PopoverTwoHost);
		const popovers = view.fixture.debugElement
			.queryAll(By.directive(HlmPopover))
			.map((d) => d.injector.get(BrnPopover));

		expect(() => {
			popovers[0].open();
			view.detectChanges();
			popovers[1].open();
			view.detectChanges();
		}).not.toThrow();

		await flush();
		const panes = document.querySelectorAll('.cdk-overlay-pane');
		const ids = Array.from(panes).map((p) => p.id);
		expect(panes.length).toBe(2);
		expect(new Set(ids).size).toBe(2); // distinct ids
	});

	it('does not emit on the closed output after the host is destroyed (NG0953 guard)', async () => {
		const view = await render(PopoverOverlayHost);
		const popover = popoverOf(view);
		const closedSpy = vi.fn();
		popover.closed.subscribe(closedSpy);
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

		popover.open();
		view.detectChanges();
		await flush();

		view.fixture.destroy();
		await flush();

		expect(closedSpy).not.toHaveBeenCalled();
		expect(consoleErrorSpy.mock.calls.flat().join(' ')).not.toContain('NG0953');
		consoleErrorSpy.mockRestore();
	});
});
