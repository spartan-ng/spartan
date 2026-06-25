import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import { HlmChartImports } from '@spartan-ng/helm/chart';
import { VisDonutModule, VisSingleContainerModule } from '@unovis/angular';
import type { NumericAccessor } from '@unovis/ts';

type PieDatum = { browser: string; value: number; color: string };

const pieData: PieDatum[] = [
	{ browser: 'chrome', value: 275, color: 'var(--chart-1)' },
	{ browser: 'safari', value: 200, color: 'var(--chart-2)' },
	{ browser: 'firefox', value: 187, color: 'var(--chart-3)' },
	{ browser: 'edge', value: 173, color: 'var(--chart-4)' },
	{ browser: 'other', value: 90, color: 'var(--chart-5)' },
];

@Component({
	selector: 'spartan-chart-pie-legend-preview',
	imports: [HlmCardImports, HlmChartImports, VisSingleContainerModule, VisDonutModule],
	host: { class: 'w-full max-w-md' },
	template: `
		<hlm-card class="flex w-full flex-col">
			<hlm-card-header class="items-center pb-0">
				<h3 hlmCardTitle>Pie Chart - Legend</h3>
				<p hlmCardDescription>January - June 2024</p>
			</hlm-card-header>
			<hlm-card-content class="flex-1 pb-0">
				@if (isBrowser) {
					<hlm-chart-container [config]="chartConfig" class="mx-auto aspect-square max-h-[300px]">
						<vis-single-container [data]="data" [sizing]="'fit'">
							<vis-donut
								[value]="valueAccessor"
								[color]="colorAccessor"
								[arcWidth]="40"
								[cornerRadius]="4"
								[padAngle]="0.02"
							/>
						</vis-single-container>
					</hlm-chart-container>
				}
			</hlm-card-content>
		</hlm-card>
	`,
})
export class ChartPieLegendPreview {
	public readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	public readonly data = pieData;
	public readonly valueAccessor: NumericAccessor<PieDatum> = (d: PieDatum) => d.value;
	public readonly colorAccessor = (d: PieDatum) => d.color;

	public readonly chartConfig = {
		chrome: { label: 'Chrome', color: 'var(--chart-1)' },
		safari: { label: 'Safari', color: 'var(--chart-2)' },
		firefox: { label: 'Firefox', color: 'var(--chart-3)' },
		edge: { label: 'Edge', color: 'var(--chart-4)' },
		other: { label: 'Other', color: 'var(--chart-5)' },
	} satisfies ChartConfig;
}
