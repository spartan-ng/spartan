import { NgModule } from '@angular/core';
import { HlmLabel } from './lib/hlm-label';

export * from './lib/hlm-label';

@NgModule({
	imports: [HlmLabel],
	exports: [HlmLabel],
})
export class HlmLabelModule {}
