import { NgModule } from '@angular/core';

import { BrnAccordion, BrnAccordionItem, BrnAccordionTrigger } from './lib/brn-accordion';
import { BrnAccordionContent } from './lib/brn-accordion-content';

export * from './lib/brn-accordion';
export * from './lib/brn-accordion-content';

export const BrnAccordionImports = [BrnAccordion, BrnAccordionContent, BrnAccordionItem, BrnAccordionTrigger] as const;

@NgModule({
	imports: [...BrnAccordionImports],
	exports: [...BrnAccordionImports],
})
export class BrnAccordionModule {}
