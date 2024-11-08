import { Component, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { BrnCalendarDirective, BrnCalendarModule, BrnCalendarService } from '../brain/src';
import { HlmCalendarModule } from '../helm/src';

@Component({
	selector: 'hlm-material-calendar',
	standalone: true,
	hostDirectives: [BrnCalendarDirective],
	host: {
		class: 'block p-3 rounded-md border max-w-fit',
	},
	imports: [BrnCalendarModule, HlmCalendarModule, HlmIconComponent],
	providers: [provideIcons({ lucideChevronLeft, lucideChevronRight, lucideChevronDown })],
	template: `
		<div class="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 h-[354px]">
			<div class="space-y-4">
				<brn-calendar-header hlm>
					<brn-calendar-view-switcher class="flex justify-center items-center gap-1 hover:bg-accent hover:text-accent-foreground rounded-full px-2 h-7">
						<brn-calendar-month-year/>
						<hlm-icon size="sm" name="lucideChevronDown" />
					</brn-calendar-view-switcher>
					
					<div class="flex">
						<brn-calendar-previous-btn class="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0">
								<hlm-icon size="sm" name="lucideChevronLeft" />
						</brn-calendar-previous-btn>

						<brn-calendar-next-btn class="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0">
								<hlm-icon size="sm" name="lucideChevronRight" />
						</brn-calendar-next-btn> 
					</div>
				</brn-calendar-header>

		 @if(view() === 'years'){
			<table brnCalendarDisplay class="w-full border-collapse space-y-1 flex flex-col">
				<brn-calendar-year-display [yearTemplate]="yearCellTemplate" hlm/>
		 	</table>

			<ng-template #yearCellTemplate let-year>
				@if(year){
                 <td class="rounded-md w-16 font-normal text-[1.4rem]" role="presentation">
					<button  hlmCalendarDayCell [value]="year">
						{{year}}
					</button>
				</td>
				} @else {
                <td class="w-9" role="presentation"></td>
				}
			</ng-template>

		 } @else if(view() === 'months') { 
			<table brnCalendarDisplay class="w-full border-collapse space-y-1 flex flex-col">
				 <brn-calendar-month-display hlm [monthTemplate]="monthTemplate"/>
				<ng-template #monthTemplate let-month let-index=index>
					<td><button hlmCalendarDayCell  [value]="index" class="w-14 h-9 rounded-full hover:bg-accent hover:text-accent-foreground">{{month}}</button></td>
				</ng-template>
		 	</table>
		 } @else {
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
		 }
			</div>
			</div>`,
})
export class MaterialStyleCalendarComponent {
	private _brnCalendarService = inject(BrnCalendarService);
	protected view = this._brnCalendarService.view;
}
