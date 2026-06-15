import { ChangeDetectionStrategy, Component, computed, inject, InjectionToken, input } from '@angular/core';
import { HlmChartStyle } from './hlm-chart-style';
import type { ChartConfig } from './hlm-chart.types';

export const HLM_CHART_CONFIG = new InjectionToken<ChartConfig>('HLM_CHART_CONFIG');

@Component({
	selector: 'hlm-chart-container, [hlmChartContainer]',
	imports: [HlmChartStyle],
	providers: [{ provide: HLM_CHART_CONFIG, useFactory: () => inject(HLM_CHART_CONFIG, { optional: true }) }],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-chart-style [id]="_chartId()" [config]="config()" />
		<div [attr.data-chart]="_chartId()" data-slot="chart" class="flex aspect-video justify-center text-xs">
			<ng-content />
		</div>
	`,
})
export class HlmChartContainer {
	protected readonly _chartId = computed(() => `chart-${this.id() ?? Math.random().toString(36).slice(2, 9)}`);
	public readonly id = input<string>();
	public readonly config = input.required<ChartConfig>();
}
