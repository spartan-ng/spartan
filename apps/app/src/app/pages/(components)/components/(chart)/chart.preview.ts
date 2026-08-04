import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import { HlmChartImports } from '@spartan-ng/helm/chart';
import {
	VisAxisModule,
	VisCrosshairModule,
	VisGroupedBarModule,
	VisTooltipModule,
	VisXYContainerModule,
} from '@unovis/angular';
import type { NumericAccessor } from '@unovis/ts';

const chartData = [
	{ month: 'January', desktop: 186 },
	{ month: 'February', desktop: 305 },
	{ month: 'March', desktop: 237 },
	{ month: 'April', desktop: 73 },
	{ month: 'May', desktop: 209 },
	{ month: 'June', desktop: 214 },
];

const monthLabels = chartData.map((d) => d.month.slice(0, 3));

@Component({
	selector: 'spartan-chart-preview',
	imports: [
		HlmChartImports,
		VisGroupedBarModule,
		VisXYContainerModule,
		VisAxisModule,
		VisCrosshairModule,
		VisTooltipModule,
	],
	host: { class: 'block' },
	template: `
		@if (isBrowser) {
			<hlm-chart-container [config]="chartConfig" class="min-h-[200px] w-full">
				<vis-xy-container [data]="data" [margin]="{ top: 8, bottom: 20, left: 36, right: 8 }">
					<vis-grouped-bar [x]="xAccessor" [y]="[yAccessor]" [color]="colorAccessor" [roundedCorners]="4" />
					<vis-axis
						type="x"
						position="bottom"
						[tickFormat]="tickFormat"
						[gridLine]="false"
						[tickLine]="false"
						[domainLine]="false"
					/>
					<vis-axis type="y" position="left" [gridLine]="false" [tickLine]="false" [domainLine]="false" />
					<vis-crosshair [template]="crosshairTemplate" />
					<vis-tooltip />
				</vis-xy-container>
			</hlm-chart-container>
		}
	`,
})
export class ChartPreview {
	public readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	public readonly chartConfig = {
		desktop: { label: 'Desktop', color: 'var(--chart-1)' },
	} satisfies ChartConfig;

	public readonly data = chartData;
	public readonly xAccessor: NumericAccessor<(typeof chartData)[number]> = (_d, i) => i;
	public readonly yAccessor: NumericAccessor<(typeof chartData)[number]> = (d) => d.desktop;
	public readonly colorAccessor = () => 'var(--chart-1)';
	public readonly tickFormat = (_: number | Date, i: number) => monthLabels[i] ?? '';

	public readonly crosshairTemplate = (d: (typeof chartData)[number]) => {
		const items = [{ name: 'Desktop', value: d.desktop, color: 'var(--chart-1)' }];
		const itemHtml = items
			.map(
				(item) => `
					<div class="flex w-full items-stretch gap-2 items-center">
						<div class="h-2.5 w-2.5 shrink-0 rounded-xs" style="background:${item.color}"></div>
						<div class="flex flex-1 justify-between leading-none items-center">
							<span class="text-muted-foreground">${item.name}</span>
							<span class="text-foreground font-mono font-medium tabular-nums ml-4">${item.value.toLocaleString()}</span>
						</div>
					</div>
				`,
			)
			.join('');
		return `
			<div class="border-border/50 bg-background grid min-w-32 items-start rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
				<div class="grid gap-1.5">${itemHtml}</div>
			</div>
		`;
	};
}

export const defaultImports = `
import { HlmChartImports } from '@spartan-ng/helm/chart';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import {
	VisGroupedBarModule,
	VisXYContainerModule,
	VisAxisModule,
	VisCrosshairModule,
	VisTooltipModule,
} from '@unovis/angular';
import type { NumericAccessor } from '@unovis/ts';
`;

export const defaultSkeleton = `
<hlm-chart-container [config]="chartConfig" class="min-h-[200px] w-full">
  <vis-xy-container [data]="data" [margin]="{ top: 8, bottom: 20, left: 36, right: 8 }">
    <vis-grouped-bar [x]="xAccessor" [y]="[yAccessor]" [color]="colorAccessor" [roundedCorners]="4" />
    <vis-axis type="x" position="bottom" [tickFormat]="tickFormat" [gridLine]="false" [tickLine]="false" [domainLine]="false" />
    <vis-axis type="y" position="left" [gridLine]="false" [tickLine]="false" [domainLine]="false" />
    <vis-crosshair [template]="crosshairTemplate" />
    <vis-tooltip />
  </vis-xy-container>
</hlm-chart-container>
`;
