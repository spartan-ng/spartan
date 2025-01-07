import { NgModule } from '@angular/core';
import { BrnTooltipContentComponent } from './lib/brn-tooltip-content.component';
import { BrnTooltipContentDirective } from './lib/brn-tooltip-content.directive';
import { BrnTooltipTriggerDirective } from './lib/brn-tooltip-trigger.directive';
import { BrnTooltipDirective } from './lib/brn-tooltip.directive';

export * from './lib/brn-tooltip-content.component';
export * from './lib/brn-tooltip-content.directive';
export * from './lib/brn-tooltip-trigger.directive';
export * from './lib/brn-tooltip.directive';
export * from './lib/brn-tooltip.token';

export const BrnTooltipImports = [
	BrnTooltipDirective,
	BrnTooltipContentDirective,
	BrnTooltipTriggerDirective,
	BrnTooltipContentComponent,
] as const;

@NgModule({
	imports: [...BrnTooltipImports],
	exports: [...BrnTooltipImports],
})
export class BrnTooltipModule {}
