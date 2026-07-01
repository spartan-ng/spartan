import { BooleanInput } from '@angular/cdk/coercion';
import { NgTemplateOutlet } from '@angular/common';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	input,
	TemplateRef,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import type { DataKey, TooltipState } from '@spartan-ng/charts';
import { classes } from '@spartan-ng/helm/utils';
import { HlmChartContainer } from './hlm-chart-container';
import { getPayloadConfigFromPayload } from './hlm-chart.token';

/** Context provided to the custom item template. */
export interface HlmChartTooltipItemContext {
	name: string;
	value: unknown;
	dataKey: DataKey<unknown>;
	color: string;
	payload: unknown;
	icon?: string;
	label?: string;
}

/**
 * Default shadcn-styled chart tooltip content.
 * Use inside an `spnTooltipContent` template to avoid repeating the markup.
 *
 * @example
 * ```html
 * <spn-tooltip>
 *   <ng-template spnTooltipContent let-state>
 *     <hlm-chart-tooltip-content [state]="state" />
 *   </ng-template>
 * </spn-tooltip>
 * ```
 */
@Component({
	selector: 'hlm-chart-tooltip-content',
	imports: [NgIcon, NgTemplateOutlet],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (_tooltipLabel(); as label) {
			<div class="font-medium">{{ label }}</div>
		}

		<div class="grid gap-1.5">
			@for (item of _items(); track item.dataKey; let idx = $index, first = $first, last = $last) {
				@if (itemTemplate()) {
					<ng-container *ngTemplateOutlet="itemTemplate(); context: { $implicit: item, index: idx, first, last }" />
				} @else {
					<div
						class="[&>ng-icon]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>ng-icon]:text-[length:--spacing(2.5)]"
					>
						@if (item.icon) {
							<ng-icon [name]="item.icon" />
						} @else if (!hideIndicator()) {
							<div
								class="shrink-0 rounded-xs border-(--color-border) bg-(--color-bg) data-[indicator=dashed]:my-0.5 data-[indicator=dashed]:w-0 data-[indicator=dashed]:border-[1.5px] data-[indicator=dashed]:border-dashed data-[indicator=dashed]:bg-transparent data-[indicator=dot]:size-2.5 data-[indicator=line]:w-1"
								[attr.data-indicator]="indicator()"
								[style.--color-bg]="item.color"
								[style.--color-border]="item.color"
							></div>
						}
						<div class="flex flex-1 items-center justify-between leading-none">
							<span class="text-muted-foreground">{{ item.label ?? item.name }}</span>
							@if (item.value !== null) {
								<span class="text-foreground font-mono font-medium tabular-nums">{{ item.value }}</span>
							}
						</div>
					</div>
				}
			}
		</div>
	`,
})
export class HlmChartTooltipContent {
	private readonly _chartContainer = inject(HlmChartContainer);

	public readonly state = input.required<TooltipState>();

	public readonly hideLabel = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
	public readonly hideIndicator = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	public readonly labelKey = input<string>();

	public readonly labelFormatter = input<(value: unknown) => string>();

	public readonly indicator = input<'line' | 'dot' | 'dashed'>('dot');

	public readonly itemTemplate =
		input<TemplateRef<{ $implicit: HlmChartTooltipItemContext; index: number; first: boolean; last: boolean }>>();

	protected readonly _items = computed(() => {
		const config = this._chartContainer.config();
		return this.state().payload.map((item) => {
			const key = `${item.dataKey ?? item.name ?? 'value'}`;
			const itemConfig = getPayloadConfigFromPayload(config, item, key);

			return {
				...item,
				...itemConfig,
			} as typeof item & { icon?: string; label?: string };
		});
	});

	protected readonly _tooltipLabel = computed(() => {
		if (this.hideLabel()) return null;

		const labelKey = this.labelKey();
		const stateLabel = this.state().label;

		let value: string | number;
		if (labelKey === undefined || labelKey === null || labelKey === '') {
			value = stateLabel;
		} else {
			const itemConfig = this._chartContainer.config()[labelKey];
			value = itemConfig?.label ?? stateLabel;
		}

		const formatter = this.labelFormatter();
		return formatter ? formatter(value) : value;
	});

	constructor() {
		classes(() => 'spartan-chart-tooltip grid min-w-32 items-start');
	}
}
