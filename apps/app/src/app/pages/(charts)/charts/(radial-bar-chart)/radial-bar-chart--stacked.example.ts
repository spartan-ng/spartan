import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpnRadialBar, SpnRadialBarChart } from '@spartan-ng/charts';

@Component({
	selector: 'spartan-radial-bar-chart-stacked',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full' },
	imports: [SpnRadialBarChart, SpnRadialBar],
	template: `
		<div class="relative mx-auto block aspect-square h-[250px] w-[250px] max-w-full">
			<spn-radial-bar-chart
				class="block h-full w-full"
				[data]="data"
				innerRadius="80"
				outerRadius="110"
				startAngle="0"
				endAngle="180"
				[margin]="margin"
			>
				<spn-radial-bar
					dataKey="mobile"
					fill="var(--chart-2)"
					stackId="a"
					stroke="transparent"
					cornerRadius="5"
					strokeWidth="2"
				/>
				<spn-radial-bar
					dataKey="desktop"
					fill="var(--chart-1)"
					stackId="a"
					stroke="transparent"
					cornerRadius="5"
					strokeWidth="2"
				/>
			</spn-radial-bar-chart>
			<!-- center label sits in the gap above the half-donut centerline -->
			<div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
				<span class="text-foreground text-2xl font-bold tabular-nums">{{ total }}</span>
				<span class="text-muted-foreground text-base">Visitors</span>
			</div>
		</div>
	`,
})
export class RadialBarChartStacked {
	protected readonly margin = { top: 5, right: 5, bottom: 5, left: 5 };
	protected readonly data = [{ month: 'january', mobile: 570, desktop: 1260 }];
	protected readonly total = (1260 + 570).toLocaleString();
}
