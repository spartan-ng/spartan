import { NgModule } from '@angular/core';

import { HlmPopoverClose } from './lib/hlm-popover-close';
import { HlmPopoverContent } from './lib/hlm-popover-content';

export * from './lib/hlm-popover-close';
export * from './lib/hlm-popover-content';

export const HlmPopoverImports = [HlmPopoverContent, HlmPopoverClose] as const;

@NgModule({
	imports: [...HlmPopoverImports],
	exports: [...HlmPopoverImports],
})
export class HlmPopoverModule {}
