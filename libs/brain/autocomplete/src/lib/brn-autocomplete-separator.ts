import { Directive, input } from '@angular/core';

@Directive({
	selector: '[brnAutocompleteSeparator]',
	host: {
		role: 'separator',
		'[attr.aria-orientation]': 'orientation()',
		'[attr.data-orientation]': 'orientation()',
	},
})
export class BrnAutocompleteSeparator {
	public readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
}
