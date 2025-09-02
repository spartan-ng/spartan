export * from './lib/brn-calendar';
export * from './lib/brn-calendar-cell';
export * from './lib/brn-calendar-cell-button';
export * from './lib/brn-calendar-grid';
export * from './lib/brn-calendar-header';
export * from './lib/brn-calendar-next-button';
export * from './lib/brn-calendar-previous-button';
export * from './lib/brn-calendar-week';
export * from './lib/brn-calendar-weekday';
export * from './lib/brn-calendar.token';
export * from './lib/i18n/calendar-i18n';
export * from './lib/mode/brn-calendar-multiple';
export * from './lib/mode/brn-calendar-range';

import { NgModule } from '@angular/core';
import { BrnCalendar } from './lib/brn-calendar';
import { BrnCalendarCell } from './lib/brn-calendar-cell';
import { BrnCalendarCellButton } from './lib/brn-calendar-cell-button';
import { BrnCalendarGrid } from './lib/brn-calendar-grid';
import { BrnCalendarHeader } from './lib/brn-calendar-header';
import { BrnCalendarNextButton } from './lib/brn-calendar-next-button';
import { BrnCalendarPreviousButton } from './lib/brn-calendar-previous-button';
import { BrnCalendarWeek } from './lib/brn-calendar-week';
import { BrnCalendarWeekday } from './lib/brn-calendar-weekday';
import { BrnCalendarMulti } from './lib/mode/brn-calendar-multiple';
import { BrnCalendarRange } from './lib/mode/brn-calendar-range';

export const BrnCalendarImports = [
	BrnCalendarCellButton,
	BrnCalendarGrid,
	BrnCalendarHeader,
	BrnCalendarNextButton,
	BrnCalendarPreviousButton,
	BrnCalendarWeek,
	BrnCalendarWeekday,
	BrnCalendar,
	BrnCalendarCell,
	BrnCalendarMulti,
	BrnCalendarRange,
] as const;

@NgModule({
	imports: [...BrnCalendarImports],
	exports: [...BrnCalendarImports],
})
export class BrnCalendarModule {}
