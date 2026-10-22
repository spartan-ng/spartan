import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideBrnTooltipDefaultOptions } from '@spartan-ng/brain/tooltip';
import { fireEvent, render, screen, waitFor } from '@testing-library/angular';
import { HlmTooltip } from './hlm-tooltip';

@Component({
	selector: 'hlm-tooltip-default-options-host',
	imports: [HlmTooltip],
	providers: [Directionality, provideBrnTooltipDefaultOptions({ position: 'bottom' })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div style="position: fixed; inset: 0; display: flex; align-items: center; justify-content: center">
			<button hlmTooltip="tip">trigger</button>
		</div>
	`,
})
class TooltipDefaultOptionsHost {}

@Component({
	selector: 'hlm-tooltip-root-options-host',
	imports: [HlmTooltip],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div style="position: fixed; inset: 0; display: flex; align-items: center; justify-content: center">
			<button hlmTooltip="tip">trigger</button>
		</div>
	`,
})
class TooltipRootOptionsHost {}

const tooltip = () => document.querySelector('[role="tooltip"]');

describe('HlmTooltip default options', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('keeps options provided by a parent component, with its own classes', async () => {
		await render(TooltipDefaultOptionsHost);

		fireEvent.pointerEnter(screen.getByText('trigger'), { pointerType: 'mouse' });

		await waitFor(() => expect(tooltip()?.getAttribute('data-side')).toBe('bottom'));
		expect(tooltip()?.className).toContain('spartan-tooltip-content');
	});

	it('keeps options provided in the application config, with its own classes', async () => {
		await render(TooltipRootOptionsHost, {
			providers: [provideBrnTooltipDefaultOptions({ position: 'left' })],
		});

		fireEvent.pointerEnter(screen.getByText('trigger'), { pointerType: 'mouse' });

		await waitFor(() => expect(tooltip()?.getAttribute('data-side')).toBe('left'));
		expect(tooltip()?.className).toContain('spartan-tooltip-content');
	});
});
