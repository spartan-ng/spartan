import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

export const hlmP = 'leading-7 [&:not(:first-child)]:mt-6';

@Directive({
	selector: '[hlmP]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmPDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm(hlmP, this.userClass()));
}
