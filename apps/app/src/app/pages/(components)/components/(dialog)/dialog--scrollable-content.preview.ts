import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-dialog-scrollable-content',
	imports: [HlmDialogImports, HlmFieldImports, HlmInputImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-dialog>
			<button hlmDialogTrigger hlmBtn variant="outline">Scrollable Content</button>
			<hlm-dialog-content *hlmDialogPortal="let ctx" class="sm:max-w-sm">
				<hlm-dialog-header>
					<h3 hlmDialogTitle>Scrollable Content</h3>
					<p hlmDialogDescription>This is a dialog with scrollable content.</p>
				</hlm-dialog-header>
				<div class="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
					@for (item of items; track item) {
						<p class="mb-4 leading-normal">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
							ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
							fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
							mollit anim id est laborum.
						</p>
					}
				</div>
			</hlm-dialog-content>
		</hlm-dialog>
	`,
})
export class DialogScrollableContent {
	protected readonly items = Array.from({ length: 5 }, (_, i) => i + 1);
}
