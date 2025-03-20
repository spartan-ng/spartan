import { NumberInput } from '@angular/cdk/coercion';
import { Component, computed, input, numberAttribute } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BrnInputOtpSlotComponent } from '@spartan-ng/brain/input-otp';
import { type ClassValue } from 'clsx';
import { HlmInputOtpFakeCaretComponent } from './hlm-input-otp-fake-caret.component';

@Component({
	selector: 'hlm-input-otp-slot',
	standalone: true,
	imports: [BrnInputOtpSlotComponent, HlmInputOtpFakeCaretComponent],
	template: `
		<brn-input-otp-slot [index]="index()">
			<hlm-input-otp-fake-caret />
		</brn-input-otp-slot>
	`,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmInputOtpSlotComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	public readonly index = input.required<number, NumberInput>({ transform: numberAttribute });

	protected readonly _computedClass = computed(() =>
		hlm(
			'relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md',
			'has-[brn-input-otp-slot[data-active="true"]]:z-10 has-[brn-input-otp-slot[data-active="true"]]:ring-2 has-[brn-input-otp-slot[data-active="true"]]:ring-ring has-[brn-input-otp-slot[data-active="true"]]:ring-offset-background',
			this.userClass(),
		),
	);
}
