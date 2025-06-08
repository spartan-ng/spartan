import { NgModule } from '@angular/core';
import { HlmBadgeDirective } from './lib/hlm-badge.directive';

export * from './lib/hlm-badge.directive';

export const HlmBadgeImports = [HlmBadgeDirective] as const;

@NgModule({
	imports: [...HlmBadgeImports],
	exports: [...HlmBadgeImports],
})
export class HlmBadgeModule {}
