import { Directive, input } from '@angular/core';

let uniqueId = 0;

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'brn-error',
	standalone: true,
	host: {
		'[id]': 'id()',
	},
})
export class BrnErrorDirective {
	/** The unique id for the header */
	public readonly id = input(`brn-error-${uniqueId++}`);
}
