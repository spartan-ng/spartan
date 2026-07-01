import { ChangeDetectionStrategy, Component } from '@angular/core';
import { type BarRadius, SpnBar, SpnBarChart, SpnTooltip, SpnTooltipContentDef, SpnXAxis } from '@spartan-ng/charts';
import { ChartConfig, HlmChartImports } from '@spartan-ng/helm/chart';

@Component({
	selector: 'spartan-tooltip-indicator-line',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full' },
	imports: [HlmChartImports, SpnBarChart, SpnXAxis, SpnBar, SpnTooltip, SpnTooltipContentDef],
	template: `
		<hlm-chart-container class="min-h-50 w-full" [config]="chartConfig">
			<spn-bar-chart [data]="data" [margin]="margin" defaultIndex="1">
				<spn-x-axis
					dataKey="date"
					axisLine="false"
					tickLine="false"
					tickSize="0"
					tickPadding="10"
					[tickFormatter]="formatDay"
				/>
				<spn-bar dataKey="running" name="Running" fill="var(--chart-1)" [radius]="runningRadius" stackId="a" />
				<spn-bar dataKey="swimming" name="Swimming" fill="var(--chart-2)" [radius]="swimmingRadius" stackId="a" />
				<spn-tooltip>
					<ng-template spnTooltipContent let-state>
						<hlm-chart-tooltip-content [config]="chartConfig" [state]="state" indicator="line" />
					</ng-template>
				</spn-tooltip>
			</spn-bar-chart>
		</hlm-chart-container>
	`,
})
export class TooltipIndicatorLine {
	public readonly chartConfig: ChartConfig = {
		running: {
			label: 'Running',
			color: 'var(--chart-1)',
		},
		swimming: {
			label: 'Swimming',
			color: 'var(--chart-2)',
		},
	};

	protected readonly margin = { top: 12, right: 12, bottom: 24, left: 12 };
	protected readonly runningRadius: BarRadius = [0, 0, 4, 4];
	protected readonly swimmingRadius: BarRadius = [4, 4, 0, 0];
	protected readonly formatDay = (value: unknown): string =>
		new Date(String(value)).toLocaleDateString('en-US', { weekday: 'short' });
	protected readonly data = [
		{ date: '2024-07-15', running: 450, swimming: 300 },
		{ date: '2024-07-16', running: 380, swimming: 420 },
		{ date: '2024-07-17', running: 520, swimming: 120 },
		{ date: '2024-07-18', running: 140, swimming: 550 },
		{ date: '2024-07-19', running: 600, swimming: 350 },
		{ date: '2024-07-20', running: 480, swimming: 400 },
	];
}
