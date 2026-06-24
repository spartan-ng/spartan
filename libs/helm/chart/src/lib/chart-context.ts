import { InjectionToken } from '@angular/core';
import type { ChartConfig } from './chart-config';

export type ChartContext = {
	id: string;
	config: ChartConfig;
};

export const CHART_CONTEXT = new InjectionToken<ChartContext>('ChartContext');
