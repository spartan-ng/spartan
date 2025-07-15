import { NgModule } from '@angular/core';

import { BrnRadio } from './lib/brn-radio';
import { BrnRadioGroup } from './lib/brn-radio-group';

export * from './lib/brn-radio';
export * from './lib/brn-radio-group';

export const BrnRadioGroupImports = [BrnRadioGroup, BrnRadio] as const;

@NgModule({
	imports: [...BrnRadioGroupImports],
	exports: [...BrnRadioGroupImports],
})
export class BrnRadioGroupModule {}
