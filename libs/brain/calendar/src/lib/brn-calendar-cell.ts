import { Directive } from '@angular/core';

@Directive({
	selector: '[brnCalendarCell]',
	host: {
		role: 'presentation',
	},
})
export class BrnCalendarCell {}
