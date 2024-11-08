import { Component, type OnInit, inject } from '@angular/core';
import { BrnCalendarDirective, BrnCalendarModule, BrnCalendarService } from '../brain/src';

@Component({
	selector: 'hlm-react-daypicker-calendar',
	standalone: true,
	hostDirectives: [BrnCalendarDirective],
	imports: [BrnCalendarDirective, BrnCalendarModule],
	template: `
		`,
})
export class ReactDayCalendarComponent implements OnInit {
	private _brnCalendarService = inject(BrnCalendarService);
	view = this._brnCalendarService.view;

	ngOnInit(): void {}
}
