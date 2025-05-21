import { NgModule } from '@angular/core';
import { HlmDatePickerMultiComponent } from './lib/hlm-date-picker-multi.component';
import { HlmDatePickerComponent } from './lib/hlm-date-picker.component';

export * from './lib/hlm-date-picker.token';

export * from './lib/hlm-date-picker-multi.component';
export * from './lib/hlm-date-picker.component';

export const HlmDatePickerImports = [HlmDatePickerComponent, HlmDatePickerMultiComponent] as const;

@NgModule({
	imports: [...HlmDatePickerImports],
	exports: [...HlmDatePickerImports],
})
export class HlmDatePickerModule {}
