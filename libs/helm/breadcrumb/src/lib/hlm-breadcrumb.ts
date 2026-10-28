import { Directive, input } from '@angular/core';

@Directive({
	selector: '[hlmBreadcrumb]',
	exportAs: 'hlmBreadcrumb',
	host: {
		'data-slot': 'breadcrumb',
		role: 'navigation',
		'[attr.aria-label]': 'ariaLabel()',
	},
})
export class HlmBreadcrumb {
	public readonly ariaLabel = input<string>('breadcrumb', { alias: 'aria-label' });
}
