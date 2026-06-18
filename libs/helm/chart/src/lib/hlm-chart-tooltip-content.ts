import type { TemplateRef } from '@angular/core';

import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ChartConfig } from './chart-config';

@Component({
	selector: 'hlm-chart-tooltip-content, [hlmChartTooltipContent]',
	imports: [NgTemplateOutlet],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'chart-tooltip-content',
	},
	template: `
		<div [class]="_computedTooltipClass()">
			@if (!_nestLabel() && _tooltipLabel()) {
				<div class="font-medium">{{ _tooltipLabel() }}</div>
			}
			<div class="grid gap-1.5">
				@for (item of payloadItems(); track item.key) {
					<div
						[class]="
							hlm(
								'[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5',
								indicator() === 'dot' && 'items-center'
							)
						"
					>
						@if (item.icon) {
							<ng-container [ngTemplateOutlet]="item.icon" />
						} @else if (!hideIndicator()) {
							<div
								[class]="_indicatorClass()"
								[style.--color-bg]="item.indicatorColor"
								[style.--color-border]="item.indicatorColor"
							></div>
						}
						<div [class]="hlm('flex flex-1 justify-between leading-none', _nestLabel() ? 'items-end' : 'items-center')">
							<div class="grid gap-1.5">
								@if (_nestLabel()) {
									<div class="font-medium">{{ _tooltipLabel() }}</div>
								}
								<span class="text-muted-foreground">{{ item.itemConfig?.label || item.value }}</span>
							</div>
							@if (item.value) {
								<span class="text-foreground font-mono font-medium tabular-nums">
									{{ item.value.toLocaleString() }}
								</span>
							}
						</div>
					</div>
				}
			</div>
		</div>
	`,
})
export class HlmChartTooltipContent {
	public readonly hideLabel = input<boolean>(false);
	public readonly hideIndicator = input<boolean>(false);
	public readonly indicator = input<'line' | 'dot' | 'dashed'>('dot');
	public readonly nameKey = input<string>();
	public readonly labelKey = input<string>();
	public readonly labelFormatter = input<(d: number | Date) => string>();
	public readonly payload = input<Record<string, unknown>>({});
	public readonly config = input<ChartConfig>({});
	public readonly userClass = input<string>();
	public readonly color = input<string>();
	public readonly x = input<number | Date>();

	public readonly hlm = hlm;

	public readonly payloadItems = computed(() => {
		const payload = this.payload();
		const config = this.config();
		return Object.entries(payload)
			.map(([key, value]) => {
				const itemConfig = config[key];
				const indicatorColor = (config[key]?.color as string) || (payload['fill'] as string);
				return {
					key,
					value,
					itemConfig,
					indicatorColor,
					icon: itemConfig?.icon as TemplateRef<unknown> | undefined,
				};
			})
			.filter((item) => item.itemConfig);
	});

	protected readonly _nestLabel = computed(
		() => Object.keys(this.payload()).length === 1 && this.indicator() !== 'dot',
	);

	protected readonly _tooltipLabel = computed(() => {
		if (this.hideLabel()) return null;
		const formatter = this.labelFormatter();
		const xVal = this.x();
		if (formatter && xVal !== undefined) {
			return formatter(xVal as number | Date);
		}
		const labelKey = this.labelKey();
		if (labelKey) {
			return this.config()[labelKey]?.label || this.payload()[labelKey];
		}
		return xVal;
	});

	protected readonly _computedTooltipClass = computed(() =>
		hlm('cn-chart-tooltip grid min-w-32 items-start', this.userClass()),
	);

	protected readonly _indicatorClass = computed(() =>
		hlm(
			'shrink-0 rounded-xs border-(--color-border) bg-(--color-bg)',
			this.indicator() === 'dot' && 'h-2.5 w-2.5',
			this.indicator() === 'line' && 'w-1',
			this.indicator() === 'dashed' && 'w-0 border-[1.5px] border-dashed bg-transparent',
			this._nestLabel() && this.indicator() === 'dashed' && 'my-0.5',
		),
	);
}
