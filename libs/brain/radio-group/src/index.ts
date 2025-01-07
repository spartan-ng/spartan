import { NgModule } from '@angular/core';

import { BrnRadioGroupDirective } from './lib/brn-radio-group.directive';
import { BrnRadioComponent } from './lib/brn-radio.component';

export * from './lib/brn-radio-group.directive';
export * from './lib/brn-radio.component';

export const BrnRadioGroupImports = [BrnRadioGroupDirective, BrnRadioComponent] as const;

@NgModule({
	imports: [...BrnRadioGroupImports],
	exports: [...BrnRadioGroupImports],
})
export class BrnRadioGroupModule {}
