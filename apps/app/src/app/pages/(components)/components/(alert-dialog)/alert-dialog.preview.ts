import { Component } from '@angular/core';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import {
	HlmAlertDialog,
	HlmAlertDialogActionButton,
	HlmAlertDialogCancelButton,
	HlmAlertDialogContent,
	HlmAlertDialogDescription,
	HlmAlertDialogFooter,
	HlmAlertDialogHeader,
	HlmAlertDialogTitle,
} from '@spartan-ng/helm/alert-dialog';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-alert-dialog-preview',
	imports: [
		BrnAlertDialogTrigger,
		BrnAlertDialogContent,
		HlmAlertDialog,
		HlmAlertDialogHeader,
		HlmAlertDialogFooter,
		HlmAlertDialogTitle,
		HlmAlertDialogDescription,
		HlmAlertDialogCancelButton,
		HlmAlertDialogActionButton,
		HlmAlertDialogContent,
		HlmButton,
	],
	template: `
		<hlm-alert-dialog>
			<button id="edit-profile" variant="outline" brnAlertDialogTrigger hlmBtn>Show Dialog</button>
			<hlm-alert-dialog-content *brnAlertDialogContent="let ctx">
				<hlm-alert-dialog-header>
					<h3 hlmAlertDialogTitle>Are you absolutely sure?</h3>
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
import { BrnAlertDialogContentDirective, BrnAlertDialogTriggerDirective } from '@spartan-ng/brain/alert-dialog';
import {
  HlmAlertDialogActionButton
  HlmAlertDialogCancelButton
  HlmAlertDialog
  HlmAlertDialogContent
  HlmAlertDialogDescription
  HlmAlertDialogFooter
  HlmAlertDialogHeader
  HlmAlertDialogOverlay
  HlmAlertDialogTitle
} from '@spartan-ng/helm/alert-dialog';
`;

export const defaultSkeleton = `
<hlm-alert-dialog>
  <button id="edit-profile" variant="outline" brnAlertDialogTrigger hlmBtn>Show Dialog</button>
  <hlm-alert-dialog-content *brnAlertDialogContent="let ctx">
    <hlm-alert-dialog-header>
      <h3 hlmAlertDialogTitle>Are you absolutely sure?</h3>
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
