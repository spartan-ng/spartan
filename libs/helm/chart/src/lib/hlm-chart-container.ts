import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';
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
		'[attr.data-chart]': 'chartId()',
	},
	template: `
		<ng-content />
	`,
})
export class HlmChartContainer {
	public readonly id = input<string>();
	public readonly config = input.required<ChartConfig>();

	private readonly _fallbackId = Math.random().toString(36).substring(2, 9);
	private readonly _renderer = inject(Renderer2);
	private readonly _elementRef = inject(ElementRef);

	public readonly chartId = computed(() => `chart-${this.id() ?? this._fallbackId}`);

	private readonly generatedStyles = computed(() => {
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
		effect(() => {
			const css = this.generatedStyles();
			if (!css) return;
			const existing = this._elementRef.nativeElement.querySelector('style[data-chart-styles]');
			if (existing) existing.textContent = css;
			else {
				const style = this._renderer.createElement('style');
				style.setAttribute('data-chart-styles', '');
				style.textContent = css;
				this._renderer.appendChild(this._elementRef.nativeElement, style);
			}
		});
	}
}
