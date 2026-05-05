import type { NumberInput } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';
import { BrnInputOtpSlot } from '@spartan-ng/brain/input-otp';
import { classes } from '@spartan-ng/helm/utils';
import { HlmInputOtpFakeCaret } from './hlm-input-otp-fake-caret';

@Component({
	selector: 'hlm-input-otp-slot',
	imports: [BrnInputOtpSlot, HlmInputOtpFakeCaret],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { 'data-slot': 'input-otp-slot' },
	template: `
		<brn-input-otp-slot [index]="index()">
			<hlm-input-otp-fake-caret />
		</brn-input-otp-slot>
	`,
})
export class HlmInputOtpSlot {
	/** The index of the slot to render the char or a fake caret */
	public readonly index = input.required<number, NumberInput>({ transform: numberAttribute });

	constructor() {
		classes(
			() =>
				'spartan-input-otp-slot relative flex items-center justify-center has-[brn-input-otp-slot[data-active="true"]]:z-10',
		);
	}
}
