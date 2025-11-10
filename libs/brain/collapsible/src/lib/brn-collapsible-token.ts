import { type ExistingProvider, inject, InjectionToken, type Type, type ValueProvider } from '@angular/core';
import type { BrnCollapsible } from './brn-collapsible';

export const BrnCollapsibleToken = new InjectionToken<BrnCollapsible>('BrnCollapsibleToken');

export function injectBrnCollapsible() {
	return inject(BrnCollapsibleToken, { optional: true });
}

export function provideBrnCollapsible(collapsible: Type<BrnCollapsible>): ExistingProvider {
	return { provide: BrnCollapsibleToken, useExisting: collapsible };
}

export interface BrCollapsibleConfig {
	/** Default delay when the collapsible is shown. */
	showDelay: number;
	/** Default delay when the collapsible is hidden. */
	hideDelay: number;
}

const defaultConfig: BrCollapsibleConfig = {
	showDelay: 0,
	hideDelay: 0,
};

const BrnCollapsibleConfigToken = new InjectionToken<BrCollapsibleConfig>('BrnCollapsibleConfig');

export function provideBrnCollapsibleConfig(config: Partial<BrCollapsibleConfig>): ValueProvider {
	return { provide: BrnCollapsibleConfigToken, useValue: { ...defaultConfig, ...config } };
}

export function injectBrnCollapsibleConfig(): BrCollapsibleConfig {
	return inject(BrnCollapsibleConfigToken, { optional: true }) ?? defaultConfig;
}
