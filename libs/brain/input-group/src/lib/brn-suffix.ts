import { Directive, input } from '@angular/core';

let uniqueIdCounter = 0;

@Directive({
	selector: '[brnSuffix]',
	host: {
		'[id]': 'id()',
		'[attr.aria-hidden]': 'true',
		'[attr.aria-label]': 'ariaLabel()',
		'[attr.data-type]': "'inline'",
	},
})
export class BrnSuffix {
	public readonly id = input<string>(`brn-suffix-${++uniqueIdCounter}`);
	public readonly ariaLabel = input<string>();
}
