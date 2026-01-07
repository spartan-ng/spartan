import { InjectionToken, type ValueProvider, inject } from '@angular/core';

export type BrnPopoverAlign = 'start' | 'center' | 'end';

export interface BrnPopoverConfig {
	align: BrnPopoverAlign;
	sideOffset: number;
	offsetX: number;
}

const defaultConfig: BrnPopoverConfig = {
	align: 'center',
	sideOffset: 0,
	offsetX: 0,
};

const BrnPopoverConfigToken = new InjectionToken<BrnPopoverConfig>('BrnPopoverConfig');

export function provideBrnPopoverConfig(config: Partial<BrnPopoverConfig>): ValueProvider {
	return { provide: BrnPopoverConfigToken, useValue: { ...defaultConfig, ...config } };
}

export function injectBrnPopoverConfig(): BrnPopoverConfig {
	return inject(BrnPopoverConfigToken, { optional: true }) ?? defaultConfig;
}
