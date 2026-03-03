import type { NumberInput } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, computed, inject, input, numberAttribute } from '@angular/core';
import { BrnInputOtpMask } from './brn-input-otp-mask';
import { injectBrnInputOtp } from './brn-input-otp.token';
import { MaskValuePipe } from './util/mask-value-pipe';

@Component({
	selector: 'brn-input-otp-slot',
	imports: [MaskValuePipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[attr.data-active]': '_slot().isActive',
	},
	template: `
		{{ _slot().char | maskValue: _hasMask() : 200 }}
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
	public readonly mask = input<boolean | undefined>(undefined);

	/** Optional group-level mask directive (provided by hlmInputOtpGroup hostDirectives) */
	protected readonly _groupMask = inject(BrnInputOtpMask, { optional: true });

	protected readonly _slot = computed(() => this._inputOtp.context()[this.index()]);

	protected readonly _hasMask = computed(() => {
		return this.mask() ?? this._groupMask?.mask() ?? this._inputOtp.mask();
	});
}
