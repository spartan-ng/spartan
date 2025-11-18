import { BrnCollapsible } from './lib/brn-collapsible';
import { BrnCollapsibleContent } from './lib/brn-collapsible-content';
import { BrnCollapsibleTrigger } from './lib/brn-collapsible-trigger';

export * from './lib/brn-collapsible';
export * from './lib/brn-collapsible-content';
export * from './lib/brn-collapsible-token';
export * from './lib/brn-collapsible-trigger';

export const BrnCollapsibleImports = [BrnCollapsible, BrnCollapsibleTrigger, BrnCollapsibleContent] as const;
