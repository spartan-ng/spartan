import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';
import type { ChartConfig } from './chart-config';
import { CHART_CONTEXT, type ChartContext } from './chart-context';

@Component({
	selector: 'hlm-chart-container, [hlmChartContainer]',
	providers: [
		{
			provide: CHART_CONTEXT,
			useFactory: () => {
				const host = inject(HlmChartContainer);
				return {
					id: host.chartId(),
					config: host.config(),
				} satisfies ChartContext;
			},
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'chart-container',
	},
	template: `
		<ng-content />
		<style>
			{{ generatedStyles() }}
		</style>
	`,
})
export class HlmChartContainer {
	public readonly id = input<string>();
	public readonly config = input.required<ChartConfig>();

	public readonly chartId = computed(() => `chart-${this.id() || Math.random().toString(36).substring(2, 9)}`);

	public readonly generatedStyles = computed(() => {
		const config = this.config();
		const colorConfig = Object.entries(config).filter(([, cfg]) => cfg.theme || cfg.color);
		if (colorConfig.length === 0) return '';
		const chartId = this.chartId();
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

	constructor() {
		classes(() => 'flex aspect-video h-full w-full flex-col justify-center text-xs');
	}
}
