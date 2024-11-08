import { Directive, inject } from '@angular/core';
import { rxHostPressedListener } from '@spartan-ng/ui-core';
import { BrnCalendarService } from './brn-calendar.service';

@Directive({
	selector: 'brn-calendar-previous-btn, [brnCalendarPreviousBtn]',
	standalone: true,
	host: {
		type: 'button',
	},
})
export class BrnCalendarPreviousBtnDirective {
	private readonly _hostPressedListener = rxHostPressedListener();
	private readonly _brnCalendarService = inject(BrnCalendarService);

	constructor() {
		this._hostPressedListener.subscribe(() => this._brnCalendarService.navigate('previous'));
	}
}
