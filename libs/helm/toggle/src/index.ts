import { NgModule } from '@angular/core';
import { HlmToggle } from './lib/hlm-toggle';

export * from './lib/hlm-toggle';

export const HlmToggleImports = [HlmToggle] as const;

@NgModule({
	imports: [...HlmToggleImports],
	exports: [...HlmToggleImports],
})
export class HlmToggleModule {}
