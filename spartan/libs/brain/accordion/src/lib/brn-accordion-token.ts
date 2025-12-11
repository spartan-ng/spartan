import { type ExistingProvider, inject, InjectionToken, type Type, type ValueProvider } from '@angular/core';
import type { MeasurementDisplay } from '@spartan-ng/brain/core';
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

export interface BrBrnAccordionConfig {
	/**
	 * The display style to use when measuring element dimensions.
	 * @default 'block'
	 */
	measurementDisplay: MeasurementDisplay;
}

const defaultConfig: BrBrnAccordionConfig = {
	measurementDisplay: 'block',
};

const BrnAccordionConfigToken = new InjectionToken<BrBrnAccordionConfig>('BrnBrnAccordionConfig');

export function provideBrnAccordionConfig(config: Partial<BrBrnAccordionConfig>): ValueProvider {
	return { provide: BrnAccordionConfigToken, useValue: { ...defaultConfig, ...config } };
}

export function injectBrnAccordionConfig(): BrBrnAccordionConfig {
	return inject(BrnAccordionConfigToken, { optional: true }) ?? defaultConfig;
}
