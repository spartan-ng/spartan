import { Directive, input } from '@angular/core';

let uniqueIdCounter = 0;

@Directive({
	selector: '[brnPrefixAddon]',
	host: {
		'[id]': 'id()',
		'[attr.aria-label]': 'ariaLabel()',
		'[attr.data-type]': "'addon'",
	},
})
export class BrnPrefixAddon {
	public readonly id = input<string>(`brn-prefix-addon-${++uniqueIdCounter}`);
	public readonly ariaLabel = input<string>();
}
