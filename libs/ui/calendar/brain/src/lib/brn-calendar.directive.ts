import { Directive, type OnInit, effect, inject, input, output } from '@angular/core';
import { BrnCalendarService } from './brn-calendar.service';
import { CalendarMode, CalendarView } from './brn-calendar.types';
import { DateService } from './date.service';

let uniqueId = 0;

@Directive({
	selector: 'brn-calendar, [brnCalendar]',
	standalone: true,
	providers: [DateService, BrnCalendarService],
})
export class BrnCalendarDirective implements OnInit {
	private _brnCalendarService = inject(BrnCalendarService);

	mode = input<CalendarMode>('single');
	selectedDate = input<Date | null>(null);
	minDate = input<Date | null>(null);
	maxDate = input<Date | null>(null);
	startAt = input<Date | null>(null);
	startView = input<CalendarView>('days');
	dateFilter = input<(d: Date) => boolean>();
	locale = input<string>(this._brnCalendarService.getLocale());
	weekStartsOn = input<1 | 2 | 3 | 4 | 5 | 6 | 7>();
	dir = input<'ltr' | 'rtl'>();

	view = this._brnCalendarService.view;

	monthSelected = output<number | null>();
	selectedChange = output<Date | null>();
	viewChanged = output();
	yearSelected = output<number | null>();

	constructor() {
		effect(() => {
			this.selectedChange.emit(this._brnCalendarService.selectedDate());
		});
		effect(() => {
			this.monthSelected.emit(this._brnCalendarService.currentMonth());
		});
		effect(() => {
			this.yearSelected.emit(this._brnCalendarService.currentYear());
		});
	}

	ngOnInit(): void {
		this._brnCalendarService.state.update((state) => ({
			...state,
			id: `brn-calendar-${uniqueId++}`,
			mode: this.mode(),
			selectedDate: this.selectedDate(),
			minDate: this.minDate(),
			maxDate: this.maxDate(),
			startAt: this.startAt(),
			startView: this.startView(),
			dateFilter: this.dateFilter(),
			locale: this.locale(),
		}));

		this._brnCalendarService.generateDaysOfWeek();
		this._brnCalendarService.generateCalendar();
	}
}
