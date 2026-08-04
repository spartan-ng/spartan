import { InjectionToken, type Signal } from '@angular/core';

export type BrnChartState = {
	activePoint: Signal<{ name: string; value: number; color: string; seriesName?: string } | null>;
};

export const BRN_CHART_STATE = new InjectionToken<BrnChartState>('BrnChartState');
