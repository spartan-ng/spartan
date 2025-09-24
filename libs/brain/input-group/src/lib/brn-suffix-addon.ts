import { Directive, input } from '@angular/core';

let uniqueIdCounter = 0;

@Directive({
	selector: '[brnSuffixAddon]',
	host: {
		'[id]': 'id()',
		'[attr.aria-label]': 'ariaLabel()',
		'[attr.data-type]': "'addon'",
	},
})
export class BrnSuffixAddon {
	public readonly id = input<string>(`brn-suffix-addon-${++uniqueIdCounter}`);
	public readonly ariaLabel = input<string>();
}
