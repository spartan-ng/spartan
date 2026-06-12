import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';

@Component({
	selector: 'spartan-sheet-side-preview',
	imports: [HlmSheetImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-sheet>
			<div class="flex flex-wrap gap-2">
				<button id="top" hlmSheetTrigger side="top" hlmBtn variant="outline">Top</button>
				<button id="right" hlmSheetTrigger side="right" hlmBtn variant="outline">Right</button>
				<button id="bottom" hlmSheetTrigger side="bottom" hlmBtn variant="outline">Bottom</button>
				<button id="left" hlmSheetTrigger side="left" hlmBtn variant="outline">Left</button>
			</div>
			<hlm-sheet-content *hlmSheetPortal="let ctx" class="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]">
				<hlm-sheet-header>
					<h3 hlmSheetTitle>Edit profile</h3>
					<p hlmSheetDescription>Make changes to your profile here. Click save when you're done.</p>
				</hlm-sheet-header>
				<div class="no-scrollbar overflow-y-auto px-4">
					@for (item of _items; track item) {
						<p class="mb-4 leading-normal">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
							ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
							fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
							mollit anim id est laborum.
						</p>
					}
				</div>
				<hlm-sheet-footer>
					<button hlmBtn>Save changes</button>
					<button hlmBtn variant="outline" hlmSheetClose>Cancel</button>
				</hlm-sheet-footer>
			</hlm-sheet-content>
		</hlm-sheet>
	`,
})
export class SheetSidePreview {
	protected readonly _items = Array.from({ length: 10 }, (_, i) => i + 1);
}
