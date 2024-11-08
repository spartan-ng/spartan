import { Directive } from '@angular/core';

let uniqueId = 0;

@Directive({
	selector: '[brnCalendarHeader]',
	standalone: true,
	host: {
		'[id]': 'id',
		'[attr.aria-live]': 'polite',
		role: 'presentation',
	},
})
export class BrnCalendarHeaderDirective {
	/** The unique id for the header */
	readonly id = `brn-calendar-header-${uniqueId++}`;
}
