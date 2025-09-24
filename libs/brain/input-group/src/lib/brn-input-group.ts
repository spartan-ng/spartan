import { Directive, input } from '@angular/core';

let uniqueIdCounter = 0;

@Directive({
	selector: '[brnInputGroup]',
	host: {
		'[id]': 'id()',
		'[attr.aria-label]': 'ariaLabel()',
	},
})
export class BrnInputGroup {
	public readonly id = input<string>(`brn-input-group-${++uniqueIdCounter}`);
	public readonly ariaLabel = input<string>();
}
