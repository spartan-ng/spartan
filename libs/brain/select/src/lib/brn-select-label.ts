import { Directive, input } from '@angular/core';

@Directive({
	selector: '[brnSelectLabel]',
	host: {
		'[id]': 'id()',
	},
})
export class BrnSelectLabel {
	private static _id = 0;

	public readonly id = input<string>(`brn-select-label-${++BrnSelectLabel._id}`);
}
