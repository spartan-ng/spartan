import { NgModule } from '@angular/core';

import { BrnCheckbox } from './lib/brn-checkbox';

export * from './lib/brn-checkbox';

export const BrnCheckboxImports = [BrnCheckbox] as const;

@NgModule({
	imports: [...BrnCheckboxImports],
	exports: [...BrnCheckboxImports],
})
export class BrnCheckboxModule {}
