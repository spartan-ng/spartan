import { Directive, input, output } from '@angular/core';
import { BRN_CONFIRMATION_TOKEN } from './brn-confirmation.token';
import type { ConfirmationState } from './brn-confirmation.types';

@Directive({
	selector: '[brnConfirmation],brn-confirmation',
	exportAs: 'brnConfirmation',
	providers: [
		{
			provide: BRN_CONFIRMATION_TOKEN,
			useExisting: BrnConfirmation,
		},
	],
	host: {
		'data-slot': 'confirmation',
		role: 'group',
		'[attr.data-state]': 'state()',
	},
})
export class BrnConfirmation {
	/** Decision state. Once it is no longer `pending`, approve and reject are ignored. */
	public readonly state = input<ConfirmationState>('pending');

	/** Emits when the user approves the pending action. */
	public readonly approved = output<void>();

	/** Emits when the user rejects the pending action, with an optional reason. */
	public readonly rejected = output<string | undefined>();

	public requestApprove(): void {
		if (this.state() !== 'pending') {
			return;
		}
		this.approved.emit();
	}

	public requestReject(reason?: string): void {
		if (this.state() !== 'pending') {
			return;
		}
		this.rejected.emit(reason);
	}
}
