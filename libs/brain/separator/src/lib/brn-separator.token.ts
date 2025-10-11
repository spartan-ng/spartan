// brn-separator.token.ts
import { InjectionToken, type ValueProvider, inject } from '@angular/core';

export type SeparatorOrientation = 'horizontal' | 'vertical';

export interface BrnSeparatorConfig {
	orientation: SeparatorOrientation;
}

const defaultConfig: BrnSeparatorConfig = {
	orientation: 'horizontal',
};

const BrnSeparatorConfigToken = new InjectionToken<BrnSeparatorConfig>('BrnSeparatorConfig');

export function provideBrnSeparatorConfig(config: Partial<BrnSeparatorConfig>): ValueProvider {
	return { provide: BrnSeparatorConfigToken, useValue: { ...defaultConfig, ...config } };
}

export function injectBrnSeparatorConfig(): BrnSeparatorConfig {
	return inject(BrnSeparatorConfigToken, { optional: true }) ?? defaultConfig;
}
