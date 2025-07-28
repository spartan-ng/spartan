import { Component, viewChild } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCross } from '@ng-icons/lucide';
import {
	BrnSheetCloseDirective,
	BrnSheetComponent,
	BrnSheetContentDirective,
	BrnSheetTriggerDirective,
} from '@spartan-ng/brain/sheet';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmLabelDirective } from '@spartan-ng/helm/label';
import {
	HlmSheetComponent,
	HlmSheetContentComponent,
	HlmSheetHeaderComponent,
	HlmSheetTitleDirective,
} from '@spartan-ng/helm/sheet';

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
				<div class="grid flex-1 auto-rows-min gap-6 px-4">
					<div class="grid gap-3">
						<label hlmLabel>Close sheet by directive</label>
						<button hlmBtn brnSheetClose>Close</button>
					</div>
					<div class="grid gap-3">
						<label hlmLabel>Close sheet by reference</label>
						<button hlmBtn (click)="sheetRef.close({})">Close</button>
					</div>
					<div class="grid gap-3">
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
