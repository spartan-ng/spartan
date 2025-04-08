import { NgModule } from '@angular/core';
import { HlmCalendarMultiComponent } from './lib/hlm-calendar-multi.component';
import { HlmCalendarComponent } from './lib/hlm-calendar.component';

export * from './lib/hlm-calendar-multi.component';
export * from './lib/hlm-calendar.component';

export const HlmCalendarImports = [HlmCalendarComponent, HlmCalendarMultiComponent] as const;

@NgModule({
	imports: [...HlmCalendarImports],
	exports: [...HlmCalendarImports],
})
export class HlmCalendarModule {}
