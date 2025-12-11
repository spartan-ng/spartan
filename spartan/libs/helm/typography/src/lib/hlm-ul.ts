import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

export const hlmUl = 'my-6 ml-6 list-disc [&>li]:mt-2';

@Directive({
	selector: '[hlmUl]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmUl {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm(hlmUl, this.userClass()));
}
