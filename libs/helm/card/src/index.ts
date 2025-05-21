import { NgModule } from '@angular/core';

import { HlmCardContentDirective } from './lib/hlm-card-content.directive';
import { HlmCardDescriptionDirective } from './lib/hlm-card-description.directive';
import { HlmCardFooterDirective } from './lib/hlm-card-footer.directive';
import { HlmCardHeaderDirective } from './lib/hlm-card-header.directive';
import { HlmCardTitleDirective } from './lib/hlm-card-title.directive';
import { HlmCardDirective } from './lib/hlm-card.directive';

export * from './lib/hlm-card-content.directive';
export * from './lib/hlm-card-description.directive';
export * from './lib/hlm-card-footer.directive';
export * from './lib/hlm-card-header.directive';
export * from './lib/hlm-card-title.directive';
export * from './lib/hlm-card.directive';

export const HlmCardImports = [
	HlmCardDirective,
	HlmCardHeaderDirective,
	HlmCardFooterDirective,
	HlmCardTitleDirective,
	HlmCardDescriptionDirective,
	HlmCardContentDirective,
] as const;

@NgModule({
	imports: [...HlmCardImports],
	exports: [...HlmCardImports],
})
export class HlmCardModule {}
