import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpnPie, SpnPieChart, SpnTooltip, SpnTooltipContentDef } from '@spartan-ng/charts';

@Component({
	selector: 'spartan-pie-chart-donut-text',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full' },
	imports: [TitleCasePipe, SpnPieChart, SpnPie, SpnTooltip, SpnTooltipContentDef],
	template: `
		<div class="relative mx-auto block aspect-square h-[250px] w-[250px] max-w-full">
			<spn-pie-chart class="mx-auto block aspect-square h-[250px] w-[250px] max-w-full" [data]="data">
				<spn-pie
					dataKey="visitors"
					nameKey="browser"
					[colors]="palette"
					innerRadius="60"
					outerRadius="80%"
					stroke="none"
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
			<div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
				<span class="text-foreground text-3xl font-bold">{{ total }}</span>
				<span class="text-muted-foreground text-sm">Visitors</span>
			</div>
		</div>
	`,
})
export class PieChartDonutText {
	protected readonly palette = [
		'var(--chart-1)',
		'var(--chart-2)',
		'var(--chart-3)',
		'var(--chart-4)',
		'var(--chart-5)',
	];
	protected readonly data = [
		{ browser: 'chrome', visitors: 275, fill: 'var(--chart-1)' },
		{ browser: 'safari', visitors: 200, fill: 'var(--chart-2)' },
		{ browser: 'firefox', visitors: 287, fill: 'var(--chart-3)' },
		{ browser: 'edge', visitors: 173, fill: 'var(--chart-4)' },
		{ browser: 'other', visitors: 190, fill: 'var(--chart-5)' },
	];
	protected readonly total = this.data.reduce((sum, item) => sum + item.visitors, 0).toLocaleString();
}
