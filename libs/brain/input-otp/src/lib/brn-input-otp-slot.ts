import type { NumberInput } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, computed, input, numberAttribute } from '@angular/core';
import { injectBrnInputOtp } from './brn-input-otp.token';

@Component({
	selector: 'brn-input-otp-slot',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[attr.data-active]': '_slot().isActive',
	},
	template: `
		{{ _slot().char }}

		@if (_slot().hasFakeCaret) {
			<ng-content />
		}
	`,
})
export class BrnInputOtpSlot {
	/** Access the input-otp component */
	protected readonly _inputOtp = injectBrnInputOtp();

	/** The index of the slot to render the char or a fake caret */
	public readonly index = input.required<number, NumberInput>({ transform: numberAttribute });

	protected readonly _slot = computed(() => this._inputOtp.context()[this.index()]);
}
