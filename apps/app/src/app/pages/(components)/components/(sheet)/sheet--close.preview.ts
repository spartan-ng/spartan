import { Component, viewChild } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCross } from '@ng-icons/lucide';
import { BrnSheet, BrnSheetImports } from '@spartan-ng/brain/sheet';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';

@Component({
	selector: 'spartan-sheet-close-preview',
	imports: [BrnSheetImports, HlmSheetImports, HlmButtonImports, HlmLabelImports],
	providers: [provideIcons({ lucideCross })],
	template: `
		<hlm-sheet #sheetRef side="right">
			<button id="edit-profile" variant="outline" hlmSheetTrigger hlmBtn>Open</button>
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
export class SheetClosePreview {
	public readonly viewchildSheetRef = viewChild(BrnSheet);

	closeSheet() {
		this.viewchildSheetRef()?.close({});
	}
}
