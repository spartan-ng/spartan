import { NgModule } from '@angular/core';

import { HlmProgressIndicatorDirective } from './lib/hlm-progress-indicator.directive';
import { HlmProgressDirective } from './lib/hlm-progress.directive';

export * from './lib/hlm-progress-indicator.directive';
export * from './lib/hlm-progress.directive';

export const HlmProgressImports = [HlmProgressDirective, HlmProgressIndicatorDirective] as const;

@NgModule({
	imports: [...HlmProgressImports],
	exports: [...HlmProgressImports],
})
export class HlmProgressModule {}
