import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ConfirmationState } from '@spartan-ng/brain/confirmation';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmConfirmationImports } from '@spartan-ng/helm/confirmation';

@Component({
	selector: 'spartan-confirmation-reject-reason',
	imports: [HlmConfirmationImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex w-96 max-w-full flex-col gap-2">
			<div hlmConfirmation [state]="_state()" (rejected)="_reject($event)">
				<h4 hlmConfirmationTitle>Send invoice?</h4>
				<div hlmConfirmationActions>
					<button hlmBtn hlmConfirmationReject reason="Not allowed by policy" variant="outline" size="sm">
						Reject
					</button>
					<button hlmBtn hlmConfirmationApprove size="sm">Approve</button>
				</div>
			</div>
			@if (_reason()) {
				<p class="text-muted-foreground text-xs">Rejected: {{ _reason() }}</p>
			}
		</div>
	`,
})
export class ConfirmationRejectReason {
	protected readonly _state = signal<ConfirmationState>('pending');
	protected readonly _reason = signal('');

	protected _reject(reason?: string): void {
		this._reason.set(reason ?? '');
		this._state.set('rejected');
	}
}
