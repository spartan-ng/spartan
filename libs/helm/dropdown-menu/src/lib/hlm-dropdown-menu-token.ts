import { InjectionToken, type ValueProvider, inject } from '@angular/core';
import { BrnMenuAlign, BrnMenuSide } from '@spartan-ng/brain/menu';

export interface HlmDropdownMenuConfig {
	align: BrnMenuAlign;
	side: BrnMenuSide;
}

const defaultConfig: HlmDropdownMenuConfig = {
	align: 'start',
	side: 'bottom',
};

const HlmDropdownMenuConfigToken = new InjectionToken<HlmDropdownMenuConfig>('HlmDropdownMenuConfig');

export function provideHlmDropdownMenuConfig(config: Partial<HlmDropdownMenuConfig>): ValueProvider {
	return { provide: HlmDropdownMenuConfigToken, useValue: { ...defaultConfig, ...config } };
}

export function injectHlmDropdownMenuConfig(): HlmDropdownMenuConfig {
	return inject(HlmDropdownMenuConfigToken, { optional: true }) ?? defaultConfig;
}
