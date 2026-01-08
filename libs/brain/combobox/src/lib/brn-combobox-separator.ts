import { Directive, input } from '@angular/core';

@Directive({
	selector: '[brnComboboxSeparator]',
	host: {
		role: 'separator',
		'[attr.aria-orientation]': 'orientation()',
		'[attr.data-orientation]': 'orientation()',
	},
})
export class BrnComboboxSeparator {
	public readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
}
