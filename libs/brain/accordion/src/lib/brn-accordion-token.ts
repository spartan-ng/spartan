import { type ExistingProvider, inject, InjectionToken, type Type } from '@angular/core';
import type { BrnAccordion } from './brn-accordion';
import type { BrnAccordionItem } from './brn-accordion-item';

export const BrnAccordionToken = new InjectionToken<BrnAccordion>('BrnAccordionToken');

export function injectBrnAccordion() {
	return inject(BrnAccordionToken);
}

export function provideBrnAccordion(accordion: Type<BrnAccordion>): ExistingProvider {
	return { provide: BrnAccordionToken, useExisting: accordion };
}

export const BrnAccordionItemToken = new InjectionToken<BrnAccordionItem>('BrnAccordionItemToken');

export function injectBrnAccordionItem() {
	return inject(BrnAccordionItemToken);
}

export function provideBrnAccordionItem(item: Type<BrnAccordionItem>): ExistingProvider {
	return { provide: BrnAccordionItemToken, useExisting: item };
}
