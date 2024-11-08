import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { BrnCalendarService } from './brn-calendar.service';

@Component({
	selector: 'brn-calendar-month-year',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [DatePipe],
	template: `
    @if(view() === 'days'){
		{{previewDate() | date: 'MMMM yyyy'}}
    } @else if (view() === 'months'){
		{{previewDate() | date: 'yyyy'}}
	} @else {
         {{startingYear()}} - {{endingYear()}}
    }
    `,
})
export class BrnCalendarMonthYearComponent {
	private _brnCalendarService = inject(BrnCalendarService);
	protected view = this._brnCalendarService.view;

	protected previewDate = computed(() => this._brnCalendarService.previewDate());

	protected startingYear = computed(() => {
		const years = this._brnCalendarService.years();
		// First row and first index
		return years?.[0]?.[0];
	});
	protected endingYear = computed(() => {
		const years = this._brnCalendarService.years();
		// Last row and last index
		const lastRow = (years?.length ?? 1) - 1;
		return years?.[lastRow]?.[years[lastRow].length - 1];
	});
}
