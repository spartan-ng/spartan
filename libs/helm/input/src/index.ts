import { NgModule } from '@angular/core';
import { HlmInput } from './lib/hlm-input';

export * from './lib/hlm-input';

export const HlmInputImports = [HlmInput] as const;

@NgModule({
	imports: [...HlmInputImports],
	exports: [...HlmInputImports],
})
export class HlmInputModule {}
