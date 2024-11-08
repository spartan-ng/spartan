import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, type TemplateRef, computed, inject, input } from '@angular/core';
import { BrnCalendarService } from './brn-calendar.service';

@Component({
	selector: 'brn-calendar-days-of-the-week',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet],
	styles: [
		`:host: {
        display: contents;
    }`,
	],
	template: `<thead>
                <tr class="flex">
                @for(weekday of daysOfTheWeek(); track $index){
                    @if(dayOfWeekCelltemplate()){
                     <ng-container *ngTemplateOutlet="dayOfWeekCelltemplate() ?? null; context: { $implicit: weekday }"></ng-container>
                    } @else {
                         <th>{{weekday}}</th>
                    }
                }
                </tr>
            </thead>
            `,
})
export class BrnCalendarDaysOfTheWeekComponent {
	private _brnCalendarService = inject(BrnCalendarService);

	protected currentMonthYearDays = computed(() => this._brnCalendarService.calendarWeeks());
	protected daysOfTheWeek = computed(() => this._brnCalendarService.daysOfTheWeek());

	dayOfWeekCelltemplate = input<TemplateRef<{ $implicit: string }>>();
}
