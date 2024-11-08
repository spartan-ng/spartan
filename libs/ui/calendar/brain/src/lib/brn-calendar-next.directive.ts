import { Directive, inject } from '@angular/core';
import { rxHostPressedListener } from '@spartan-ng/ui-core';
import { BrnCalendarService } from './brn-calendar.service';

@Directive({
	selector: 'brn-calendar-next-btn, [brnCalendarNextBtn]',
	standalone: true,
	host: {
		type: 'button',
	},
})
export class BrnCalendarNextBtnDirective {
	private readonly _hostPressedListener = rxHostPressedListener();
	private readonly _brnCalendarService = inject(BrnCalendarService);

	constructor() {
		this._hostPressedListener.subscribe(() => this._brnCalendarService.navigate('next'));
	}
}
