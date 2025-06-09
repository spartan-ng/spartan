import { NgModule } from '@angular/core';
import { HlmButtonDirective } from './lib/hlm-button.directive';
export * from './lib/hlm-button.directive';
export * from './lib/hlm-button.token';

@NgModule({
	imports: [HlmButtonDirective],
	exports: [HlmButtonDirective],
})
export class HlmButtonModule {}
