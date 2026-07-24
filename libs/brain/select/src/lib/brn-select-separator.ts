import { Directive, input } from '@angular/core';

@Directive({
	selector: '[brnSelectSeparator]',
	host: {
		role: 'separator',
		'[attr.aria-orientation]': 'orientation()',
		'[attr.data-orientation]': 'orientation()',
	},
})
export class BrnSelectSeparator {
	public readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
}
