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

export function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
	if (typeof payload !== 'object' || payload === null) {
		return undefined;
	}

	const payloadPayload =
		'payload' in payload && typeof payload.payload === 'object' && payload.payload !== null
			? payload.payload
			: undefined;

	let configLabelKey: string = key;

	if (key in payload && typeof payload[key as keyof typeof payload] === 'string') {
		configLabelKey = payload[key as keyof typeof payload] as string;
	} else if (
		payloadPayload &&
		key in payloadPayload &&
		typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
	) {
		configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
	}

	if (configLabelKey in config) {
		return config[configLabelKey];
	}

	// Fallback: try to find a config entry whose label matches the key
	const labelMatchKey = Object.keys(config).find((k) => config[k]?.label === key);
	if (labelMatchKey !== undefined) {
		return config[labelMatchKey];
	}

	return config[key];
}
