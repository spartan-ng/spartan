import { NgModule } from '@angular/core';

import { HlmCheckbox } from './lib/hlm-checkbox';

export * from './lib/hlm-checkbox';

export const HlmCheckboxImports = [HlmCheckbox] as const;
@NgModule({
	imports: [...HlmCheckboxImports],
	exports: [...HlmCheckboxImports],
})
export class HlmCheckboxModule {}
