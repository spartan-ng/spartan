import { NgModule } from '@angular/core';
import { BrnLabel } from './lib/brn-label';

export * from './lib/brn-label';

@NgModule({
	imports: [BrnLabel],
	exports: [BrnLabel],
})
export class BrnLabelModule {}
