import { NgModule } from '@angular/core';
import { HlmCalendarComponent } from './lib/hlm-calendar.component';

export * from './lib/hlm-calendar.component';

@NgModule({
	imports: [HlmCalendarComponent],
	exports: [HlmCalendarComponent],
})
export class HlmCalendarModule {}
