import { HlmAccordionTrigger } from '@spartan-ng/helm/accordion';
import { HlmCollapsible } from './lib/hlm-collapsible';
import { HlmCollapsibleContent } from './lib/hlm-collapsible-content';

export * from './lib/hlm-collapsible';
export * from './lib/hlm-collapsible-content';
export * from './lib/hlm-collapsible-trigger';

export const HlmCollapsibleImports = [HlmCollapsible, HlmCollapsibleContent, HlmAccordionTrigger] as const;
