import { Component } from '@angular/core';
import { BrnAlertDialogImports } from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-alert-dialog-preview',
	imports: [BrnAlertDialogImports, HlmAlertDialogImports, HlmButtonImports],
	template: `
		<hlm-alert-dialog>
			<button id="edit-profile" hlmAlertDialogTrigger hlmBtn variant="outline">Show Dialog</button>
			<hlm-alert-dialog-content *brnAlertDialogContent="let ctx">
				<hlm-alert-dialog-header>
					<h2 hlmAlertDialogTitle>Are you absolutely sure?</h2>
					<p hlmAlertDialogDescription>
						This action cannot be undone. This will permanently delete your account and remove your data from our
						servers.
					</p>
				</hlm-alert-dialog-header>
				<hlm-alert-dialog-footer>
					<button hlmAlertDialogCancel (click)="ctx.close()">Cancel</button>
					<button hlmAlertDialogAction (click)="ctx.close()">Continue</button>
				</hlm-alert-dialog-footer>
			</hlm-alert-dialog-content>
		</hlm-alert-dialog>
	`,
})
export class AlertDialogPreview {}

export const defaultImports = `
import { BrnAlertDialogImports } from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
`;

export const defaultSkeleton = `
<hlm-alert-dialog>
  <button id="edit-profile" hlmAlertDialogTrigger>Show Dialog</button>
  <hlm-alert-dialog-content *brnAlertDialogContent="let ctx">
    <hlm-alert-dialog-header>
      <h2 hlmAlertDialogTitle>Are you absolutely sure?</h2>
      <p hlmAlertDialogDescription>
        This action cannot be undone. This will permanently delete your account and remove your data from our
        servers.
      </p>
    </hlm-alert-dialog-header>
    <hlm-alert-dialog-footer>
      <button hlmAlertDialogCancel (click)="ctx.close()">Cancel</button>
      <button hlmAlertDialogAction (click)="ctx.close()">Continue</button>
    </hlm-alert-dialog-footer>
  </hlm-alert-dialog-content>
</hlm-alert-dialog>
`;
