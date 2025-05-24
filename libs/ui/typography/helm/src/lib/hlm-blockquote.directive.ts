import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

export const hlmBlockquote = 'mt-6 border-border border-l-2 pl-6 italic';

@Directive({
	selector: '[hlmBlockquote]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmBlockquoteDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm(hlmBlockquote, this.userClass()));
}
