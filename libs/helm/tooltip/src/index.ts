import { NgModule } from '@angular/core';
import { HlmTooltipTriggerDirective } from './lib/hlm-tooltip-trigger.directive';
import { HlmTooltipComponent } from './lib/hlm-tooltip.component';

export * from './lib/hlm-tooltip-trigger.directive';
export * from './lib/hlm-tooltip.component';

export const HlmTooltipImports = [HlmTooltipComponent, HlmTooltipTriggerDirective] as const;

@NgModule({
	imports: [...HlmTooltipImports],
	exports: [...HlmTooltipImports],
})
export class HlmTooltipModule {}
