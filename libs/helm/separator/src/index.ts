import { NgModule } from '@angular/core';
import { HlmSeparator } from './lib/hlm-separator';

export * from './lib/hlm-separator';

@NgModule({
	imports: [HlmSeparator],
	exports: [HlmSeparator],
})
export class HlmSeparatorModule {}
