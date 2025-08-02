import { NgModule } from '@angular/core';
import { BrnButton } from './lib/brn-button';

export * from './lib/brn-button';

@NgModule({
	imports: [BrnButton],
	exports: [BrnButton],
})
export class BrnButtonModule {}
