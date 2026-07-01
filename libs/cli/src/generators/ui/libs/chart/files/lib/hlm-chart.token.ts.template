import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export const CHART_THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = Record<
	string,
	{
		label?: string;
		icon?: string;
	} & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof CHART_THEMES, string> })
>;

const defaultConfig: ChartConfig = {};

const ChartConfigToken = new InjectionToken<ChartConfig>('ChartConfig');

export function provideHlmChartConfig(config: Partial<ChartConfig>): ValueProvider {
	return { provide: ChartConfigToken, useValue: { ...defaultConfig, ...config } };
}

export function injectHlmChartConfig(): ChartConfig {
	return inject(ChartConfigToken, { optional: true }) ?? defaultConfig;
}
