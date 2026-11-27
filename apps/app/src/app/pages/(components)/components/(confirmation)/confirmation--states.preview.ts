import { ChangeDetectionStrategy, Component } from '@angular/core';
import { type ConfirmationState } from '@spartan-ng/brain/confirmation';
import { HlmConfirmationImports } from '@spartan-ng/helm/confirmation';

@Component({
	selector: 'spartan-confirmation-states',
	imports: [HlmConfirmationImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex w-96 max-w-full flex-col gap-3">
			@for (state of _states; track state) {
				<div hlmConfirmation [state]="state">
					<h4 hlmConfirmationTitle>Run migration?</h4>
					<p hlmConfirmationDescription>State: {{ state }}</p>
				</div>
			}
		</div>
	`,
})
export class ConfirmationStates {
	protected readonly _states: ConfirmationState[] = ['pending', 'approved', 'rejected'];
}
