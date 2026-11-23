import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ConfirmationState } from '@spartan-ng/brain/confirmation';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmConfirmationImports } from '@spartan-ng/helm/confirmation';

@Component({
	selector: 'spartan-confirmation-preview',
	imports: [HlmConfirmationImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			hlmConfirmation
			class="w-96 max-w-full"
			[state]="_state()"
			(approved)="_state.set('approved')"
			(rejected)="_state.set('rejected')"
		>
			<div>
				<h4 hlmConfirmationTitle>Delete 1,420 records?</h4>
				<p hlmConfirmationDescription>The agent wants to remove inactive users from the archive table.</p>
			</div>
			<div hlmConfirmationActions>
				<button hlmBtn hlmConfirmationReject variant="outline" size="sm">Reject</button>
				<button hlmBtn hlmConfirmationApprove size="sm">Approve</button>
			</div>
			@if (_state() !== 'pending') {
				<p class="text-muted-foreground text-xs">You {{ _state() }} this action.</p>
			}
		</div>
	`,
})
export class ConfirmationPreview {
	protected readonly _state = signal<ConfirmationState>('pending');
}

export const defaultImports = `
import { HlmConfirmationImports } from '@spartan-ng/helm/confirmation';
import { HlmButtonImports } from '@spartan-ng/helm/button';
`;

export const defaultSkeleton = `
<div hlmConfirmation [state]="state()" (approved)="onApprove()" (rejected)="onReject($event)">
  <h4 hlmConfirmationTitle>Delete 1,420 records?</h4>
  <p hlmConfirmationDescription>The agent wants to remove inactive users.</p>

  <div hlmConfirmationActions>
    <button hlmBtn hlmConfirmationReject variant="outline">Reject</button>
    <button hlmBtn hlmConfirmationApprove>Approve</button>
  </div>
</div>
`;
