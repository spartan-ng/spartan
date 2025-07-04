import { NgModule } from '@angular/core';

import {
	HlmCaptionDirective,
	HlmTableDirective,
	HlmTBodyDirective,
	HlmTdDirective,
	HlmTFootDirective,
	HlmThDirective,
	HlmTHeadDirective,
	HlmTrDirective,
} from './lib/hlm-table.directive';

export * from './lib/hlm-table.directive';

export const HlmTableImports = [
	HlmCaptionDirective,
	HlmTableDirective,
	HlmTBodyDirective,
	HlmTdDirective,
	HlmTFootDirective,
	HlmThDirective,
	HlmTHeadDirective,
	HlmTrDirective,
] as const;

@NgModule({
	imports: [...HlmTableImports],
	exports: [...HlmTableImports],
})
export class HlmTableModule {}
