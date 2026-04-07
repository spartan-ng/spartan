import { BrnAccordion } from './lib/brn-accordion';
import { BrnAccordionContent } from './lib/brn-accordion-content';
import { BrnAccordionHeader } from './lib/brn-accordion-header';
import { BrnAccordionItem } from './lib/brn-accordion-item';
import { BrnAccordionTrigger } from './lib/brn-accordion-trigger';

export * from './lib/brn-accordion';
export * from './lib/brn-accordion-content';
export * from './lib/brn-accordion-header';
export * from './lib/brn-accordion-item';
export * from './lib/brn-accordion-token';
export * from './lib/brn-accordion-trigger';
export * from './lib/brn-accordion-trigger.token';

export const BrnAccordionImports = [
	BrnAccordion,
	BrnAccordionContent,
	BrnAccordionHeader,
	BrnAccordionItem,
	BrnAccordionTrigger,
] as const;
