import { NgModule } from '@angular/core';
import { HlmCalendarDayCellDirective } from './lib/hlm-calendar-day-cell.directive';
import { HlmCalendarHeaderComponent } from './lib/hlm-calendar-header.component';
import { HlmCalendarMonthYearComponent } from './lib/hlm-calendar-month-year.component';
import { HlmCalendarNextButtonDirective } from './lib/hlm-calendar-next-button.directive';
import { HlmCalendarPreviousButtonDirective } from './lib/hlm-calendar-previous-button.directive';
import { HlmCalendarComponent } from './lib/hlm-calendar.component';

export * from './lib/hlm-calendar.component';
export * from './lib/hlm-calendar-day-cell.directive';
export * from './lib/hlm-calendar-header.component';
export * from './lib/hlm-calendar-month-year.component';
export * from './lib/hlm-calendar-next-button.directive';
export * from './lib/hlm-calendar-previous-button.directive';

export const HlmCalendarImports = [
	HlmCalendarComponent,
	HlmCalendarDayCellDirective,
	HlmCalendarHeaderComponent,
	HlmCalendarMonthYearComponent,
	HlmCalendarNextButtonDirective,
	HlmCalendarPreviousButtonDirective,
] as const;

@NgModule({
	imports: [...HlmCalendarImports],
	exports: [...HlmCalendarImports],
})
export class HlmCalendarModule {}
