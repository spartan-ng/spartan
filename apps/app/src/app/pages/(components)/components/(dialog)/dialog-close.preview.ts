import { Component, viewChild } from '@angular/core';
import { BrnDialog, BrnDialogClose, BrnDialogContent, BrnDialogTrigger } from '@spartan-ng/brain/dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDialog, HlmDialogContent, HlmDialogHeader, HlmDialogTitle } from '@spartan-ng/helm/dialog';
import { HlmLabel } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-dialog-close-preview',
	imports: [
		BrnDialogTrigger,
		BrnDialogContent,
		BrnDialogClose,
		HlmDialog,
		HlmDialogContent,
		HlmDialogHeader,
		HlmDialogTitle,
		HlmLabel,
		HlmButton,
	],
	template: `
		<hlm-dialog #dialogRef>
			<button id="edit-profile" brnDialogTrigger hlmBtn>Open</button>
			<hlm-dialog-content class="sm:max-w-[425px]" *brnDialogContent="let ctx">
				<hlm-dialog-header>
					<h3 hlmDialogTitle>Dialog</h3>
				</hlm-dialog-header>
				<div class="grid gap-4 py-4">
					<div class="flex items-center justify-between gap-4">
						<label hlmLabel>Close dialog by directive</label>
						<button hlmBtn brnDialogClose>Close</button>
					</div>
					<div class="flex items-center justify-between gap-4">
						<label hlmLabel>Close dialog by reference</label>
						<button hlmBtn (click)="dialogRef.close({})">Close</button>
					</div>
					<div class="flex items-center justify-between gap-4">
						<label hlmLabel>Close dialog by viewchild reference</label>
						<button hlmBtn (click)="closeDialog()">Close</button>
					</div>
				</div>
			</hlm-dialog-content>
		</hlm-dialog>
	`,
})
export class DialogClosePreview {
	public viewchildDialogRef = viewChild(BrnDialog);

	closeDialog() {
		this.viewchildDialogRef()?.close({});
	}
}
