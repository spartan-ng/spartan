import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CHART_CONTEXT } from './chart-context';

@Component({
	selector: 'hlm-chart-style, [hlmChartStyle]',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<style>
			{{ generatedStyles() }}
		</style>
	`,
})
export class HlmChartStyle {
	private readonly _chartContext = inject(CHART_CONTEXT);

	public readonly generatedStyles = computed(() => {
		const config = this._chartContext.config;
		const chartId = this._chartContext.id;
		const colorConfig = Object.entries(config).filter(([, cfg]) => cfg.theme || cfg.color);
		if (colorConfig.length === 0) return '';
		const themes: Record<string, string> = { light: '', dark: '.dark' };
		return Object.entries(themes)
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
