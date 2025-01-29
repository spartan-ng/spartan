import { NgModule } from '@angular/core';
import { HlmDatePickerComponent } from './lib/hlm-date-picker.component';

export * from './lib/hlm-date-format.token';

export * from './lib/hlm-date-picker.component';

@NgModule({
	imports: [HlmDatePickerComponent],
	exports: [HlmDatePickerComponent],
})
export class HlmDatePickerModule {}
