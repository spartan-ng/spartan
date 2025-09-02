import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import { type ClassValue } from 'clsx';

@Directive({
	selector: 'brn-input-otp[hlmInputOtp], brn-input-otp[hlm]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmInputOtp {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm('has-disabled:opacity-50 flex items-center gap-2', this.userClass()),
	);
}
