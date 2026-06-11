import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-dialog-no-close-button',
	imports: [HlmDialogImports, HlmFieldImports, HlmInputImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-dialog>
			<button hlmDialogTrigger hlmBtn variant="outline">No Close Button</button>
			<hlm-dialog-content [showCloseButton]="false" *hlmDialogPortal="let ctx" class="sm:max-w-sm">
				<hlm-dialog-header>
					<h3 hlmDialogTitle>No Close Button</h3>
					<p hlmDialogDescription>This dialog does not have a close button in the header.</p>
				</hlm-dialog-header>
			</hlm-dialog-content>
		</hlm-dialog>
	`,
})
export class DialogNoCloseButton {}
