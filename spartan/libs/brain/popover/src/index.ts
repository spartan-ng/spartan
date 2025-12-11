import { BrnPopover } from './lib/brn-popover';
import { BrnPopoverContent } from './lib/brn-popover-content';
import { BrnPopoverTrigger } from './lib/brn-popover-trigger';

export * from './lib/brn-popover';
export * from './lib/brn-popover-content';
export * from './lib/brn-popover-trigger';

export const BrnPopoverImports = [BrnPopover, BrnPopoverTrigger, BrnPopoverContent] as const;
