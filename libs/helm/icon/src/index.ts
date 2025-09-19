import { NgModule } from '@angular/core';
import { HlmIcon } from './lib/hlm-icon';

export * from './lib/hlm-icon';
export * from './lib/hlm-icon.token';

export const HlmIconImports = [HlmIcon];

@NgModule({
	imports: [...HlmIconImports],
	exports: [...HlmIconImports],
})
export class HlmIconModule {}
