import { NgModule } from '@angular/core';
import { HlmBadgeDirective } from './lib/hlm-badge.directive';

export * from './lib/hlm-badge.directive';

@NgModule({
	imports: [HlmBadgeDirective],
	exports: [HlmBadgeDirective],
})
export class HlmBadgeModule {}
