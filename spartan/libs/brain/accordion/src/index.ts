import { BrnAccordion } from './lib/brn-accordion';
import { BrnAccordionContent } from './lib/brn-accordion-content';
import { BrnAccordionItem } from './lib/brn-accordion-item';
import { BrnAccordionTrigger } from './lib/brn-accordion-trigger';

export * from './lib/brn-accordion';
export * from './lib/brn-accordion-content';
export * from './lib/brn-accordion-item';
export * from './lib/brn-accordion-token';
export * from './lib/brn-accordion-trigger';

export const BrnAccordionImports = [BrnAccordion, BrnAccordionContent, BrnAccordionItem, BrnAccordionTrigger] as const;
