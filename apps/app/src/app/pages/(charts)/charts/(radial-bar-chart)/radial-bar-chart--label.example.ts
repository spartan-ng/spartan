import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpnRadialBar, SpnRadialBarChart } from '@spartan-ng/charts';

@Component({
	selector: 'spartan-radial-bar-chart-label',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full' },
	imports: [SpnRadialBarChart, SpnRadialBar],
	template: `
		<div class="relative mx-auto block aspect-square h-[250px] w-[250px] max-w-full">
			<spn-radial-bar-chart
				class="mx-auto block aspect-square h-[250px] w-[250px] max-w-full"
				[data]="data"
				innerRadius="30"
				outerRadius="110"
				startAngle="-90"
				endAngle="380"
				[margin]="margin"
			>
				<spn-radial-bar dataKey="visitors" nameKey="browser" labelKey="browser" background="true" label="true" />
			</spn-radial-bar-chart>
		</div>
	`,
})
export class RadialBarChartLabel {
	protected readonly margin = { top: 5, right: 5, bottom: 5, left: 5 };
	protected readonly data = [
		{ browser: 'chrome', visitors: 275, fill: 'var(--chart-1)' },
		{ browser: 'safari', visitors: 200, fill: 'var(--chart-2)' },
		{ browser: 'firefox', visitors: 187, fill: 'var(--chart-3)' },
		{ browser: 'edge', visitors: 173, fill: 'var(--chart-4)' },
		{ browser: 'other', visitors: 90, fill: 'var(--chart-5)' },
	];
}
