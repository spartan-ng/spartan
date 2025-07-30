import { NgModule } from '@angular/core';
import { HlmToggle } from './lib/hlm-toggle';

export * from './lib/hlm-toggle';
@NgModule({
	imports: [HlmToggle],
	exports: [HlmToggle],
})
export class HlmToggleModule {}
