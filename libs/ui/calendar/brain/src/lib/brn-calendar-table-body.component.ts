import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, type TemplateRef, computed, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BrnCalendarService } from './brn-calendar.service';

@Component({
	selector: 'brn-calendar-table-body',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet],
	styles: [
		`:host: {
        display: contents;
        }`,
	],
	template: `<tbody role="rowgroup">
            @for(week of this.calendarWeeks();  track $index){
                <tr class="flex w-full mt-2">
                    @for(day of week;  let idx = $index; track day?.date ){
                        @if(dayCellTemplate()){
                            <ng-container *ngTemplateOutlet="dayCellTemplate() ?? null; context: { $implicit: day?.date,isToday: _brnCalendarService.isToday(day?.date) }"></ng-container>
                        } @else {
                            <td><button>{{day?.date?.getDate()}} </button></td>
                        }
                    }
                </tr>
            }
        </tbody>`,
})
export class BrnCalendarTableBodyComponent {
	protected _brnCalendarService = inject(BrnCalendarService);
	protected calendarWeeks = computed(() => this._brnCalendarService.calendarWeeks());
	protected previewDate = computed(() => this._brnCalendarService.previewDate());
	protected daysOfTheWeek = computed(() => this._brnCalendarService.daysOfTheWeek());

	readonly dayCellTemplate = input<TemplateRef<{ $implicit: Date; isToday: boolean }>>();

	constructor() {
		this._brnCalendarService.previewDate$
			.pipe(takeUntilDestroyed())
			.subscribe(() => this._brnCalendarService.isView('days') && this._brnCalendarService.generateCalendar());
	}
}
