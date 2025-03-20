import { NgModule } from '@angular/core';
import { BrnToggleDirective } from './lib/brn-toggle.directive';

export * from './lib/brn-toggle.directive';

@NgModule({
	imports: [BrnToggleDirective],
	exports: [BrnToggleDirective],
})
export class BrnToggleModule {}
