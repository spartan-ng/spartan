import { Component, input } from '@angular/core';
import type { ChartTooltipIndicator } from './hlm-chart.types';

@Component({
	selector: 'hlm-chart-tooltip-content, [hlmChartTooltipContent]',
	template: `
		@if (active()) {
			<div class="spartan-chart-tooltip grid min-w-[8rem] items-start gap-1.5">
				@if (!hideLabel() && label()) {
					<div class="font-medium">{{ label() }}</div>
				}
				<div class="grid gap-1.5">
					@for (item of items(); track $index) {
						<div class="flex w-full flex-wrap items-stretch gap-2" [class.items-center]="indicator() === 'dot'">
							@if (!hideIndicator()) {
								<div
									class="shrink-0 rounded-[2px]"
									[class]="_indicatorCssClass()"
									[style.backgroundColor]="item.color"
									[style.borderColor]="item.color"
								></div>
							}
							<div class="flex flex-1 items-center justify-between leading-none">
								<span class="text-muted-foreground">{{ item.label }}</span>
								<span class="text-foreground font-mono font-medium tabular-nums">{{ item.value }}</span>
							</div>
						</div>
					}
				</div>
			</div>
		}
	`,
})
export class HlmChartTooltipContent {
	public readonly active = input<boolean>(false);
	public readonly label = input<string>('');
	public readonly items = input<Array<{ label: string; value: string | number; color: string }>>([]);
	public readonly indicator = input<ChartTooltipIndicator>('dot');
	public readonly hideLabel = input<boolean>(false);
	public readonly hideIndicator = input<boolean>(false);

	protected readonly _indicatorCssClass = input<string>('h-2.5 w-2.5', { alias: 'indicatorCssClass' });
}
