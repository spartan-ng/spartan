import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, TemplateRef } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ChartContext } from './chart-context';
import { CHART_CONTEXT } from './chart-context';

@Component({
	selector: 'hlm-chart-legend-content, [hlmChartLegendContent]',
	imports: [NgTemplateOutlet],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'chart-legend-content',
	},
	template: `
		<div [class]="_computedClass()">
			@for (item of legendItems(); track item.key) {
				<div class="[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3">
					@if (item.icon) {
						<ng-container [ngTemplateOutlet]="item.icon" />
					} @else {
						<div class="h-2 w-2 shrink-0 rounded-xs" [style.backgroundColor]="item.color"></div>
					}
					<span>{{ item.label }}</span>
				</div>
			}
		</div>
	`,
})
export class HlmChartLegendContent {
	public readonly hideIcon = input<boolean>(false);
	public readonly nameKey = input<string>();
	public readonly verticalAlign = input<'bottom' | 'top'>('bottom');
	public readonly userClass = input<string>();

	private readonly _chartContext = inject<ChartContext>(CHART_CONTEXT);

	public readonly legendItems = computed(() => {
		const config = this._chartContext.config;
		return Object.entries(config).map(([key, value]) => ({
			key: this.nameKey() || key,
			icon: value.icon as TemplateRef<unknown> | undefined,
			color: value.color || value.theme?.light,
			label: value.label,
		}));
	});

	protected readonly _computedClass = computed(() =>
		hlm('flex items-center justify-center gap-4', this.verticalAlign() === 'top' ? 'pb-3' : 'pt-3', this.userClass()),
	);
}
