import { NumberInput } from '@angular/cdk/coercion';
import { Component, computed, input, numberAttribute } from '@angular/core';
import { injectBrnInputOtp } from './brn-input-otp.token';

@Component({
	selector: 'brn-input-otp-slot',
	standalone: true,
	template: `
		{{ slot().char }}

		@if (slot().hasFakeCaret) {
			<ng-content />
		}
	`,
	host: {
		'[attr.data-active]': 'slot().isActive',
	},
})
export class BrnInputOtpSlotComponent {
	/** Access the input-otp component */
	protected readonly inputOtp = injectBrnInputOtp();

	public readonly index = input.required<number, NumberInput>({ transform: numberAttribute });

	public readonly slot = computed(() => this.inputOtp.context()[this.index()]);
}
