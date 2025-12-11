import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'brn-input-otp[hlmInputOtp], brn-input-otp[hlm]',
	host: {
		'data-slot': 'input-otp',
		'[class]': '_computedClass()',
	},
})
export class HlmInputOtp {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm('flex items-center gap-2 has-disabled:opacity-50', this.userClass()),
	);
}
