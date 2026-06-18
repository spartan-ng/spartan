import { InjectionToken } from '@angular/core';
import type { ChartConfig } from './chart-config';

export interface ChartContext {
	id: string;
	config: ChartConfig;
}

export const CHART_CONTEXT = new InjectionToken<ChartContext>('CHART_CONTEXT');
