import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { type ClassValue } from 'clsx';

@Directive({
	selector: '[hlmInputOtpGroup]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmInputOtpGroup {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() => hlm('flex items-center', this.userClass()));
}
