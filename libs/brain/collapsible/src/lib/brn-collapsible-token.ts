import type { ValueProvider } from '@angular/core';
import { type ExistingProvider, inject, InjectionToken, type Type } from '@angular/core';
import type { MeasurementDisplay } from '@spartan-ng/brain/core';
import type { BrnCollapsible } from './brn-collapsible';

export const BrnCollapsibleToken = new InjectionToken<BrnCollapsible>('BrnCollapsibleToken');

export function injectBrnCollapsible() {
	return inject(BrnCollapsibleToken, { optional: true });
}

export function provideBrnCollapsible(collapsible: Type<BrnCollapsible>): ExistingProvider {
	return { provide: BrnCollapsibleToken, useExisting: collapsible };
}

export interface BrCollapsibleConfig {
	/**
	 * The display style to use when measuring element dimensions.
	 * @default 'block'
	 */
	measurementDisplay: MeasurementDisplay;
}

const defaultConfig: BrCollapsibleConfig = {
	measurementDisplay: 'block',
};

const BrnCollapsibleConfigToken = new InjectionToken<BrCollapsibleConfig>('BrnCollapsibleConfig');

export function provideBrnCollapsibleConfig(config: Partial<BrCollapsibleConfig>): ValueProvider {
	return { provide: BrnCollapsibleConfigToken, useValue: { ...defaultConfig, ...config } };
}

export function injectBrnCollapsibleConfig(): BrCollapsibleConfig {
	return inject(BrnCollapsibleConfigToken, { optional: true }) ?? defaultConfig;
}
