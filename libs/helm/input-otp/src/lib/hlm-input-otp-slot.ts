import type { NumberInput } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, computed, input, numberAttribute } from '@angular/core';
import { BrnInputOtpSlot } from '@spartan-ng/brain/input-otp';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';
import { HlmInputOtpFakeCaret } from './hlm-input-otp-fake-caret';

@Component({
	selector: 'hlm-input-otp-slot',
	imports: [BrnInputOtpSlot, HlmInputOtpFakeCaret],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'input-otp-slot',
		'[class]': '_computedClass()',
	},
	template: `
		<brn-input-otp-slot [index]="index()">
			<hlm-input-otp-fake-caret />
		</brn-input-otp-slot>
	`,
})
export class HlmInputOtpSlot {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	/** The index of the slot to render the char or a fake caret */
	public readonly index = input.required<number, NumberInput>({ transform: numberAttribute });

	protected readonly _computedClass = computed(() =>
		hlm(
			'dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md',
			'has-[brn-input-otp-slot[data-active="true"]]:border-ring has-[brn-input-otp-slot[data-active="true"]]:ring-ring/50 has-[brn-input-otp-slot[data-active="true"]]:z-10 has-[brn-input-otp-slot[data-active="true"]]:ring-[3px]',
			this.userClass(),
		),
	);
}
