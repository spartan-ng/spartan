import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HLM_CHART_THEME, HlmChartImports, hlmChartTooltip } from '@spartan-ng/helm/chart';
import { barY, defineChart } from '@tanstack/charts';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';

const chartData = [
	{ date: '2024-04-01', desktop: 222, mobile: 150 },
	{ date: '2024-04-02', desktop: 97, mobile: 180 },
	{ date: '2024-04-03', desktop: 167, mobile: 120 },
	{ date: '2024-04-04', desktop: 242, mobile: 260 },
	{ date: '2024-04-05', desktop: 373, mobile: 290 },
	{ date: '2024-04-06', desktop: 301, mobile: 340 },
	{ date: '2024-04-07', desktop: 245, mobile: 180 },
	{ date: '2024-04-08', desktop: 409, mobile: 320 },
	{ date: '2024-04-09', desktop: 59, mobile: 110 },
	{ date: '2024-04-10', desktop: 261, mobile: 190 },
	{ date: '2024-04-11', desktop: 327, mobile: 350 },
	{ date: '2024-04-12', desktop: 292, mobile: 210 },
	{ date: '2024-04-13', desktop: 342, mobile: 380 },
	{ date: '2024-04-14', desktop: 137, mobile: 220 },
	{ date: '2024-04-15', desktop: 120, mobile: 170 },
	{ date: '2024-04-16', desktop: 138, mobile: 190 },
	{ date: '2024-04-17', desktop: 446, mobile: 360 },
	{ date: '2024-04-18', desktop: 364, mobile: 410 },
	{ date: '2024-04-19', desktop: 243, mobile: 180 },
	{ date: '2024-04-20', desktop: 89, mobile: 150 },
	{ date: '2024-04-21', desktop: 137, mobile: 200 },
	{ date: '2024-04-22', desktop: 224, mobile: 170 },
	{ date: '2024-04-23', desktop: 138, mobile: 230 },
	{ date: '2024-04-24', desktop: 387, mobile: 290 },
	{ date: '2024-04-25', desktop: 215, mobile: 250 },
	{ date: '2024-04-26', desktop: 75, mobile: 130 },
	{ date: '2024-04-27', desktop: 383, mobile: 420 },
	{ date: '2024-04-28', desktop: 122, mobile: 180 },
	{ date: '2024-04-29', desktop: 315, mobile: 240 },
	{ date: '2024-04-30', desktop: 454, mobile: 380 },
] as const;

const chartKeys = ['desktop', 'mobile'] as const;
type ChartKey = (typeof chartKeys)[number];

const chartConfig = {
	desktop: { label: 'Desktop', color: 'var(--chart-2)' },
	mobile: { label: 'Mobile', color: 'var(--chart-1)' },
} as const;

type ChartDatum = (typeof chartData)[number];

const totals = chartData.reduce(
	(total, current) => ({
		desktop: total.desktop + current.desktop,
		mobile: total.mobile + current.mobile,
	}),
	{ desktop: 0, mobile: 0 },
);
const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const longDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const formatDate = (value: string, formatter: Intl.DateTimeFormat) => formatter.format(new Date(`${value}T00:00:00`));

export const defaultImports = `import { HLM_CHART_THEME, HlmChartImports, hlmChartTooltip } from '@spartan-ng/helm/chart';
import { barY, defineChart } from '@tanstack/charts';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';`;

export const defaultSkeleton = `@defer {
  <tanstack-chart hlmChart [options]="_chartOptions" />
} @placeholder {
  <div class="aspect-video w-full" aria-hidden="true"></div>
}`;

@Component({
	selector: 'spartan-chart-preview',
	imports: [HlmCardImports, HlmChartImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full max-w-3xl' },
	template: `
		<hlm-card class="w-full gap-0 py-0!">
			<hlm-card-header class="flex flex-col items-stretch gap-0 border-b p-0! sm:flex-row">
				<div class="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
					<h3 hlmCardTitle>Bar Chart - Interactive</h3>
					<p hlmCardDescription>Showing total visitors for the last 30 days</p>
				</div>

				<div class="flex">
					@for (chart of _chartKeys; track chart) {
						<button
							type="button"
							class="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
							[attr.data-active]="_activeChart() === chart"
							[attr.aria-pressed]="_activeChart() === chart"
							(click)="_activeChart.set(chart)"
						>
							<span class="text-muted-foreground text-xs">{{ _chartConfig[chart].label }}</span>
							<span class="text-lg leading-none font-bold sm:text-3xl">{{ _totals[chart].toLocaleString() }}</span>
						</button>
					}
				</div>
			</hlm-card-header>

			<div hlmCardContent class="px-2 sm:p-6">
				<tanstack-chart hlmChart [options]="_chartOptions()" />
			</div>
		</hlm-card>
	`,
})
export class ChartPreview {
	protected readonly _activeChart = signal<ChartKey>('desktop');
	protected readonly _chartKeys = chartKeys;
	protected readonly _chartConfig = chartConfig;
	protected readonly _totals = totals;
	protected readonly _chartOptions = computed(() => {
		const activeChart = this._activeChart();
		const activeConfig = chartConfig[activeChart];

		return {
			definition: defineChart(
				{
					marks: [
						barY(chartData, {
							x: 'date',
							y: activeChart,
							fill: activeConfig.color,
							inset: 1,
						}),
					],
					x: {
						scale: () => scaleBand<string>().padding(0.16),
						axis: {
							ticks: { format: (value) => formatDate(value, shortDate) },
							tickLabels: { thin: { minGap: 32 } },
						},
					},
					y: { scale: scaleLinear, nice: true, grid: true, axis: false },
					theme: HLM_CHART_THEME,
				},
				{
					focus: 'nearest-x',
					tooltip: hlmChartTooltip<ChartDatum, string, number>({
						className: 'w-[150px]',
						content: ([point]) => ({
							title: point ? formatDate(point.xValue, longDate) : undefined,
							rows: point
								? [{ label: activeConfig.label, value: point.yValue.toLocaleString(), color: point.color }]
								: [],
						}),
					}),
				},
			),
			ariaLabel: `${activeConfig.label} visitors by day`,
			ariaDescription: `${activeConfig.label} visitor totals for April 2024.`,
			height: 250,
		};
	});
}
