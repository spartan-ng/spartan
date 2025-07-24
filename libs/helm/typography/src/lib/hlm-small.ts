import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

export const hlmSmall = 'text-sm font-medium leading-none';

@Directive({
	selector: '[hlmSmall]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSmall {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm(hlmSmall, this.userClass()));
}
