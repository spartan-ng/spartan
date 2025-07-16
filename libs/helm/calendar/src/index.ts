import { NgModule } from '@angular/core';
import { HlmCalendar } from './lib/hlm-calendar';
import { HlmCalendarMulti } from './lib/hlm-calendar-multi';

export * from './lib/hlm-calendar';
export * from './lib/hlm-calendar-multi';

export const HlmCalendarImports = [HlmCalendar, HlmCalendarMulti] as const;

@NgModule({
	imports: [...HlmCalendarImports],
	exports: [...HlmCalendarImports],
})
export class HlmCalendarModule {}
