import { NgModule } from '@angular/core';

import { HlmPopoverCloseDirective } from './lib/hlm-popover-close.directive';
import { HlmPopoverContentDirective } from './lib/hlm-popover-content.directive';

export * from './lib/hlm-popover-close.directive';
export * from './lib/hlm-popover-content.directive';

export const HlmPopoverImports = [HlmPopoverContentDirective, HlmPopoverCloseDirective] as const;

@NgModule({
	imports: [...HlmPopoverImports],
	exports: [...HlmPopoverImports],
})
export class HlmPopoverModule {}
