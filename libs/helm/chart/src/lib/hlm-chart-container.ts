import { ChangeDetectionStrategy, Component, computed, effect, inject, InjectionToken, input } from '@angular/core';
import { HlmChartStyle } from './hlm-chart-style';
import type { ChartConfig } from './hlm-chart.types';

export interface ChartConfigRef {
	value: ChartConfig | null;
}

export const HLM_CHART_CONFIG = new InjectionToken<ChartConfigRef>('HLM_CHART_CONFIG');

@Component({
	selector: 'hlm-chart-container, [hlmChartContainer]',
	imports: [HlmChartStyle],
	providers: [{ provide: HLM_CHART_CONFIG, useFactory: () => ({ value: null }) }],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-chart-style [id]="_chartId()" [config]="config()" />
		<div [attr.data-chart]="_chartId()" data-slot="chart" class="flex aspect-video justify-center text-xs">
			<ng-content />
		</div>
	`,
})
export class HlmChartContainer {
	private readonly _configRef = inject(HLM_CHART_CONFIG);

	protected readonly _chartId = computed(() => `chart-${this.id() ?? Math.random().toString(36).slice(2, 9)}`);
	public readonly id = input<string>();
	public readonly config = input.required<ChartConfig>();

	constructor() {
		effect(() => {
			this._configRef.value = this.config();
		});
	}
}
