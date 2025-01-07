import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

export const hlmLarge = 'text-lg font-semibold';

@Directive({
	selector: '[hlmLarge]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmLargeDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm(hlmLarge, this.userClass()));
}
