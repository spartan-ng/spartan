import { NgModule } from '@angular/core';
import { HlmScrollArea } from './lib/hlm-scroll-area';

export * from './lib/hlm-scroll-area';

export const HlmScrollAreaImports = [HlmScrollArea] as const;

@NgModule({
	imports: [...HlmScrollAreaImports],
	exports: [...HlmScrollAreaImports],
})
export class HlmScrollAreaModule {}
