import { Directive, input } from '@angular/core';

let uniqueId = 0;

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'brn-hint',
	standalone: true,
	host: {
		'[id]': 'id()',
	},
})
export class BrnHintDirective {
	/** The unique id for the header */
	public readonly id = input(`brn-hint-${uniqueId++}`);
}
