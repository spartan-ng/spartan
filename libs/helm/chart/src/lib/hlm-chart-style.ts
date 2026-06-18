import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { THEMES } from './chart-config';
import type { ChartContext } from './chart-context';
import { CHART_CONTEXT } from './chart-context';

@Component({
	selector: 'hlm-chart-style, [hlmChartStyle]',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (_generatedStyles()) {
			<style>
				{{ _generatedStyles() }}
			</style>
		}
	`,
})
export class HlmChartStyle {
	public readonly id = input<string>();

	private readonly _chartContext = inject<ChartContext>(CHART_CONTEXT);

	protected readonly _generatedStyles = computed(() => {
		const config = this._chartContext.config;
		const colorConfig = Object.entries(config).filter(([, cfg]) => cfg.theme || cfg.color);

		if (colorConfig.length === 0) return '';

		const chartId = this.id() || this._chartContext.id;

		return Object.entries(THEMES)
			.map(
				([theme, prefix]) => `
${prefix} [data-chart=${chartId}] {
${colorConfig
	.map(([key, cfg]) => {
		const color = cfg.theme?.[theme as keyof typeof cfg.theme] || cfg.color;
		return color ? `  --color-${key}: ${color};` : null;
	})
	.filter(Boolean)
	.join('\n')}
}
`,
			)
			.join('\n');
	});
}
