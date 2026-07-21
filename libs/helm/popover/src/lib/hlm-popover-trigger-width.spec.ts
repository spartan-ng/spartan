import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { render } from '@testing-library/angular';
import { HlmPopover } from './hlm-popover';
import { HlmPopoverContent } from './hlm-popover-content';
import { HlmPopoverPortal } from './hlm-popover-portal';
import { HlmPopoverTrigger } from './hlm-popover-trigger';

const flush = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
	await new Promise((resolve) => setTimeout(resolve, 0));
};

@Component({
	selector: 'hlm-popover-trigger-width-host',
	imports: [HlmPopover, HlmPopoverContent, HlmPopoverPortal, HlmPopoverTrigger],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-popover>
			<button hlmPopoverTrigger style="width: 320px">open</button>
			<hlm-popover-content *hlmPopoverPortal="let ctx">
				<span>content</span>
			</hlm-popover-content>
		</hlm-popover>
	`,
})
class PopoverTriggerWidthHost {}

describe('HlmPopoverContent trigger width', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	const setup = async () => {
		const view = await render(PopoverTriggerWidthHost);
		const trigger = view.container.querySelector('button[hlmPopoverTrigger]') as HTMLButtonElement;

		trigger.click();
		view.detectChanges();
		await flush();

		return { view, trigger };
	};

	it('exposes the trigger width as --brn-popover-trigger-width on the content', async () => {
		await setup();

		const content = document.querySelector('hlm-popover-content') as HTMLElement;
		expect(content).toBeTruthy();
		expect(content.style.getPropertyValue('--brn-popover-trigger-width')).toBe('320px');
	});

	it('updates the custom property when the trigger is resized while open', async () => {
		const { view, trigger } = await setup();

		trigger.style.width = '480px';
		await vi.waitFor(() => {
			view.detectChanges();
			const content = document.querySelector('hlm-popover-content') as HTMLElement;
			expect(content.style.getPropertyValue('--brn-popover-trigger-width')).toBe('480px');
		});
	});
});
