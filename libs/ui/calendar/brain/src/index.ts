export * from './lib/brn-calendar-cell-button.directive';
export * from './lib/brn-calendar-grid.directive';
export * from './lib/brn-calendar-header.directive';
export * from './lib/brn-calendar-next-button.directive';
export * from './lib/brn-calendar-previous-button.directive';
export * from './lib/brn-calendar-week.directive';
export * from './lib/brn-calendar-weekday.directive';
export * from './lib/brn-calendar.directive';
export * from './lib/brn-calendar.token';
export * from './lib/i18n/calendar-i18n';

import { NgModule } from '@angular/core';
import { BrnCalendarCellButtonDirective } from './lib/brn-calendar-cell-button.directive';
import { BrnCalendarGridDirective } from './lib/brn-calendar-grid.directive';
import { BrnCalendarHeaderDirective } from './lib/brn-calendar-header.directive';
import { BrnCalendarNextButtonDirective } from './lib/brn-calendar-next-button.directive';
import { BrnCalendarPreviousButtonDirective } from './lib/brn-calendar-previous-button.directive';
import { BrnCalendarWeekDirective } from './lib/brn-calendar-week.directive';
import { BrnCalendarWeekdayDirective } from './lib/brn-calendar-weekday.directive';
import { BrnCalendarDirective } from './lib/brn-calendar.directive';

export const BrnCalendarImports = [
	BrnCalendarCellButtonDirective,
	BrnCalendarGridDirective,
	BrnCalendarHeaderDirective,
	BrnCalendarNextButtonDirective,
	BrnCalendarPreviousButtonDirective,
	BrnCalendarWeekDirective,
	BrnCalendarWeekdayDirective,
	BrnCalendarDirective,
] as const;

@NgModule({
	imports: [...BrnCalendarImports],
	exports: [...BrnCalendarImports],
})
export class BrnCalendarModule {}
