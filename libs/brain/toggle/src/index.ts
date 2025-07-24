import { NgModule } from '@angular/core';
import { BrnToggle } from './lib/brn-toggle';

export * from './lib/brn-toggle';

@NgModule({
	imports: [BrnToggle],
	exports: [BrnToggle],
})
export class BrnToggleModule {}
