import { NgModule } from '@angular/core';
import { HlmSeparatorDirective } from './lib/hlm-separator.directive';

export * from './lib/hlm-separator.directive';

@NgModule({
	imports: [HlmSeparatorDirective],
	exports: [HlmSeparatorDirective],
})
export class HlmSeparatorModule {}
