import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	ElementRef,
	inject,
	input,
	Renderer2,
} from '@angular/core';
import type { ChartConfig } from './hlm-chart.types';

const THEMES: Record<string, string> = { light: '', dark: '.dark' };

@Component({
	selector: 'hlm-chart-style',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ``,
})
export class HlmChartStyle {
	private readonly _renderer = inject(Renderer2);
	private readonly _host = inject(ElementRef).nativeElement as HTMLElement;

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
					`${prefix} [data-chart="${id}"] {\n${colorConfig
						.map(([key, itemConfig]) => {
							const color = itemConfig.theme?.[theme] ?? itemConfig.color;
							return color ? `  --color-${key}: ${color};` : null;
						})
						.filter(Boolean)
						.join('\n')}\n}`,
			)
			.join('\n');
	});

	constructor() {
		const styleEl = this._renderer.createElement('style');
		this._renderer.appendChild(this._host, styleEl);

		effect(() => {
			const content = this._styleContent();
			if (styleEl.textContent !== content) {
				styleEl.textContent = content;
			}
		});
	}
}
