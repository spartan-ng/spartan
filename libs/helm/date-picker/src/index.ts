import { NgModule } from '@angular/core';
import { HlmDatePicker } from './lib/hlm-date-picker';
import { HlmDatePickerMulti } from './lib/hlm-date-picker-multi';

export * from './lib/hlm-date-picker.token';

export * from './lib/hlm-date-picker';
export * from './lib/hlm-date-picker-multi';

export const HlmDatePickerImports = [HlmDatePicker, HlmDatePickerMulti] as const;

@NgModule({
	imports: [...HlmDatePickerImports],
	exports: [...HlmDatePickerImports],
})
export class HlmDatePickerModule {}
