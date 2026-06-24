import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';

@Component({
	selector: 'spartan-sheet-from-dropdown-preview',
	imports: [HlmSheetImports, HlmDropdownMenuImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu">Options</button>

		<!-- Keep the sheet outside the dropdown's ng-template so closing the menu does not destroy it. -->
		<hlm-sheet #sheet="hlmSheet" side="right">
			<hlm-sheet-content *hlmSheetPortal="let ctx">
				<hlm-sheet-header>
					<h3 hlmSheetTitle>Edit Profile</h3>
					<p hlmSheetDescription>Make changes to your profile here. Click save when you're done.</p>
				</hlm-sheet-header>
				<hlm-sheet-footer>
					<button hlmBtn type="submit">Save Changes</button>
					<button hlmSheetClose hlmBtn variant="outline">Close</button>
				</hlm-sheet-footer>
			</hlm-sheet-content>
		</hlm-sheet>

		<ng-template #menu>
			<hlm-dropdown-menu class="w-40">
				<button hlmDropdownMenuItem (click)="sheet.open()">Edit Profile</button>
				<button hlmDropdownMenuItem>Duplicate</button>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem>Delete</button>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class SheetFromDropdownPreview {}
