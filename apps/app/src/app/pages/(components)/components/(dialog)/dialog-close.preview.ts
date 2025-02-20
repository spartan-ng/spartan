import { Component, viewChild } from '@angular/core';
import {
	BrnDialogCloseDirective,
	BrnDialogComponent,
	BrnDialogContentDirective,
	BrnDialogTriggerDirective,
} from '@spartan-ng/brain/dialog';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
	HlmDialogComponent,
	HlmDialogContentComponent,
	HlmDialogHeaderComponent,
	HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Component({
	selector: 'spartan-dialog-close-preview',
	imports: [
		BrnDialogTriggerDirective,
		BrnDialogContentDirective,
		BrnDialogCloseDirective,
		HlmDialogComponent,
		HlmDialogContentComponent,
		HlmDialogHeaderComponent,
		HlmDialogTitleDirective,
		HlmLabelDirective,
		HlmButtonDirective,
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
export class DialogClosePreviewComponent {
	public viewchildDialogRef = viewChild(BrnDialogComponent);

	closeDialog() {
		this.viewchildDialogRef()?.close({});
	}
}

export const defaultCloseCode = `
import { Component, viewChild } from '@angular/core';
import {
	BrnDialogCloseDirective,
	BrnDialogComponent,
	BrnDialogContentDirective,
	BrnDialogTriggerDirective,
} from '@spartan-ng/brain/dialog';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
	HlmDialogComponent,
	HlmDialogContentComponent,
	HlmDialogHeaderComponent,
	HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Component({
	selector: 'spartan-dialog-close-preview',
	standalone: true,
	imports: [
		BrnDialogTriggerDirective,
		BrnDialogContentDirective,
		BrnDialogCloseDirective,

		HlmDialogComponent,
		HlmDialogContentComponent,
		HlmDialogHeaderComponent,
		HlmDialogTitleDirective,

		HlmLabelDirective,
		HlmButtonDirective,
	],
	template: \`
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
	\`,
})
export class DialogClosePreviewComponent {
	public viewchildDialogRef = viewChild(BrnDialogComponent);

	closeDialog() {
		this.viewchildDialogRef()?.close({});
	}
}
`;
