import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpnPie, SpnPieChart } from '@spartan-ng/charts';

@Component({
	selector: 'spartan-pie-chart-legend',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full' },
	imports: [SpnPieChart, SpnPie],
	template: `
		<div class="mx-auto w-[250px] max-w-full">
			<spn-pie-chart class="mx-auto block aspect-square w-full" [data]="data">
				<spn-pie
					dataKey="visitors"
					nameKey="browser"
					[colors]="palette"
					outerRadius="80%"
					stroke="var(--background)"
					strokeWidth="0"
				/>
			</spn-pie-chart>
			<div class="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
				@for (item of legend; track item.label) {
					<div class="flex items-center gap-1.5">
						<span class="size-2 shrink-0 rounded-[2px]" [style.background]="item.color"></span>
						<span class="text-foreground text-xs leading-none">{{ item.label }}</span>
					</div>
				}
			</div>
		</div>
	`,
})
export class PieChartLegend {
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
		{ browser: 'firefox', visitors: 187, fill: 'var(--chart-3)' },
		{ browser: 'edge', visitors: 173, fill: 'var(--chart-4)' },
		{ browser: 'other', visitors: 90, fill: 'var(--chart-5)' },
	];
	protected readonly legend = [
		{ label: 'Chrome', color: 'var(--chart-1)' },
		{ label: 'Safari', color: 'var(--chart-2)' },
		{ label: 'Firefox', color: 'var(--chart-3)' },
		{ label: 'Edge', color: 'var(--chart-4)' },
		{ label: 'Other', color: 'var(--chart-5)' },
	];
}
