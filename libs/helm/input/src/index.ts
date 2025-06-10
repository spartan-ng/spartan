import { NgModule } from '@angular/core';
import { HlmInputDirective } from './lib/hlm-input.directive';

export * from './lib/hlm-input.directive';

@NgModule({
	imports: [HlmInputDirective],
	exports: [HlmInputDirective],
})
export class HlmInputModule {}
