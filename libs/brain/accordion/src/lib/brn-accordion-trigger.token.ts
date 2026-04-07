import { type ExistingProvider, InjectionToken, type Type } from '@angular/core';
import type { BrnAccordionTrigger } from './brn-accordion-trigger';

export const BrnAccordionTriggerToken = new InjectionToken<BrnAccordionTrigger>('BrnAccordionTriggerToken');

export function provideBrnAccordionTrigger(trigger: Type<BrnAccordionTrigger>): ExistingProvider {
	return { provide: BrnAccordionTriggerToken, useExisting: trigger };
}
