import { NgModule } from '@angular/core';
import { HlmLabel } from './lib/hlm-label';

export * from './lib/hlm-label';

export const HlmLabelImports = [HlmLabel];

@NgModule({
	imports: [...HlmLabelImports],
	exports: [...HlmLabelImports],
})
export class HlmLabelModule {}
