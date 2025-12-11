import { Directive, input } from '@angular/core';

let uniqueId = 0;

@Directive({
	selector: '[brnCalendarHeader]',
	host: {
		'[id]': 'id()',
		'aria-live': 'polite',
		role: 'presentation',
	},
})
export class BrnCalendarHeader {
	/** The unique id for the header */
	public readonly id = input<string>(`brn-calendar-header-${++uniqueId}`);
}
