import { NgModule } from '@angular/core';
import { HlmInputGroup } from './lib/hlm-input-group';

export * from './lib/hlm-input-group';

export const HlmInputGroupImports = [HlmInputGroup] as const;

@NgModule({
	imports: [...HlmInputGroupImports],
	exports: [...HlmInputGroupImports],
})
export class HlmInputGroupModule {}
