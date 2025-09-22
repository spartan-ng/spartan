import { NgModule } from '@angular/core';
import { HlmButton } from './lib/hlm-button';
export * from './lib/hlm-button';
export * from './lib/hlm-button.token';

export const HlmButtonImports = [HlmButton] as const;

@NgModule({
	imports: [HlmButton],
	exports: [HlmButton],
})
export class HlmButtonModule {}
