import { InjectionToken } from '@angular/core';
import type { ChartConfig } from './chart-config';

export type ChartContext = {
	id: string;
	config: ChartConfig;
	resolveColor: (key: string) => string;
};

export const CHART_CONTEXT = new InjectionToken<ChartContext>('ChartContext');

function _readCssVar(name: string): string {
	if (typeof document === 'undefined') return '';
	const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	if (!value) return '';
	if (/^\d/.test(value)) return `hsl(${value})`;
	return value;
}

export function resolveCssVar(name: string): string {
	return _readCssVar(name);
}
