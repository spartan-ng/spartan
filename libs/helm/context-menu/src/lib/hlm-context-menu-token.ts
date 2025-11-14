import { InjectionToken, type ValueProvider, inject } from '@angular/core';
import { BrnMenuAlign, BrnMenuSide } from '@spartan-ng/brain/menu';

export interface HlmContextMenuConfig {
	align: BrnMenuAlign;
	side: BrnMenuSide;
}

const defaultConfig: HlmContextMenuConfig = {
	align: 'start',
	side: 'bottom',
};

const HlmContextMenuConfigToken = new InjectionToken<HlmContextMenuConfig>('HlmContextMenuConfig');

export function provideHlmContextMenuConfig(config: Partial<HlmContextMenuConfig>): ValueProvider {
	return { provide: HlmContextMenuConfigToken, useValue: { ...defaultConfig, ...config } };
}

export function injectHlmContextMenuConfig(): HlmContextMenuConfig {
	return inject(HlmContextMenuConfigToken, { optional: true }) ?? defaultConfig;
}
