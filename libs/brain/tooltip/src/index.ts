import { BrnTooltip } from './lib/brn-tooltip';
import { BrnTooltipContent } from './lib/brn-tooltip-content';

export * from './lib/brn-tooltip';
export * from './lib/brn-tooltip-content';
export { BrnTooltipPosition } from './lib/brn-tooltip-position';
export * from './lib/brn-tooltip-type';
export * from './lib/brn-tooltip.token';

export const BrnTooltipImports = [BrnTooltip, BrnTooltipContent] as const;
