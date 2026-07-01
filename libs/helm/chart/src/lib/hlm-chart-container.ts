import { DOCUMENT } from '@angular/common';
import { afterNextRender, Directive, effect, ElementRef, inject, Injector, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';
import { CHART_THEMES, ChartConfig, injectHlmChartConfig } from './hlm-chart.token';

@Directive({
	selector: '[hlmChartContainer],hlm-chart-container',
	host: { 'data-slot': 'chart', '[attr.data-chart]': 'id()' },
})
export class HlmChartContainer {
	private static _id = 0;

	private readonly _config = injectHlmChartConfig();
	private readonly _host = inject(ElementRef<HTMLElement>);
	private readonly _document = inject(DOCUMENT);
	private readonly _injector = inject(Injector);

	public readonly id = input<string>(`hlm-chart-container-${++HlmChartContainer._id}`);

	public readonly config = input<ChartConfig>(this._config);

	constructor() {
		classes(() => 'flex aspect-video justify-center text-xs');
		classes(() => [
			'flex aspect-video justify-center text-xs',
			"[&_.grid-layer_line[stroke='#ccc']]:stroke-border/50",
		]);

		afterNextRender(() => {
			effect(
				(onCleanup) => {
					// Remove the previous style element before creating a new one.
					// This is more reliable than relying solely on onCleanup, since
					// the effect can re-run multiple times during initialization.
					this._host.nativeElement.querySelector('style')?.remove();

					const styleEl = this._document.createElement('style');
					const chartId = this.id();
					const colorConfig = Object.entries(this.config()).filter(
						([, itemConfig]) => itemConfig.theme ?? itemConfig.color,
					);

					if (colorConfig.length) {
						styleEl.textContent = (Object.entries(CHART_THEMES) as Array<[keyof typeof CHART_THEMES, string]>)
							.map(([theme, prefix]) => {
								const rules = colorConfig
									.map(([key, itemConfig]) => {
										const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ?? itemConfig.color;
										return color ? `  --color-${key}: ${color};` : null;
									})
									.filter(Boolean)
									.join('\n');
								return `${prefix} [data-chart="${chartId}"] {\n${rules}\n}`;
							})
							.join('\n');
						this._host.nativeElement.append(styleEl);
						onCleanup(() => styleEl.remove());
					}
				},
				{ injector: this._injector },
			);
		});
	}
}
