import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
	SpnBar,
	SpnBarChart,
	SpnCartesianGrid,
	SpnLegend,
	SpnLegendContentDef,
	SpnTooltip,
	SpnTooltipContentDef,
	SpnXAxis,
} from '@spartan-ng/charts';
import { ChartConfig, HlmChartImports } from '@spartan-ng/helm/chart';

@Component({
	selector: 'spartan-charts-legend',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full' },
	imports: [
		HlmChartImports,
		SpnBarChart,
		SpnBar,
		SpnCartesianGrid,
		SpnXAxis,
		SpnTooltip,
		SpnTooltipContentDef,
		SpnLegend,
		SpnLegendContentDef,
	],
	template: `
		<hlm-chart-container class="min-h-50 w-full" [config]="chartConfig">
			<spn-bar-chart [data]="data" [margin]="margin">
				<spn-cartesian-grid vertical="false" />
				<spn-x-axis
					dataKey="month"
					axisLine="false"
					tickLine="false"
					tickSize="0"
					tickPadding="10"
					[tickFormatter]="formatMonth"
				/>
				<spn-bar dataKey="desktop" name="Desktop" fill="var(--color-desktop)" radius="4" />
				<spn-bar dataKey="mobile" name="Mobile" fill="var(--color-mobile)" radius="4" />
				<spn-tooltip>
					<ng-template spnTooltipContent let-state>
						<hlm-chart-tooltip-content [config]="chartConfig" [state]="state" />
					</ng-template>
				</spn-tooltip>
				<spn-legend>
					<ng-template spnLegendContent>
						<hlm-chart-legend-content [config]="chartConfig" />
					</ng-template>
				</spn-legend>
			</spn-bar-chart>
		</hlm-chart-container>
	`,
})
export class ChartsLegend {
	public readonly chartConfig: ChartConfig = {
		desktop: {
			label: 'Desktop',
			color: '#2563eb',
		},
		mobile: {
			label: 'Mobile',
			color: '#60a5fa',
		},
	};

	protected readonly margin = { top: 12, right: 12, bottom: 24, left: 12 };
	protected readonly formatMonth = (value: unknown): string => String(value).slice(0, 3);
	protected readonly data = [
		{ month: 'January', desktop: 186, mobile: 80 },
		{ month: 'February', desktop: 305, mobile: 200 },
		{ month: 'March', desktop: 237, mobile: 120 },
		{ month: 'April', desktop: 73, mobile: 190 },
		{ month: 'May', desktop: 209, mobile: 130 },
		{ month: 'June', desktop: 214, mobile: 140 },
	];
}
