import { NgModule } from '@angular/core';
import { HlmInput } from './lib/hlm-input';

export * from './lib/hlm-input';

@NgModule({
	imports: [HlmInput],
	exports: [HlmInput],
})
export class HlmInputModule {}
