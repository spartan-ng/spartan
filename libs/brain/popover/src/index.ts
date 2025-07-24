import { NgModule } from '@angular/core';

import { BrnPopover } from './lib/brn-popover';
import { BrnPopoverClose } from './lib/brn-popover-close';
import { BrnPopoverContent } from './lib/brn-popover-content';
import { BrnPopoverTrigger } from './lib/brn-popover-trigger';

export * from './lib/brn-popover';
export * from './lib/brn-popover-close';
export * from './lib/brn-popover-content';
export * from './lib/brn-popover-trigger';

export const BrnPopoverImports = [BrnPopover, BrnPopoverTrigger, BrnPopoverClose, BrnPopoverContent] as const;

@NgModule({
	imports: [...BrnPopoverImports],
	exports: [...BrnPopoverImports],
})
export class BrnPopoverModule {}
