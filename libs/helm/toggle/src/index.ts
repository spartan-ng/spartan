import { NgModule } from '@angular/core';
import { HlmToggleDirective } from './lib/hlm-toggle.directive';

export * from './lib/hlm-toggle.directive';
@NgModule({
	imports: [HlmToggleDirective],
	exports: [HlmToggleDirective],
})
export class HlmToggleModule {}
