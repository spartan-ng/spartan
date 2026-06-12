import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';

@Component({
	selector: 'spartan-sheet-no-close',
	imports: [HlmSheetImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-sheet side="right">
			<button variant="outline" hlmSheetTrigger hlmBtn>Open</button>
			<hlm-sheet-content *hlmSheetPortal="let ctx" [showCloseButton]="false">
				<hlm-sheet-header>
					<h3 hlmSheetTitle>No Close Button</h3>
					<p hlmSheetDescription>
						This sheet doesn't have a close button in the top-right corner. Click outside to close.
					</p>
				</hlm-sheet-header>
			</hlm-sheet-content>
		</hlm-sheet>
	`,
})
export class SheetNoClose {}
