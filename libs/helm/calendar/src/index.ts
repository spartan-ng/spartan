import { NgModule } from '@angular/core';
import { HlmCalendar } from './lib/hlm-calendar';
import { HlmCalendarMulti } from './lib/hlm-calendar-multi';
import { HlmCalendarRange } from './lib/hlm-calendar-range';

export * from './lib/hlm-calendar';
export * from './lib/hlm-calendar-multi';
export * from './lib/hlm-calendar-range';

export const HlmCalendarImports = [HlmCalendar, HlmCalendarMulti, HlmCalendarRange] as const;

@NgModule({
	imports: [...HlmCalendarImports],
	exports: [...HlmCalendarImports],
})
export class HlmCalendarModule {}
