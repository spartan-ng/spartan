import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import { HlmChartImports } from '@spartan-ng/helm/chart';
import { VisDonutModule, VisSingleContainerModule, VisTooltipModule } from '@unovis/angular';
import type { NumericAccessor } from '@unovis/ts';

type PieStackedDatum = { month: string; value: number };

const desktopData: PieStackedDatum[] = [
	{ month: 'january', value: 186 },
	{ month: 'february', value: 305 },
	{ month: 'march', value: 237 },
	{ month: 'april', value: 73 },
	{ month: 'may', value: 209 },
];

const mobileData: PieStackedDatum[] = [
	{ month: 'january', value: 80 },
	{ month: 'february', value: 200 },
	{ month: 'march', value: 120 },
	{ month: 'april', value: 190 },
	{ month: 'may', value: 130 },
];

const monthColors: Record<string, string> = {
	january: 'var(--chart-1)',
	february: 'var(--chart-2)',
	march: 'var(--chart-3)',
	april: 'var(--chart-4)',
	may: 'var(--chart-5)',
};

@Component({
	selector: 'spartan-chart-pie-stacked-preview',
	imports: [HlmCardImports, HlmChartImports, VisSingleContainerModule, VisDonutModule, VisTooltipModule],
	template: `
		<hlm-card class="flex w-full flex-col">
			<hlm-card-header class="items-center pb-0">
				<h3 hlmCardTitle>Pie Chart - Stacked</h3>
				<p hlmCardDescription>January - May 2024</p>
			</hlm-card-header>
			<hlm-card-content class="flex-1 pb-0">
				@if (isBrowser) {
					<hlm-chart-container [config]="chartConfig" class="mx-auto aspect-square max-h-[250px]">
						<vis-single-container [data]="mobileData" [sizing]="'fit'">
							<vis-donut [value]="valueAccessor" [color]="colorAccessor" [arcWidth]="25" />
							<vis-tooltip [followCursor]="true" />
						</vis-single-container>
						<vis-single-container [data]="desktopData" [sizing]="'fit'">
							<vis-donut [value]="valueAccessor" [color]="colorAccessor" [arcWidth]="0" [radius]="50" />
							<vis-tooltip [followCursor]="true" />
						</vis-single-container>
					</hlm-chart-container>
				}
			</hlm-card-content>
			<hlm-card-footer class="flex-col gap-2">
				<div class="flex items-center gap-2 leading-none font-medium">Trending up by 5.2% this month</div>
				<div class="text-muted-foreground leading-none">Showing total visitors for the last 5 months</div>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class ChartPieStackedPreview {
	public readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	public readonly desktopData = desktopData;
	public readonly mobileData = mobileData;
	public readonly valueAccessor: NumericAccessor<PieStackedDatum> = (d: PieStackedDatum) => d.value;
	public readonly colorAccessor = (d: PieStackedDatum) => monthColors[d.month] ?? 'var(--chart-1)';

	public readonly chartConfig = {
		'january-chart-1': { label: 'January', color: 'var(--chart-1)' },
		'february-chart-2': { label: 'February', color: 'var(--chart-2)' },
		'march-chart-3': { label: 'March', color: 'var(--chart-3)' },
		'april-chart-4': { label: 'April', color: 'var(--chart-4)' },
		'may-chart-5': { label: 'May', color: 'var(--chart-5)' },
		desktop: { label: 'Desktop', color: 'var(--chart-1)' },
		mobile: { label: 'Mobile', color: 'var(--chart-2)' },
	} satisfies ChartConfig;
}
