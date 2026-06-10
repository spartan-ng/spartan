import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-alert-dialog-preview',
	imports: [HlmAlertDialogImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-alert-dialog>
			<button hlmAlertDialogTrigger hlmBtn variant="outline">Show Dialog</button>
			<hlm-alert-dialog-content *hlmAlertDialogPortal="let ctx">
				<hlm-alert-dialog-header>
					<h2 hlmAlertDialogTitle>Are you absolutely sure?</h2>
					<p hlmAlertDialogDescription>
						This action cannot be undone. This will permanently delete your account from our servers.
					</p>
				</hlm-alert-dialog-header>
				<hlm-alert-dialog-footer>
					<button hlmAlertDialogCancel>Cancel</button>
					<button hlmAlertDialogAction>Continue</button>
				</hlm-alert-dialog-footer>
			</hlm-alert-dialog-content>
		</hlm-alert-dialog>
	`,
})
export class AlertDialogPreview {}

export const defaultImports = `
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
`;

export const defaultSkeleton = `
<hlm-alert-dialog>
  <button hlmAlertDialogTrigger hlmBtn variant="outline">Show Dialog</button>
  <hlm-alert-dialog-content *hlmAlertDialogPortal="let ctx">
    <hlm-alert-dialog-header>
      <h2 hlmAlertDialogTitle>Are you absolutely sure?</h2>
      <p hlmAlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</p>
    </hlm-alert-dialog-header>
    <hlm-alert-dialog-footer>
      <button hlmAlertDialogCancel>Cancel</button>
      <button hlmAlertDialogAction>Continue</button>
    </hlm-alert-dialog-footer>
  </hlm-alert-dialog-content>
</hlm-alert-dialog>
`;
