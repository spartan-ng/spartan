import { Component, viewChild } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCross } from '@ng-icons/lucide';
import {
	BrnSheetCloseDirective,
	BrnSheetComponent,
	BrnSheetContentDirective,
	BrnSheetTriggerDirective,
} from '@spartan-ng/brain/sheet';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import {
	HlmSheetComponent,
	HlmSheetContentComponent,
	HlmSheetHeaderComponent,
	HlmSheetTitleDirective,
} from '@spartan-ng/ui-sheet-helm';

@Component({
	selector: 'spartan-sheet-close-preview',
	imports: [
		BrnSheetTriggerDirective,
		BrnSheetContentDirective,
		BrnSheetCloseDirective,
		HlmSheetComponent,
		HlmSheetContentComponent,
		HlmSheetHeaderComponent,
		HlmSheetTitleDirective,
		HlmButtonDirective,
		HlmLabelDirective,
	],
	providers: [provideIcons({ lucideCross })],
	template: `
		<hlm-sheet #sheetRef side="right">
			<button id="edit-profile" variant="outline" brnSheetTrigger hlmBtn>Open</button>
			<hlm-sheet-content *brnSheetContent="let ctx">
				<hlm-sheet-header>
					<h3 hlmSheetTitle>Sheet</h3>
				</hlm-sheet-header>
				<div class="grid gap-4 py-4">
					<div class="flex items-center justify-between gap-4">
						<label hlmLabel>Close sheet by directive</label>
						<button hlmBtn brnSheetClose>Close</button>
					</div>
					<div class="flex items-center justify-between gap-4">
						<label hlmLabel>Close sheet by reference</label>
						<button hlmBtn (click)="sheetRef.close({})">Close</button>
					</div>
					<div class="flex items-center justify-between gap-4">
						<label hlmLabel>Close sheet by viewchild reference</label>
						<button hlmBtn (click)="closeSheet()">Close</button>
					</div>
				</div>
			</hlm-sheet-content>
		</hlm-sheet>
	`,
})
export class SheetClosePreviewComponent {
	public viewchildSheetRef = viewChild(BrnSheetComponent);

	closeSheet() {
		this.viewchildSheetRef()?.close({});
	}
}

export const defaultCloseCode = `
import { Component, viewChild } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCross } from '@ng-icons/lucide';
import { BrnSheetCloseDirective, BrnSheetComponent, BrnSheetContentDirective, BrnSheetTriggerDirective } from '@spartan-ng/brain/sheet';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import {
	HlmSheetComponent,
	HlmSheetContentComponent,
	HlmSheetHeaderComponent,
	HlmSheetTitleDirective,
} from '@spartan-ng/ui-sheet-helm';

@Component({
	selector: 'spartan-sheet-close-preview',
	standalone: true,
	imports: [
    BrnSheetTriggerDirective,
    BrnSheetContentDirective,
    BrnSheetCloseDirective,
    HlmSheetComponent,
    HlmSheetContentComponent,
    HlmSheetHeaderComponent,
    HlmSheetTitleDirective,
    HlmButtonDirective,
    HlmLabelDirective
],
	providers: [provideIcons({ lucideCross })],
	template: \`
		<hlm-sheet #sheetRef side="right">
			<button id="edit-profile" variant="outline" brnSheetTrigger hlmBtn>Open</button>
			<hlm-sheet-content *brnSheetContent="let ctx">
				<hlm-sheet-header>
					<h3 hlmSheetTitle>Sheet</h3>
				</hlm-sheet-header>
					<div class="grid gap-4 py-4">
						<div class="flex items-center justify-between gap-4">
							<label hlmLabel>Close sheet by directive</label>
							<button hlmBtn brnSheetClose>Close</button>
						</div>
						<div class="flex items-center justify-between gap-4">
							<label hlmLabel>Close sheet by reference</label>
							<button hlmBtn (click)="sheetRef.close({})">Close</button>
						</div>
						<div class="flex items-center justify-between gap-4">
							<label hlmLabel>Close sheet by viewchild reference</label>
							<button hlmBtn (click)="closeSheet()">Close</button>
						</div>
					</div>
			</hlm-sheet-content>
		</hlm-sheet>
	\`,
})
export class SheetClosePreviewComponent {
    public viewchildSheetRef = viewChild(BrnSheetComponent);
  
    closeSheet() {
      this.viewchildSheetRef()?.close({});
    }
}`;
