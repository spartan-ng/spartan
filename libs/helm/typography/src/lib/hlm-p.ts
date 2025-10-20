import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

export const hlmP = 'leading-7 [&:not(:first-child)]:mt-6';

@Directive({
	selector: '[hlmP]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmP {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm(hlmP, this.userClass()));
}
