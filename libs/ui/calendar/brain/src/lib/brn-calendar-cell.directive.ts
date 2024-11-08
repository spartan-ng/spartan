import { Directive } from '@angular/core';

@Directive({
	selector: '[brnCalendarCell]',
	standalone: true,
	host: {
		role: 'presentation',
	},
})
export class BrnCalendarCellDirective {}
