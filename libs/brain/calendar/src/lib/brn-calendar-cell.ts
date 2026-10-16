import { Directive } from '@angular/core';

@Directive({
	selector: '[brnCalendarCell]',
	exportAs: 'brnCalendarCell',
	host: {
		role: 'presentation',
	},
})
export class BrnCalendarCell {}
