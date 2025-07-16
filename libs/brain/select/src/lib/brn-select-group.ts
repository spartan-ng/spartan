import { Directive, signal } from '@angular/core';

@Directive({
	selector: '[brnSelectGroup]',
	host: {
		role: 'group',
		'[attr.aria-labelledby]': 'labelledBy()',
	},
})
export class BrnSelectGroup {
	public readonly labelledBy = signal('');
}
