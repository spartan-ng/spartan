import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

export const hlmH2 =
	'scroll-m-20 border-border border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0';

@Directive({
	selector: '[hlmH2]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmH2 {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm(hlmH2, this.userClass()));
}
