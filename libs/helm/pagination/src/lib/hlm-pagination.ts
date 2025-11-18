import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmPagination],hlm-pagination',
	host: {
		'data-slot': 'pagination',
		role: 'navigation',
		'[class]': '_computedClass()',
		'[attr.aria-label]': 'ariaLabel()',
	},
})
export class HlmPagination {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('mx-auto flex w-full justify-center', this.userClass()));

	/** The aria-label for the pagination component. */
	public readonly ariaLabel = input<string>('pagination', { alias: 'aria-label' });
}
