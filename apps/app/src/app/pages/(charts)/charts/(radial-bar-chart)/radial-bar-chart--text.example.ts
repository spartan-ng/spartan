import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpnRadialBar, SpnRadialBarChart } from '@spartan-ng/charts';

@Component({
	selector: 'spartan-radial-bar-chart-text',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full' },
	imports: [SpnRadialBarChart, SpnRadialBar],
	template: `
		<div class="relative mx-auto block aspect-square h-[250px] w-[250px] max-w-full">
			<!-- track grid: muted outer ring (r=90) with a background hole (r=80) -->
			<div class="bg-muted absolute top-1/2 left-1/2 size-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full">
				<div
					class="bg-background absolute top-1/2 left-1/2 size-[160px] -translate-x-1/2 -translate-y-1/2 rounded-full"
				></div>
			</div>
			<spn-radial-bar-chart
				class="relative z-10 mx-auto block aspect-square h-[250px] w-[250px] max-w-full"
				[data]="data"
				innerRadius="80"
				outerRadius="90"
				startAngle="0"
				endAngle="250"
				[margin]="margin"
			>
				<spn-radial-bar dataKey="visitors" nameKey="browser" background="true" cornerRadius="10" />
			</spn-radial-bar-chart>
			<!-- center label -->
			<div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
				<span class="text-foreground text-4xl font-bold tabular-nums">{{ total }}</span>
				<span class="text-muted-foreground text-base">Visitors</span>
			</div>
		</div>
	`,
})
export class RadialBarChartText {
	protected readonly margin = { top: 5, right: 5, bottom: 5, left: 5 };
	protected readonly data = [{ browser: 'safari', visitors: 200, fill: 'var(--chart-2)' }];
	protected readonly total = (200).toLocaleString();
}
