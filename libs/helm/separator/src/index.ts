import { NgModule } from '@angular/core';
import { HlmSeparator } from './lib/hlm-separator';

export * from './lib/hlm-separator';

export const HlmSeparatorImports = [HlmSeparator] as const;

@NgModule({
	imports: [...HlmSeparatorImports],
	exports: [...HlmSeparatorImports],
})
export class HlmSeparatorModule {}
