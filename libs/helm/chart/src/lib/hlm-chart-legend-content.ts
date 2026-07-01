import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { classes } from '@spartan-ng/helm/utils';
import { HlmChartContainer } from './hlm-chart-container';

/**
 * Default shadcn-styled chart legend content.
 * Derives legend items directly from the chart config.
 *
 * @example
 * ```html
 * <hlm-chart-legend-content />
 * ```
 */
@Component({
	selector: 'hlm-chart-legend-content',
	imports: [NgIcon],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { '[attr.data-align]': 'verticalAlign()' },
	template: `
		@for (item of _items(); track item.key) {
			<div class="[&>ng-icon]:text-muted-foreground flex items-center gap-1.5 [&>ng-icon]:text-[length:--spacing(3)]">
				@if (item.icon && !hideIcon()) {
					<ng-icon [name]="item.icon" />
				} @else {
					<div class="h-2 w-2 shrink-0 rounded-xs bg-(--color-bg)" [style.--color-bg]="item.color"></div>
				}
				<span class="text-foreground text-xs leading-none">{{ item.label }}</span>
			</div>
		}
	`,
})
export class HlmChartLegendContent {
	private readonly _chartContainer = inject(HlmChartContainer);

	public readonly verticalAlign = input<'top' | 'bottom'>('bottom');

	/** Whether to hide the icon from the config. */
	public readonly hideIcon = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	protected readonly _items = computed(() => {
		const config = this._chartContainer.config();
		return Object.entries(config).map(([key, itemConfig]) => ({
			key,
			label: itemConfig.label ?? key,
			icon: itemConfig.icon,
			color: `var(--color-${key})`,
		}));
	});

	constructor() {
		classes(() => 'flex items-center justify-center gap-4 data-[align=bottom]:pt-3 data-[align=top]:pb-3');
	}
}
