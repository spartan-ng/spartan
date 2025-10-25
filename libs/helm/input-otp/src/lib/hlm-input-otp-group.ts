import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmInputOtpGroup]',
	host: {
		'data-slot': 'input-otp-group',
		'[class]': '_computedClass()',
	},
})
export class HlmInputOtpGroup {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() => hlm('flex items-center', this.userClass()));
}
