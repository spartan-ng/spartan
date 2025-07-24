import { NgModule } from '@angular/core';
import { HlmSpinner } from './lib/hlm-spinner';

export * from './lib/hlm-spinner';

export const HlmSpinnerImports = [HlmSpinner] as const;

@NgModule({
	imports: [...HlmSpinnerImports],
	exports: [...HlmSpinnerImports],
})
export class HlmSpinnerModule {}
