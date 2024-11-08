import { Directive, type TemplateRef, computed, inject, input } from '@angular/core';
import { BrnCalendarService } from './brn-calendar.service';

@Directive({
	selector: 'table[brnCalendarDisplay]',
	standalone: true,
})
export class BrnCalendarDisplayDirective {
	private _brnCalendarService = inject(BrnCalendarService);

	protected currentMonthYearDays = computed(() => this._brnCalendarService.calendarWeeks());
	protected daysOfTheWeek = computed(() => this._brnCalendarService.daysOfTheWeek());

	dayOfWeekCelltemplate = input<TemplateRef<HTMLElement>>();

	dayCellTemplate = input<TemplateRef<HTMLElement>>();
}
