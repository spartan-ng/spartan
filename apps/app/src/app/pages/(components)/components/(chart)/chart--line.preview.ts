import { Component } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import { HlmChartImports } from '@spartan-ng/helm/chart';
import {
	VisAxisComponent,
	VisCrosshairComponent,
	VisLineComponent,
	VisTooltipComponent,
	VisXYContainerComponent,
} from '@unovis/angular';
import { CurveType } from '@unovis/ts';

const lineChartData = [
	{ month: 1, monthLabel: 'January', desktop: 186, mobile: 80 },
	{ month: 2, monthLabel: 'February', desktop: 305, mobile: 200 },
	{ month: 3, monthLabel: 'March', desktop: 237, mobile: 120 },
	{ month: 4, monthLabel: 'April', desktop: 73, mobile: 190 },
	{ month: 5, monthLabel: 'May', desktop: 209, mobile: 130 },
	{ month: 6, monthLabel: 'June', desktop: 214, mobile: 140 },
];

@Component({
	selector: 'spartan-chart-line-preview',
	imports: [
		HlmCardImports,
		HlmChartImports,
		VisXYContainerComponent,
		VisLineComponent,
		VisAxisComponent,
		VisCrosshairComponent,
		VisTooltipComponent,
	],
	host: { class: 'w-full max-w-md' },
	template: `
		<hlm-card class="w-full">
			<hlm-card-header>
				<h3 hlmCardTitle>Line Chart - Multiple</h3>
				<p hlmCardDescription>January - June 2024</p>
			</hlm-card-header>
			<hlm-card-content>
				<hlm-chart-container [config]="chartConfig">
					<vis-xy-container [data]="data" [margin]="{ left: 12, right: 12 }">
						<vis-line [x]="x" [y]="y" [color]="colors" [curveType]="curveType" [lineWidth]="2" />
						<vis-axis
							type="x"
							[x]="x"
							[tickLine]="false"
							[domainLine]="false"
							[gridLine]="false"
							[numTicks]="6"
							[tickFormat]="tickFormat"
						/>
						<vis-crosshair [color]="crosshairColors" />
						<vis-tooltip />
					</vis-xy-container>
				</hlm-chart-container>
			</hlm-card-content>
			<hlm-card-footer>
				<div class="flex w-full items-start gap-2">
					<div class="grid gap-2">
						<div class="flex items-center gap-2 leading-none font-medium">Trending up by 5.2% this month</div>
						<div class="text-muted-foreground flex items-center gap-2 leading-none">
							Showing total visitors for the last 6 months
						</div>
					</div>
				</div>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class ChartLinePreview {
	public readonly data = lineChartData;
	public readonly chartConfig = {
		desktop: {
			label: 'Desktop',
			color: 'var(--chart-1)',
		},
		mobile: {
			label: 'Mobile',
			color: 'var(--chart-2)',
		},
	} satisfies ChartConfig;

	public readonly curveType = CurveType.MonotoneX;
	public readonly x = (d: (typeof lineChartData)[number]) => d.month;
	public readonly y = [
		(d: (typeof lineChartData)[number]) => d.desktop,
		(d: (typeof lineChartData)[number]) => d.mobile,
	];
	public readonly colors = [this.chartConfig.desktop.color, this.chartConfig.mobile.color];
	public readonly crosshairColors = (_d: unknown, i: number) =>
		[this.chartConfig.desktop.color, this.chartConfig.mobile.color][i % 2];
	public readonly tickFormat = (_d: number, i: number) => lineChartData[i]?.monthLabel.slice(0, 3) ?? '';
}
