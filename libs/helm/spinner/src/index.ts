import { NgModule } from '@angular/core';
import { HlmSpinnerComponent } from './lib/hlm-spinner.component';

export * from './lib/hlm-spinner.component';

export const HlmSpinnerImports = [HlmSpinnerComponent] as const;

@NgModule({
	imports: [...HlmSpinnerImports],
	exports: [...HlmSpinnerImports],
})
export class HlmSpinnerModule {}
