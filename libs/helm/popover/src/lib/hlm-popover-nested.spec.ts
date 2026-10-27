import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component } from '@angular/core';
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
	selector: 'hlm-popover-nested-host',
	imports: [HlmPopover, HlmPopoverContent, HlmPopoverPortal, HlmPopoverTrigger],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-popover>
			<button hlmPopoverTrigger data-testid="outer-trigger">outer</button>
			<hlm-popover-content *hlmPopoverPortal="let ctx">
				<hlm-popover>
					<button hlmPopoverTrigger data-testid="nested-trigger">nested</button>
					<hlm-popover-content *hlmPopoverPortal="let nestedCtx">
						<span data-testid="nested-content">nested content</span>
					</hlm-popover-content>
				</hlm-popover>
			</hlm-popover-content>
		</hlm-popover>
	`,
})
class NestedPopoverHost {}

const contents = () => Array.from(document.querySelectorAll<HTMLElement>('hlm-popover-content'));

describe('HlmPopover nested content', () => {
	let style: HTMLStyleElement;

	beforeEach(() => {
		// Keep the overlay mounted while it animates out so the content's state can be observed.
		style = document.createElement('style');
		style.textContent = `
			@keyframes brn-test-popover-exit { from { opacity: 1; } to { opacity: 0; } }
			.cdk-overlay-pane[data-state='closed'] { animation: brn-test-popover-exit 150ms linear; }
		`;
		document.head.appendChild(style);
	});

	afterEach(() => {
		style.remove();
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('closes only the nested content and keeps the parent content open', async () => {
		const view = await render(NestedPopoverHost);

		fireEvent.click(document.querySelector('[data-testid="outer-trigger"]') as HTMLButtonElement);
		view.detectChanges();
		await flush();

		fireEvent.click(document.querySelector('[data-testid="nested-trigger"]') as HTMLButtonElement);
		view.detectChanges();
		await flush();

		expect(contents()).toHaveLength(2);

		fireEvent.click(document.querySelector('[data-testid="nested-trigger"]') as HTMLButtonElement);
		view.detectChanges();
		await flush();

		const [outerContent, nestedContent] = contents();
		expect(nestedContent.getAttribute('data-state')).toBe('closed');
		expect(outerContent.getAttribute('data-state')).toBe('open');
	});
});
