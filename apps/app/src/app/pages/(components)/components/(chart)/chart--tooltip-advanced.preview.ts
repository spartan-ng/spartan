import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import { HlmChartImports } from '@spartan-ng/helm/chart';
import {
	VisAxisModule,
	VisCrosshairModule,
	VisStackedBarModule,
	VisTooltipModule,
	VisXYContainerModule,
} from '@unovis/angular';
import type { NumericAccessor } from '@unovis/ts';

type TooltipDatum = { date: string; running: number; swimming: number };

const chartData: TooltipDatum[] = [
	{ date: '2024-07-15', running: 450, swimming: 300 },
	{ date: '2024-07-16', running: 380, swimming: 420 },
	{ date: '2024-07-17', running: 520, swimming: 120 },
	{ date: '2024-07-18', running: 140, swimming: 550 },
	{ date: '2024-07-19', running: 600, swimming: 350 },
	{ date: '2024-07-20', running: 480, swimming: 400 },
];

const dayLabels = chartData.map((d) => {
	const date = new Date(d.date);
	return date.toLocaleDateString('en-US', { weekday: 'short' });
});

@Component({
	selector: 'spartan-chart-tooltip-advanced-preview',
	imports: [
		HlmCardImports,
		HlmChartImports,
		VisStackedBarModule,
		VisXYContainerModule,
		VisAxisModule,
		VisCrosshairModule,
		VisTooltipModule,
	],
	host: { class: 'w-full max-w-md' },
	template: `
		<hlm-card class="w-full">
			<hlm-card-header>
				<h3 hlmCardTitle>Tooltip - Advanced</h3>
				<p hlmCardDescription>Tooltip with custom formatter and total</p>
			</hlm-card-header>
			<hlm-card-content>
				@if (isBrowser) {
					<hlm-chart-container [config]="chartConfig">
						<vis-xy-container [data]="data" [margin]="{ top: 8, bottom: 20, left: 36, right: 8 }">
							<vis-stacked-bar [x]="xAccessor" [y]="yAccessors" [color]="colorAccessor" [roundedCorners]="4" />
							<vis-axis
								type="x"
								position="bottom"
								[tickFormat]="tickFormat"
								[gridLine]="false"
								[tickLine]="false"
								[domainLine]="false"
							/>
							<vis-axis type="y" position="left" [gridLine]="true" [tickLine]="false" [domainLine]="false" />
							<vis-crosshair [template]="crosshairTemplate" />
							<vis-tooltip />
						</vis-xy-container>
					</hlm-chart-container>
				}
			</hlm-card-content>
		</hlm-card>
	`,
})
export class ChartTooltipAdvancedPreview {
	public readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	public readonly data = chartData;
	public readonly xAccessor: NumericAccessor<TooltipDatum> = (_d: TooltipDatum, i: number) => i;
	public readonly yAccessors: NumericAccessor<TooltipDatum>[] = [
		(d: TooltipDatum) => d.running,
		(d: TooltipDatum) => d.swimming,
	];
	public readonly colorAccessor = (_d: TooltipDatum, i: number) => (i === 0 ? 'var(--chart-1)' : 'var(--chart-2)');
	public readonly tickFormat = (_: number | Date, i: number) => dayLabels[i] ?? '';

	public readonly crosshairTemplate = (d: TooltipDatum) => {
		const total = d.running + d.swimming;
		const items = [
			{ name: 'Running', value: d.running, color: 'var(--chart-1)' },
			{ name: 'Swimming', value: d.swimming, color: 'var(--chart-2)' },
		];
		const itemHtml = items
			.map(
				(item) => `
					<div class="flex w-full items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground items-center">
						<div class="h-2.5 w-2.5 shrink-0 rounded-xs" style="background:${item.color}"></div>
						<div class="flex flex-1 justify-between leading-none items-center">
							<span class="text-muted-foreground">${item.name}</span>
							<span class="text-foreground font-mono font-medium tabular-nums ml-4">${item.value.toLocaleString()} kcal</span>
						</div>
					</div>
				`,
			)
			.join('');
		const totalHtml = `
			<div class="flex w-full items-stretch gap-2 items-center pt-1.5 border-t border-border/50 mt-1.5">
				<div class="flex flex-1 justify-between leading-none items-center">
					<span class="text-foreground font-medium">Total</span>
					<span class="text-foreground font-mono font-medium tabular-nums ml-4">${total.toLocaleString()} kcal</span>
				</div>
			</div>
		`;
		return `
			<div class="border-border/50 bg-background grid min-w-32 items-start rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
				<div class="grid gap-1.5">${itemHtml}${totalHtml}</div>
			</div>
		`;
	};

	public readonly chartConfig = {
		running: { label: 'Running', color: 'var(--chart-1)' },
		swimming: { label: 'Swimming', color: 'var(--chart-2)' },
	} satisfies ChartConfig;
}
