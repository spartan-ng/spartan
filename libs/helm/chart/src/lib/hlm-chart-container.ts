import { ChangeDetectionStrategy, Component, computed, effect, InjectionToken, input, signal } from '@angular/core';
import { HlmChartStyle } from './hlm-chart-style';
import type { ChartConfig } from './hlm-chart.types';

export interface ChartConfigRef {
	readonly value: ChartConfig | null;
}

export const HLM_CHART_CONFIG = new InjectionToken<ChartConfigRef>('HLM_CHART_CONFIG');

@Component({
	selector: 'hlm-chart-container, [hlmChartContainer]',
	imports: [HlmChartStyle],
	providers: [
		{
			provide: HLM_CHART_CONFIG,
			useFactory: (c: HlmChartContainer) => c._configRef(),
			deps: [HlmChartContainer],
		},
	],
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

	protected readonly _configRef = signal<ChartConfigRef>({ value: null });

	constructor() {
		effect(() => {
			this._configRef.set({ value: this.config() });
		});
	}
}
