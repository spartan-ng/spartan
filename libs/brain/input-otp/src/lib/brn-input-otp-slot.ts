import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, numberAttribute } from '@angular/core';
import { injectBrnInputOtp } from './brn-input-otp.token';

@Component({
	selector: 'brn-input-otp-slot',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[attr.data-active]': '_slot().isActive',
		'[attr.data-invalid]': '_ariaInvalid?.() ? "true" : null',
		'[attr.data-touched]': '_touched?.() ? "true" : null',
		'[attr.data-dirty]': '_dirty?.() ? "true" : null',
		'[attr.data-matches-spartan-invalid]': '_spartanInvalid() ? "true" : null',
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

	/** Whether to force the input into an invalid state. */
	public readonly forceInvalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	protected readonly _slot = computed(() => this._inputOtp.context()[this.index()]);

	protected readonly _ariaInvalid = this._inputOtp.invalid;
	protected readonly _touched = this._inputOtp.touched;
	protected readonly _dirty = this._inputOtp.dirty;
	protected readonly _spartanInvalid = computed(() => this.forceInvalid() || this._inputOtp.spartanInvalid?.());
}
