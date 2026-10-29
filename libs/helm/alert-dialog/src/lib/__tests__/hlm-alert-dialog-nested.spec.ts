import { ChangeDetectionStrategy, Component } from '@angular/core';
import { fireEvent, render } from '@testing-library/angular';
import { HlmAlertDialogImports } from '../../index';

const flush = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
	await new Promise((resolve) => setTimeout(resolve, 0));
};

@Component({
	selector: 'hlm-alert-dialog-nested-host',
	imports: [HlmAlertDialogImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-alert-dialog>
			<button hlmAlertDialogTrigger data-testid="outer-trigger">outer</button>
			<hlm-alert-dialog-content *hlmAlertDialogPortal="let ctx">
				<hlm-alert-dialog>
					<button hlmAlertDialogTrigger data-testid="nested-trigger">nested</button>
					<hlm-alert-dialog-content *hlmAlertDialogPortal="let nestedCtx">
						<button hlmAlertDialogCancel data-testid="nested-cancel">cancel</button>
					</hlm-alert-dialog-content>
				</hlm-alert-dialog>
			</hlm-alert-dialog-content>
		</hlm-alert-dialog>
	`,
})
class NestedAlertDialogHost {}

const contents = () => Array.from(document.querySelectorAll<HTMLElement>('hlm-alert-dialog-content'));

describe('HlmAlertDialog nested content', () => {
	let style: HTMLStyleElement;

	beforeEach(() => {
		// Keep the overlay mounted while it animates out so the content's state can be observed.
		style = document.createElement('style');
		style.textContent = `
			@keyframes brn-test-alert-dialog-exit { from { opacity: 1; } to { opacity: 0; } }
			.cdk-overlay-pane[data-state='closed'] { animation: brn-test-alert-dialog-exit 150ms linear; }
		`;
		document.head.appendChild(style);
	});

	afterEach(() => {
		style.remove();
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('closes only the nested content and keeps the parent content open', async () => {
		const view = await render(NestedAlertDialogHost);

		fireEvent.click(document.querySelector('[data-testid="outer-trigger"]') as HTMLButtonElement);
		view.detectChanges();
		await flush();

		fireEvent.click(document.querySelector('[data-testid="nested-trigger"]') as HTMLButtonElement);
		view.detectChanges();
		await flush();

		expect(contents()).toHaveLength(2);

		fireEvent.click(document.querySelector('[data-testid="nested-cancel"]') as HTMLButtonElement);
		view.detectChanges();
		await flush();

		const [outerContent, nestedContent] = contents();
		expect(nestedContent.getAttribute('data-state')).toBe('closed');
		expect(outerContent.getAttribute('data-state')).toBe('open');
	});
});
