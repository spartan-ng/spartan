import { NgModule } from '@angular/core';
import { BrnSeparator } from './lib/brn-separator';

export * from './lib/brn-separator';

@NgModule({
	imports: [BrnSeparator],
	exports: [BrnSeparator],
})
export class BrnSeparatorModule {}
