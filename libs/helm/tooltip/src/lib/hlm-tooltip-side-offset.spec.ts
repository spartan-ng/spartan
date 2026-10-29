import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { provideBrnTooltipDefaultOptions } from '@spartan-ng/brain/tooltip';
import { fireEvent, render, screen, waitFor } from '@testing-library/angular';
import { HlmTooltip } from './hlm-tooltip';

@Component({
	selector: 'hlm-tooltip-side-offset-host',
	imports: [HlmTooltip],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div style="position: fixed; inset: 0; display: flex; align-items: center; justify-content: center">
			<button hlmTooltip="tip" position="bottom" [sideOffset]="20">trigger</button>
		</div>
	`,
})
class TooltipSideOffsetHost {}

@Component({
	selector: 'hlm-tooltip-default-side-offset-host',
	imports: [HlmTooltip],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div style="position: fixed; inset: 0; display: flex; align-items: center; justify-content: center">
			<button hlmTooltip="tip" position="bottom">trigger</button>
		</div>
	`,
})
class TooltipDefaultSideOffsetHost {}

@Component({
	selector: 'hlm-tooltip-dynamic-side-offset-host',
	imports: [HlmTooltip],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div style="position: fixed; inset: 0; display: flex; align-items: center; justify-content: center">
			<button hlmTooltip="tip" position="bottom" [sideOffset]="offset()">trigger</button>
		</div>
	`,
})
class TooltipDynamicSideOffsetHost {
	public readonly offset = signal(8);
}

@Component({
	selector: 'hlm-tooltip-zero-side-offset-host',
	imports: [HlmTooltip],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div style="position: fixed; inset: 0; display: flex; align-items: center; justify-content: center">
			<button hlmTooltip="tip" position="bottom" [sideOffset]="0">trigger</button>
		</div>
	`,
})
class TooltipZeroSideOffsetHost {}

@Component({
	selector: 'hlm-tooltip-rtl-side-offset-host',
	imports: [HlmTooltip],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div style="position: fixed; inset: 0; display: flex; align-items: center; justify-content: center">
			<button hlmTooltip="tip" position="right" [sideOffset]="20">trigger</button>
		</div>
	`,
})
class TooltipRtlSideOffsetHost {}

const pane = () => document.querySelector<HTMLElement>('.cdk-overlay-pane');
const triggerRect = () => screen.getByText('trigger').getBoundingClientRect();
const tooltipRect = () => document.querySelector('[role="tooltip"]')!.getBoundingClientRect();

describe('HlmTooltip sideOffset', () => {
	afterEach(() => {
		document.documentElement.dir = '';
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('defaults to 8px', async () => {
		await render(TooltipDefaultSideOffsetHost);

		fireEvent.pointerEnter(screen.getByText('trigger'), { pointerType: 'mouse' });

		await waitFor(() => expect(pane()?.style.transform).toContain('translateY(8px)'));
	});

	it('uses the sideOffset input', async () => {
		await render(TooltipSideOffsetHost);

		fireEvent.pointerEnter(screen.getByText('trigger'), { pointerType: 'mouse' });

		await waitFor(() => expect(pane()?.style.transform).toContain('translateY(20px)'));
	});

	it('uses the sideOffset default option', async () => {
		await render(TooltipDefaultSideOffsetHost, {
			providers: [provideBrnTooltipDefaultOptions({ sideOffset: 4 })],
		});

		fireEvent.pointerEnter(screen.getByText('trigger'), { pointerType: 'mouse' });

		await waitFor(() => expect(pane()?.style.transform).toContain('translateY(4px)'));
	});

	it('repositions an open tooltip when sideOffset changes', async () => {
		const { fixture } = await render(TooltipDynamicSideOffsetHost);

		fireEvent.pointerEnter(screen.getByText('trigger'), { pointerType: 'mouse' });
		await waitFor(() => expect(pane()?.style.transform).toContain('translateY(8px)'));

		fixture.componentInstance.offset.set(16);
		fixture.detectChanges();

		await waitFor(() => expect(pane()?.style.transform).toContain('translateY(16px)'));
	});

	it('supports an explicit 0 offset', async () => {
		await render(TooltipZeroSideOffsetHost);

		fireEvent.pointerEnter(screen.getByText('trigger'), { pointerType: 'mouse' });

		await waitFor(() => expect(Math.abs(tooltipRect().top - triggerRect().bottom)).toBeLessThan(1));
	});

	it('keeps the gap on the correct side in RTL', async () => {
		document.documentElement.dir = 'rtl';

		await render(TooltipRtlSideOffsetHost);

		fireEvent.pointerEnter(screen.getByText('trigger'), { pointerType: 'mouse' });

		// `right` places the tooltip on the physical left in RTL; the offset must still point away from the trigger.
		await waitFor(() => expect(Math.abs(triggerRect().left - tooltipRect().right - 20)).toBeLessThan(1));
	});
});
