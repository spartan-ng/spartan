import { Component, computed, input } from '@angular/core';
import type { ChartConfig } from './hlm-chart.types';

const THEMES: Record<string, string> = { light: '', dark: '.dark' };

@Component({
	selector: 'hlm-chart-style',
	template: `
		<span #span hidden></span>
	`,
})
export class HlmChartStyle {
	public readonly id = input.required<string>();
	public readonly config = input.required<ChartConfig>();

	protected readonly _styleContent = computed(() => {
		const cfg = this.config();
		const id = this.id();
		const colorConfig = Object.entries(cfg).filter(([, v]) => v.theme ?? v.color);

		if (!colorConfig.length) return '';

		return Object.entries(THEMES)
			.map(
				([theme, prefix]) =>
					`${prefix} [data-chart=${id}] {\n${colorConfig
						.map(([key, itemConfig]) => {
							const color = itemConfig.theme?.[theme] ?? itemConfig.color;
							return color ? `  --color-${key}: ${color};` : null;
						})
						.filter(Boolean)
						.join('\n')}\n}`,
			)
			.join('\n');
	});
}
