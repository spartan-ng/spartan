import { Component } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import { HlmChartImports } from '@spartan-ng/helm/chart';
import {
	VisAreaComponent,
	VisAxisComponent,
	VisCrosshairComponent,
	VisLineComponent,
	VisTooltipComponent,
	VisXYContainerComponent,
} from '@unovis/angular';

const areaChartData = [
	{ month: 1, monthLabel: 'January', desktop: 186 },
	{ month: 2, monthLabel: 'February', desktop: 305 },
	{ month: 3, monthLabel: 'March', desktop: 237 },
	{ month: 4, monthLabel: 'April', desktop: 73 },
	{ month: 5, monthLabel: 'May', desktop: 209 },
	{ month: 6, monthLabel: 'June', desktop: 214 },
];

@Component({
	selector: 'spartan-chart-area-preview',
	imports: [
		HlmCardImports,
		HlmChartImports,
		VisXYContainerComponent,
		VisAreaComponent,
		VisLineComponent,
		VisAxisComponent,
		VisCrosshairComponent,
		VisTooltipComponent,
	],
	host: { class: 'w-full max-w-md' },
	template: `
		<hlm-card class="w-full">
			<hlm-card-header>
				<h3 hlmCardTitle>Area Chart</h3>
				<p hlmCardDescription>Showing total visitors for the last 6 months</p>
			</hlm-card-header>
			<hlm-card-content>
				<hlm-chart-container [config]="chartConfig">
					<vis-xy-container [data]="data" [margin]="{ left: 12, right: 12 }">
						<vis-area [x]="x" [y]="y" [color]="chartConfig['desktop'].color" [opacity]="0.4" />
						<vis-line [x]="x" [y]="y" [color]="chartConfig['desktop'].color" [lineWidth]="1" />
						<vis-axis
							type="x"
							[x]="x"
							[tickLine]="false"
							[domainLine]="false"
							[gridLine]="false"
							[numTicks]="6"
							[tickFormat]="tickFormat"
						/>
						<vis-crosshair [color]="chartConfig['desktop'].color" />
						<vis-tooltip />
					</vis-xy-container>
				</hlm-chart-container>
			</hlm-card-content>
			<hlm-card-footer>
				<div class="flex w-full items-start gap-2">
					<div class="grid gap-2">
						<div class="flex items-center gap-2 leading-none font-medium">Trending up by 5.2% this month</div>
						<div class="text-muted-foreground flex items-center gap-2 leading-none">January - June 2024</div>
					</div>
				</div>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class ChartAreaPreview {
	public readonly data = areaChartData;
	public readonly chartConfig = {
		desktop: {
			label: 'Desktop',
			color: 'var(--chart-1)',
		},
	} satisfies ChartConfig;

	public readonly x = (d: (typeof areaChartData)[number]) => d.month;
	public readonly y = (d: (typeof areaChartData)[number]) => d.desktop;
	public readonly tickFormat = (_d: number, i: number) => areaChartData[i]?.monthLabel.slice(0, 3) ?? '';
}

export const defaultImports = `
import { HlmChartImports } from '@spartan-ng/helm/chart';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import {
  VisAreaComponent,
  VisAxisComponent,
  VisCrosshairComponent,
  VisLineComponent,
  VisTooltipComponent,
  VisXYContainerComponent,
} from '@unovis/angular';
`;

export const defaultSkeleton = `
<hlm-chart-container [config]="chartConfig">
  <vis-xy-container [data]="data">
    <vis-area [x]="x" [y]="y" [color]="color" [opacity]="0.4" />
    <vis-line [x]="x" [y]="y" [color]="color" [lineWidth]="1" />
    <vis-axis type="x" [x]="x" [tickLine]="false" [domainLine]="false" />
    <vis-crosshair [color]="color" />
    <vis-tooltip />
  </vis-xy-container>
</hlm-chart-container>
`;
