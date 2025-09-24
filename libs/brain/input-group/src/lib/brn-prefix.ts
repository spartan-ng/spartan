import { Directive, input } from '@angular/core';

let uniqueIdCounter = 0;

@Directive({
	selector: '[brnPrefix]',
	exportAs: 'brnPrefix',
	host: {
		'[id]': 'id()',
		'[attr.aria-hidden]': 'true',
		'[attr.aria-label]': 'ariaLabel()',
		'[attr.data-type]': "'inline'",
	},
})
export class BrnPrefix {
	public readonly id = input<string>(`brn-prefix-${++uniqueIdCounter}`);
	public readonly ariaLabel = input<string>();
}
