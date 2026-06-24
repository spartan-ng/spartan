import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	ElementRef,
	inject,
	input,
	OnInit,
	Renderer2,
} from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';
import type { ChartConfig } from './chart-config';
import { CHART_CONTEXT, type ChartContext, resolveCssVar } from './chart-context';

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
					resolveColor: (key: string) => {
						const cfg = host.config()[key];
						if (!cfg) return '';
						const colorExpr = cfg.theme?.light ?? cfg.color ?? '';
						const cssVarMatch = colorExpr.match(/var\(--([^)]+)\)/);
						return cssVarMatch ? resolveCssVar(`--${cssVarMatch[1]}`) : colorExpr;
					},
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
export class HlmChartContainer implements OnInit {
	public readonly id = input<string>();
	public readonly config = input.required<ChartConfig>();

	private readonly _fallbackId = Math.random().toString(36).substring(2, 9);
	private readonly _renderer = inject(Renderer2);
	private readonly _elementRef = inject(ElementRef);

	public readonly chartId = computed(() => `chart-${this.id() ?? this._fallbackId}`);

	private readonly _generatedStyles = computed(() => {
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

	private readonly _styleEl!: HTMLStyleElement;

	constructor() {
		classes(() => 'flex aspect-video h-full w-full flex-col justify-center text-xs');
		this._styleEl = this._renderer.createElement('style');
		this._styleEl.setAttribute('data-chart-styles', '');
		this._renderer.appendChild(this._elementRef.nativeElement, this._styleEl);
	}

	ngOnInit() {
		// Inputs are available in ngOnInit. Populate style before ECharts initializes
		// in ngAfterViewInit so var(--color-*) resolves.
		this._styleEl.textContent = this._generatedStyles();
		// Keep effect for reactive updates if config changes.
		effect(() => {
			this._styleEl.textContent = this._generatedStyles();
		});
	}
}
