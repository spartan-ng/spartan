import { NgModule } from '@angular/core';
import { HlmSpinner } from './lib/hlm-spinner';

export * from './lib/hlm-spinner';

@NgModule({
	imports: [HlmSpinner],
	exports: [HlmSpinner],
})
export class HlmSpinnerModule {}
