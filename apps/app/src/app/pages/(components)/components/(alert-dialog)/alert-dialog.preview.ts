import { Component } from '@angular/core';
import { BrnAlertDialogContentDirective, BrnAlertDialogTriggerDirective } from '@spartan-ng/brain/alert-dialog';
import {
	HlmAlertDialogActionButtonDirective,
	HlmAlertDialogCancelButtonDirective,
	HlmAlertDialogComponent,
	HlmAlertDialogContentComponent,
	HlmAlertDialogDescriptionDirective,
	HlmAlertDialogFooterComponent,
	HlmAlertDialogHeaderComponent,
	HlmAlertDialogOverlayDirective,
	HlmAlertDialogTitleDirective,
} from '@spartan-ng/ui-alertdialog-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
	selector: 'spartan-alert-dialog-preview',
	imports: [
		BrnAlertDialogTriggerDirective,
		BrnAlertDialogContentDirective,
		HlmAlertDialogComponent,
		HlmAlertDialogOverlayDirective,
		HlmAlertDialogHeaderComponent,
		HlmAlertDialogFooterComponent,
		HlmAlertDialogTitleDirective,
		HlmAlertDialogDescriptionDirective,
		HlmAlertDialogCancelButtonDirective,
		HlmAlertDialogActionButtonDirective,
		HlmAlertDialogContentComponent,
		HlmButtonDirective,
	],
	template: `
		<hlm-alert-dialog>
			<button id="edit-profile" variant="outline" brnAlertDialogTrigger hlmBtn>Delete Account</button>
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
					<button hlmAlertDialogAction (click)="ctx.close()">Delete account</button>
				</hlm-alert-dialog-footer>
			</hlm-alert-dialog-content>
		</hlm-alert-dialog>
	`,
})
export class AlertDialogPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import {
  BrnAlertDialogContentDirective,
  BrnAlertDialogTriggerDirective,
} from '@spartan-ng/brain/alert-dialog';
import {
  HlmAlertDialogActionButtonDirective,
  HlmAlertDialogCancelButtonDirective,
  HlmAlertDialogComponent,
  HlmAlertDialogContentComponent,
  HlmAlertDialogDescriptionDirective,
  HlmAlertDialogFooterComponent,
  HlmAlertDialogHeaderComponent,
  HlmAlertDialogOverlayDirective,
  HlmAlertDialogTitleDirective,
} from '@spartan-ng/ui-alertdialog-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'spartan-alert-dialog-preview',
  standalone: true,
  imports: [
    BrnAlertDialogTriggerDirective,
    BrnAlertDialogContentDirective,

    HlmAlertDialogComponent,
    HlmAlertDialogOverlayDirective,
    HlmAlertDialogHeaderComponent,
    HlmAlertDialogFooterComponent,
    HlmAlertDialogTitleDirective,
    HlmAlertDialogDescriptionDirective,
    HlmAlertDialogCancelButtonDirective,
    HlmAlertDialogActionButtonDirective,
    HlmAlertDialogContentComponent,

    HlmButtonDirective,
  ],
  template: \`
    <hlm-alert-dialog>
      <button id="edit-profile" variant="outline" brnAlertDialogTrigger hlmBtn>Delete Account</button>
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
          <button hlmAlertDialogAction (click)="ctx.close()">Delete account</button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  \`,
})
export class AlertDialogPreviewComponent {}
`;

export const defaultImports = `
import { BrnAlertDialogContentDirective, BrnAlertDialogTriggerDirective } from '@spartan-ng/brain/alert-dialog';
import {
  HlmAlertDialogActionButtonDirective,
  HlmAlertDialogCancelButtonDirective,
  HlmAlertDialogComponent,
  HlmAlertDialogContentComponent,
  HlmAlertDialogDescriptionDirective,
  HlmAlertDialogFooterComponent,
  HlmAlertDialogHeaderComponent,
  HlmAlertDialogOverlayDirective,
  HlmAlertDialogTitleDirective,
} from '@spartan-ng/ui-alertdialog-helm';
`;

export const defaultSkeleton = `
<hlm-alert-dialog>
  <button id='edit-profile' variant='outline' brnAlertDialogTrigger hlmBtn>Delete Account</button>
  <hlm-alert-dialog-content *brnAlertDialogContent='let ctx'>
    <hlm-alert-dialog-header>
      <h3 hlmAlertDialogTitle>Are you absolutely sure?</h3>
      <p hlmAlertDialogDescription>
        This action cannot be undone. This will permanently delete your account and remove your data from our
        servers.
      </p>
    </hlm-alert-dialog-header>
    <hlm-alert-dialog-footer>
      <button hlmAlertDialogCancel (click)='ctx.close()'>Cancel</button>
      <button hlmAlertDialogAction (click)='ctx.close()'>Delete account</button>
    </hlm-alert-dialog-footer>
  </hlm-alert-dialog-content>
</hlm-alert-dialog>
`;
