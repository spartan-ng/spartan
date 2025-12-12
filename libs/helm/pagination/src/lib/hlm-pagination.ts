import { Directive, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmPagination],hlm-pagination',
	host: {
		'data-slot': 'pagination',
		role: 'navigation',
		'[attr.aria-label]': 'ariaLabel()',
	},
})
export class HlmPagination {
	/** The aria-label for the pagination component. */
	public readonly ariaLabel = input<string>('pagination', { alias: 'aria-label' });

	constructor() {
		classes(() => 'mx-auto flex w-full justify-center');
	}
}
