import { ChangeDetectionStrategy, Component } from '@angular/core';
import { render, screen, waitFor } from '@testing-library/angular';
import { HlmDialog } from './hlm-dialog';
import { HlmDialogContent } from './hlm-dialog-content';
import { HlmDialogDescription } from './hlm-dialog-description';
import { HlmDialogPortal } from './hlm-dialog-portal';

function dialogContainer(): HTMLElement {
	const container = document.querySelector('cdk-dialog-container');
	if (!container) throw new Error('cdk-dialog-container not found');
	return container as HTMLElement;
}

@Component({
	imports: [HlmDialog, HlmDialogContent, HlmDialogDescription, HlmDialogPortal],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-dialog state="open">
			<hlm-dialog-content *hlmDialogPortal="let ctx">
				<p hlmDialogDescription data-testid="description">Some description</p>
			</hlm-dialog-content>
		</hlm-dialog>
	`,
})
class DialogHost {}

@Component({
	imports: [HlmDialog, HlmDialogContent, HlmDialogPortal],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-dialog state="open">
			<hlm-dialog-content *hlmDialogPortal="let ctx" closeLabel="Dismiss">
				<span>content</span>
			</hlm-dialog-content>
		</hlm-dialog>
	`,
})
class DialogWithCustomCloseLabelHost {}

describe('HlmDialogContent', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('links the dialog to its HlmDialogDescription via aria-describedby', async () => {
		await render(DialogHost);

		await waitFor(() => expect(dialogContainer()).toBeTruthy());
		const description = screen.getByTestId('description');

		expect(dialogContainer().getAttribute('aria-describedby')).toBe(description.id);
	});

	it('labels the close button "Close" by default', async () => {
		await render(DialogHost);

		await waitFor(() => expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy());
	});

	it('labels the close button with a custom closeLabel', async () => {
		await render(DialogWithCustomCloseLabelHost);

		await waitFor(() => expect(screen.getByRole('button', { name: 'Dismiss' })).toBeTruthy());
	});
});
