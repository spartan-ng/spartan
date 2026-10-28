import { ChangeDetectionStrategy, Component } from '@angular/core';
import { render, waitFor } from '@testing-library/angular';
import { HlmAlertDialog } from './hlm-alert-dialog';
import { HlmAlertDialogContent } from './hlm-alert-dialog-content';
import { HlmAlertDialogPortal } from './hlm-alert-dialog-portal';
import { HlmAlertDialogTitle } from './hlm-alert-dialog-title';

@Component({
	imports: [HlmAlertDialog, HlmAlertDialogContent, HlmAlertDialogPortal, HlmAlertDialogTitle],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-alert-dialog state="open">
			<hlm-alert-dialog-content *hlmAlertDialogPortal="let ctx">
				<h2 hlmAlertDialogTitle>Delete?</h2>
			</hlm-alert-dialog-content>
		</hlm-alert-dialog>
	`,
})
class AlertDialogHost {}

describe('HlmAlertDialogContent', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('sizes its width by the viewport (w-[calc(100vw-2rem)]), not w-full, which collapses in the overlay pane', async () => {
		await render(AlertDialogHost);

		await waitFor(() => expect(document.querySelector('hlm-alert-dialog-content')).toBeTruthy());
		const content = document.querySelector('hlm-alert-dialog-content') as HTMLElement;

		// `w-full` inside the CDK pane resolves to min-content (#1320)
		expect(content.classList).toContain('w-[calc(100vw-2rem)]');
		expect(content.classList).not.toContain('w-full');
	});
});
