import { NgModule } from '@angular/core';
import { HlmScrollArea } from './lib/hlm-scroll-area';

export * from './lib/hlm-scroll-area';

export const HlmScrollAreaImports = [HlmScrollArea];

@NgModule({
	imports: [HlmScrollArea],
	exports: [HlmScrollArea],
})
export class HlmScrollAreaModule {}
