import { InjectionToken, ValueProvider, inject } from '@angular/core';

export interface HlmSidebarConfig {
	sidebarWidth: string;
	sidebarWidthMobile: string;
	sidebarWidthIcon: string;
}

const defaultConfig: HlmSidebarConfig = {
	sidebarWidth: '16rem',
	sidebarWidthMobile: '18rem',
	sidebarWidthIcon: '4rem',
};

const HlmSidebarConfigToken = new InjectionToken<HlmSidebarConfig>('HlmSidebarConfig');

export function provideHlmSidebarConfig(config: Partial<HlmSidebarConfig>): ValueProvider {
	return { provide: HlmSidebarConfigToken, useValue: { ...defaultConfig, ...config } };
}

export function injectHlmSidebarConfig(): HlmSidebarConfig {
	return inject(HlmSidebarConfigToken, { optional: true }) ?? defaultConfig;
}
