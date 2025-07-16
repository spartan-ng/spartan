import { NgModule } from '@angular/core';

import { HlmToaster } from './lib/hlm-toaster';

export * from './lib/hlm-toaster';

export const HlmToasterImports = [HlmToaster] as const;

@NgModule({
	imports: [...HlmToasterImports],
	exports: [...HlmToasterImports],
})
export class HlmToasterModule {}
