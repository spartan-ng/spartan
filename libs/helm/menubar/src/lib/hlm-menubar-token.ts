import { InjectionToken, type ValueProvider, inject } from '@angular/core';
import { BrnMenuAlign, BrnMenuSide } from '@spartan-ng/brain/menu';

export interface HlmMenubarConfig {
	align: BrnMenuAlign;
	side: BrnMenuSide;
}

const defaultConfig: HlmMenubarConfig = {
	align: 'start',
	side: 'bottom',
};

const HlmMenubarConfigToken = new InjectionToken<HlmMenubarConfig>('HlmMenubarConfig');

export function provideHlmMenubarConfig(config: Partial<HlmMenubarConfig>): ValueProvider {
	return { provide: HlmMenubarConfigToken, useValue: { ...defaultConfig, ...config } };
}

export function injectHlmMenubarConfig(): HlmMenubarConfig {
	return inject(HlmMenubarConfigToken, { optional: true }) ?? defaultConfig;
}
