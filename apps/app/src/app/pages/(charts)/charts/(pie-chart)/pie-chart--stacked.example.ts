import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpnPie, SpnPieChart, SpnTooltip, SpnTooltipContentDef } from '@spartan-ng/charts';

@Component({
	selector: 'spartan-pie-chart-stacked',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full' },
	imports: [TitleCasePipe, SpnPieChart, SpnPie, SpnTooltip, SpnTooltipContentDef],
	template: `
		<div class="relative mx-auto block aspect-square h-[250px] w-[250px] max-w-full">
			<spn-pie-chart class="mx-auto block aspect-square h-[250px] w-[250px] max-w-full" [data]="desktop">
				<spn-pie
					[data]="desktop"
					dataKey="desktop"
					nameKey="month"
					[colors]="palette"
					outerRadius="60"
					stroke="var(--background)"
					strokeWidth="0"
				/>
				<spn-pie
					[data]="mobile"
					dataKey="mobile"
					nameKey="month"
					[colors]="palette"
					innerRadius="70"
					outerRadius="90"
					stroke="var(--background)"
					strokeWidth="0"
				/>
				<spn-tooltip>
					<ng-template spnTooltipContent let-state>
						<div
							class="bg-background border-border/50 grid min-w-[8rem] gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl"
						>
							@for (item of state.payload; track item.dataKey) {
								<div class="flex w-full items-center gap-2">
									<span class="size-2.5 shrink-0 rounded-[2px]" [style.background]="item.color"></span>
									<span class="text-muted-foreground">{{ item.name | titlecase }}</span>
									<span class="text-foreground ml-auto font-mono font-medium tabular-nums">{{ item.value }}</span>
								</div>
							}
						</div>
					</ng-template>
				</spn-tooltip>
			</spn-pie-chart>
		</div>
	`,
})
export class PieChartStacked {
	protected readonly palette = [
		'var(--chart-1)',
		'var(--chart-2)',
		'var(--chart-3)',
		'var(--chart-4)',
		'var(--chart-5)',
	];
	protected readonly desktop = [
		{ month: 'january', desktop: 186, fill: 'var(--chart-1)' },
		{ month: 'february', desktop: 305, fill: 'var(--chart-2)' },
		{ month: 'march', desktop: 237, fill: 'var(--chart-3)' },
		{ month: 'april', desktop: 173, fill: 'var(--chart-4)' },
		{ month: 'may', desktop: 209, fill: 'var(--chart-5)' },
	];
	protected readonly mobile = [
		{ month: 'january', mobile: 80, fill: 'var(--chart-1)' },
		{ month: 'february', mobile: 200, fill: 'var(--chart-2)' },
		{ month: 'march', mobile: 120, fill: 'var(--chart-3)' },
		{ month: 'april', mobile: 190, fill: 'var(--chart-4)' },
		{ month: 'may', mobile: 130, fill: 'var(--chart-5)' },
	];
}
