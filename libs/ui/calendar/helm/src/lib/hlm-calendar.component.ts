import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { BrnCalendarDirective, BrnCalendarModule, BrnCalendarService } from '@spartan-ng/ui-calendar-brain';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmCalendarDayCellDirective } from './hlm-calendar-day-cell.directive';
import { HlmCalendarHeaderComponent } from './hlm-calendar-header.component';
import { HlmCalendarNextButtonDirective } from './hlm-calendar-next-button.directive';
import { HlmCalendarPreviousButtonDirective } from './hlm-calendar-previous-button.directive';

@Component({
	selector: 'hlm-calendar',
	standalone: true,
	hostDirectives: [{ directive: BrnCalendarDirective, outputs: ['selectedChange:selectedChange'] }],
	host: {
		class: 'block p-3 rounded-md border max-w-fit',
	},
	imports: [
		BrnCalendarModule,
		HlmCalendarHeaderComponent,
		HlmCalendarPreviousButtonDirective,
		HlmCalendarNextButtonDirective,
		HlmCalendarDayCellDirective,
		HlmIconComponent,
		NgClass,
	],
	providers: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
	template: `
	<div class="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0">
		<div class="space-y-4">
		<brn-calendar-header hlm>

		    <!-- Probably pick one of these Calendar Header Displays or we canjust have a switch case or something -->
        	<!-- 1. Similar to material will be a button to switch between views-->
			<!-- <brn-calendar-view-switcher> -->
				<!-- This will render the actual month year or year range content depending on view-->
				<!-- <brn-calendar-month-year/>
			</brn-calendar-view-switcher> -->

			<brn-calendar-previous-btn hlm>
				<hlm-icon size="sm" name="lucideChevronLeft" />
        	</brn-calendar-previous-btn>

			<!-- 2. This will render the actual month year or year range content used standalone-->
			<brn-calendar-month-year/>

			<brn-calendar-next-btn hlm>
				<hlm-icon size="sm" name="lucideChevronRight" />
        	</brn-calendar-next-btn> 


			<!-- 3. Will be similar to select dropdowns in react calendar for month and year-->
			<!-- <brn-calendar-month-dropdown/>
			<brn-calendar-year-dropdown>-->
		</brn-calendar-header>
			<ng-template #yearCellTemplate let-year>
				@if(year){
                 <td class="rounded-md w-9 font-normal text-[0.8rem]" role="presentation">
					<button  class="w-full" hlmCalendarDayCell [value]="year?.getFullYear()">
						{{year?.getFullYear()}}
					</button>
				</td>
				} @else {
                <td class="w-9" role="presentation"></td>
				}
			</ng-template>

		<!-- Maybe change this month display  -->
			<table brnCalendarDisplay class="w-full border-collapse space-y-1 flex flex-col">
				<brn-calendar-days-of-the-week [dayOfWeekCelltemplate]="dayOfWeekTemplate" hlm/>
				<brn-calendar-table-body [dayCellTemplate]="dayOfMonthTemplate" hlm/>
		 	</table>

			<ng-template #dayOfWeekTemplate let-weekday>
                 <th class="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]">{{weekday}}</th>
			</ng-template>

			<ng-template #dayOfMonthTemplate let-day let-isToday="isToday">
				@if(day){
                 <td class="rounded-md w-9 font-normal text-[0.8rem]" role="presentation">
					<button  hlmCalendarDayCell [value]="day" [class.bg-accent]="isToday">
						{{day?.getDate()}}
					</button>
				</td>
				} @else {
                <td class="w-9" role="presentation"></td>
				}
			</ng-template>
		</div>
	</div>
		`,
})
export class HlmCalendarComponent {
	private _brnCalendarService = inject(BrnCalendarService);
	view = this._brnCalendarService.view;
}
