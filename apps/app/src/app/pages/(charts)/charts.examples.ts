import { HLM_CHART_THEME, hlmChartTooltip } from '@spartan-ng/helm/chart';
import { areaY, barX, barY, colorLegend, defineChart, group, lineY } from '@tanstack/charts';
import {
	pie,
	polar,
	radialArc,
	radialArea,
	radialBarAngle,
	radialBarRadius,
	radialLine,
	radialText,
} from '@tanstack/charts/polar';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { scalePoint } from '@tanstack/charts/scales/point';

const monthly = [
	{ month: 'Jan', desktop: 186, mobile: 80, low: 148, high: 218 },
	{ month: 'Feb', desktop: 305, mobile: 200, low: 260, high: 342 },
	{ month: 'Mar', desktop: 237, mobile: 120, low: 198, high: 280 },
	{ month: 'Apr', desktop: 273, mobile: 190, low: 226, high: 310 },
	{ month: 'May', desktop: 209, mobile: 130, low: 178, high: 252 },
	{ month: 'Jun', desktop: 314, mobile: 240, low: 270, high: 356 },
];

const monthlySeries = monthly.flatMap(({ month, desktop, mobile }) => [
	{ month, series: 'Desktop', value: desktop },
	{ month, series: 'Mobile', value: mobile },
]);

const products = [
	{ product: 'Search', value: 275 },
	{ product: 'Social', value: 220 },
	{ product: 'Email', value: 188 },
	{ product: 'Direct', value: 142 },
];

const changes = [
	{ month: 'Jan', value: 42 },
	{ month: 'Feb', value: -18 },
	{ month: 'Mar', value: 31 },
	{ month: 'Apr', value: -12 },
	{ month: 'May', value: 48 },
	{ month: 'Jun', value: 24 },
];

const devices = [
	{ device: 'Desktop', visitors: 560 },
	{ device: 'Mobile', visitors: 420 },
	{ device: 'Tablet', visitors: 180 },
	{ device: 'Other', visitors: 90 },
];

const radialMetrics = [
	{ metric: 'Speed', value: 82 },
	{ metric: 'Power', value: 68 },
	{ metric: 'Control', value: 91 },
	{ metric: 'Range', value: 74 },
	{ metric: 'Comfort', value: 63 },
];

const deviceNames = devices.map(({ device }) => device);
const radialNames = radialMetrics.map(({ metric }) => metric);
const devicePie = pie(devices, { value: 'visitors' });
const deviceDonut = pie(devices, { value: 'visitors', gapAngle: 0.04 });
const roundedDonut = pie(devices, { value: 'visitors', gapAngle: 0.07 });
const halfDonut = pie(devices, {
	value: 'visitors',
	startAngle: -Math.PI * 0.75,
	endAngle: Math.PI * 0.75,
	gapAngle: 0.04,
});
const completion = [
	{ status: 'Complete', value: 72 },
	{ status: 'Remaining', value: 28 },
];
const completionSlices = pie(completion, {
	value: 'value',
	startAngle: -Math.PI * 0.75,
	endAngle: Math.PI * 0.75,
	gapAngle: 0.04,
});

const chartOptions = <const TDefinition>(definition: TDefinition, ariaLabel: string, ariaDescription: string) => ({
	definition,
	ariaLabel,
	ariaDescription,
	aspectRatio: 16 / 9,
});

export const chartSections = [
	{
		id: 'area-charts',
		label: 'Area',
		description: 'Show totals, ranges, and composition changing over time.',
		examples: [
			{
				title: 'Default area',
				description: 'A single series with a semantic fill and outline.',
				options: chartOptions(
					defineChart(
						{
							marks: [
								areaY(monthly, {
									x: 'month',
									y: 'desktop',
									fill: 'var(--chart-1)',
									fillOpacity: 0.22,
									stroke: 'var(--chart-1)',
									strokeWidth: 2,
								}),
							],
							x: { scale: () => scalePoint<string>().padding(0.2) },
							y: { scale: scaleLinear, nice: true, grid: true },
							theme: HLM_CHART_THEME,
						},
						{ focus: 'nearest-x', tooltip: hlmChartTooltip() },
					),
					'Monthly desktop visitors',
					'Area chart showing desktop visitors from January through June.',
				),
			},
			{
				title: 'Range area',
				description: 'An interval between a lower and upper estimate.',
				options: chartOptions(
					defineChart(
						{
							marks: [
								areaY(monthly, {
									x: 'month',
									y1: 'low',
									y2: 'high',
									fill: 'var(--chart-2)',
									fillOpacity: 0.3,
									stroke: 'var(--chart-2)',
									strokeWidth: 2,
								}),
							],
							x: { scale: () => scalePoint<string>().padding(0.2) },
							y: { scale: scaleLinear, nice: true, grid: true },
							theme: HLM_CHART_THEME,
						},
						{ focus: 'nearest-x', tooltip: hlmChartTooltip() },
					),
					'Monthly visitor forecast range',
					'Range area chart showing lower and upper visitor estimates.',
				),
			},
			{
				title: 'Stacked area',
				description: 'Desktop and mobile contributions to the total.',
				options: chartOptions(
					defineChart(
						{
							marks: [
								areaY(monthlySeries, {
									x: 'month',
									y: 'value',
									color: 'series',
									fillOpacity: 0.7,
								}),
							],
							x: { scale: () => scalePoint<string>().padding(0.2) },
							y: { scale: scaleLinear, nice: true, grid: true },
							color: {
								domain: ['Desktop', 'Mobile'],
								legend: colorLegend({ label: 'Device' }),
							},
							theme: HLM_CHART_THEME,
						},
						{ focus: 'group-x', tooltip: hlmChartTooltip() },
					),
					'Visitors by device',
					'Stacked area chart comparing desktop and mobile visitors.',
				),
			},
			{
				title: 'Layered area',
				description: 'Two translucent series sharing one baseline.',
				options: chartOptions(
					defineChart(
						{
							marks: [
								areaY(monthly, {
									x: 'month',
									y: 'desktop',
									fill: 'var(--chart-1)',
									fillOpacity: 0.18,
									stroke: 'var(--chart-1)',
								}),
								areaY(monthly, {
									x: 'month',
									y: 'mobile',
									fill: 'var(--chart-2)',
									fillOpacity: 0.18,
									stroke: 'var(--chart-2)',
								}),
							],
							x: { scale: () => scalePoint<string>().padding(0.2) },
							y: { scale: scaleLinear, nice: true, grid: true },
							theme: HLM_CHART_THEME,
						},
						{ focus: 'nearest-x', tooltip: hlmChartTooltip() },
					),
					'Layered visitors by device',
					'Layered area chart comparing desktop and mobile visitors.',
				),
			},
		],
	},
	{
		id: 'bar-charts',
		label: 'Bar',
		description: 'Compare magnitudes across categories and series.',
		examples: [
			{
				title: 'Default bar',
				description: 'A compact vertical comparison by month.',
				options: chartOptions(
					defineChart(
						{
							marks: [barY(monthly, { x: 'month', y: 'desktop', inset: 4, fill: 'var(--chart-1)', radius: 4 })],
							x: { scale: () => scaleBand<string>().padding(0.16) },
							y: { scale: scaleLinear, nice: true, grid: true },
							theme: HLM_CHART_THEME,
						},
						{ focus: 'nearest-x', tooltip: hlmChartTooltip() },
					),
					'Monthly desktop visitors',
					'Bar chart showing desktop visitors from January through June.',
				),
			},
			{
				title: 'Horizontal bar',
				description: 'Ranked acquisition channels with long labels.',
				options: chartOptions(
					defineChart(
						{
							marks: [barX(products, { x: 'value', y: 'product', inset: 4, fill: 'var(--chart-2)', radius: 4 })],
							x: { scale: scaleLinear, nice: true, grid: true },
							y: { scale: () => scaleBand<string>().padding(0.16) },
							theme: HLM_CHART_THEME,
						},
						{ focus: 'nearest-y', tooltip: hlmChartTooltip() },
					),
					'Visitors by acquisition channel',
					'Horizontal bar chart ranking acquisition channels by visitors.',
				),
			},
			{
				title: 'Grouped bar',
				description: 'Desktop and mobile values side by side.',
				options: chartOptions(
					defineChart(
						{
							marks: [
								barY(monthlySeries, {
									x: 'month',
									y: 'value',
									color: 'series',
									layout: group({ padding: 0.18 }),
									inset: 2,
									radius: 3,
								}),
							],
							x: { scale: () => scaleBand<string>().padding(0.16) },
							y: { scale: scaleLinear, nice: true, grid: true },
							color: {
								domain: ['Desktop', 'Mobile'],
								legend: colorLegend({ label: 'Device' }),
							},
							theme: HLM_CHART_THEME,
						},
						{ focus: 'group-x', tooltip: hlmChartTooltip() },
					),
					'Grouped visitors by device',
					'Grouped bar chart comparing desktop and mobile visitors.',
				),
			},
			{
				title: 'Diverging bar',
				description: 'Positive and negative monthly change around zero.',
				options: chartOptions(
					defineChart(
						{
							marks: [
								barY(changes, {
									x: 'month',
									y: 'value',
									inset: 4,
									fill: ({ value }) => (value >= 0 ? 'var(--chart-2)' : 'var(--chart-5)'),
									radius: 3,
								}),
							],
							x: { scale: () => scaleBand<string>().padding(0.16) },
							y: { scale: scaleLinear, nice: true, grid: true },
							theme: HLM_CHART_THEME,
						},
						{ focus: 'nearest-x', tooltip: hlmChartTooltip() },
					),
					'Monthly visitor change',
					'Diverging bar chart showing positive and negative monthly changes.',
				),
			},
		],
	},
	{
		id: 'line-charts',
		label: 'Line',
		description: 'Follow trends and compare trajectories over ordered values.',
		examples: [
			{
				title: 'Default line',
				description: 'A focused trend with visible data points.',
				options: chartOptions(
					defineChart(
						{
							marks: [
								lineY(monthly, {
									x: 'month',
									y: 'desktop',
									points: true,
									stroke: 'var(--chart-1)',
									strokeWidth: 2.5,
								}),
							],
							x: { scale: () => scalePoint<string>().padding(0.2) },
							y: { scale: scaleLinear, nice: true, grid: true },
							theme: HLM_CHART_THEME,
						},
						{ focus: 'nearest-x', tooltip: hlmChartTooltip() },
					),
					'Monthly desktop trend',
					'Line chart showing desktop visitors from January through June.',
				),
			},
			{
				title: 'Multiple lines',
				description: 'Two device series with a shared legend.',
				options: chartOptions(
					defineChart(
						{
							marks: [
								lineY(monthlySeries, {
									x: 'month',
									y: 'value',
									z: 'series',
									color: 'series',
									points: true,
									strokeWidth: 2.5,
								}),
							],
							x: { scale: () => scalePoint<string>().padding(0.2) },
							y: { scale: scaleLinear, nice: true, grid: true },
							color: {
								domain: ['Desktop', 'Mobile'],
								legend: colorLegend({ label: 'Device' }),
							},
							theme: HLM_CHART_THEME,
						},
						{ focus: 'group-x', tooltip: hlmChartTooltip() },
					),
					'Visitor trends by device',
					'Multiple line chart comparing desktop and mobile visitors.',
				),
			},
			{
				title: 'Dashed line',
				description: 'A forecast-style series with a dashed stroke.',
				options: chartOptions(
					defineChart(
						{
							marks: [
								lineY(monthly, {
									x: 'month',
									y: 'mobile',
									points: true,
									stroke: 'var(--chart-4)',
									strokeWidth: 2.5,
									strokeDasharray: '7 5',
								}),
							],
							x: { scale: () => scalePoint<string>().padding(0.2) },
							y: { scale: scaleLinear, nice: true, grid: true },
							theme: HLM_CHART_THEME,
						},
						{ focus: 'nearest-x', tooltip: hlmChartTooltip() },
					),
					'Monthly mobile forecast',
					'Dashed line chart showing a monthly mobile visitor forecast.',
				),
			},
			{
				title: 'Actual and target',
				description: 'A measured series against a constant target.',
				options: chartOptions(
					defineChart(
						{
							marks: [
								lineY(monthly, {
									x: 'month',
									y: 'desktop',
									points: true,
									stroke: 'var(--chart-1)',
									strokeWidth: 2.5,
								}),
								lineY(monthly, {
									x: 'month',
									y: () => 250,
									stroke: 'var(--muted-foreground)',
									strokeDasharray: '5 5',
								}),
							],
							x: { scale: () => scalePoint<string>().padding(0.2) },
							y: { scale: scaleLinear, nice: true, grid: true },
							theme: HLM_CHART_THEME,
						},
						{ focus: 'nearest-x', tooltip: hlmChartTooltip() },
					),
					'Visitors compared with target',
					'Line chart comparing actual desktop visitors with a target of 250.',
				),
			},
		],
	},
	{
		id: 'pie-charts',
		label: 'Pie',
		description: 'Show a small number of parts within a whole.',
		examples: [
			{
				title: 'Default pie',
				description: 'A direct part-to-whole comparison.',
				options: chartOptions(
					defineChart(
						{
							marks: [
								polar({
									inset: 8,
									radiusRatio: 0.78,
									marks: [radialArc(devicePie, { color: 'device', key: 'device' })],
								}),
							],
							color: { domain: deviceNames, legend: colorLegend({ label: 'Device' }) },
							theme: HLM_CHART_THEME,
						},
						{ tooltip: hlmChartTooltip() },
					),
					'Visitors by device',
					'Pie chart showing visitor share across four device types.',
				),
			},
			{
				title: 'Donut',
				description: 'A ring layout with clear spacing between slices.',
				options: chartOptions(
					defineChart(
						{
							marks: [
								polar({
									inset: 8,
									radiusRatio: 0.78,
									marks: [
										radialArc(deviceDonut, {
											innerRadius: ({ radius }) => radius * 0.56,
											color: 'device',
											key: 'device',
										}),
									],
								}),
							],
							color: { domain: deviceNames, legend: colorLegend({ label: 'Device' }) },
							theme: HLM_CHART_THEME,
						},
						{ tooltip: hlmChartTooltip() },
					),
					'Visitors by device',
					'Donut chart showing visitor share across four device types.',
				),
			},
			{
				title: 'Rounded donut',
				description: 'A narrow ring with rounded slice corners.',
				options: chartOptions(
					defineChart(
						{
							marks: [
								polar({
									inset: 8,
									radiusRatio: 0.78,
									marks: [
										radialArc(roundedDonut, {
											innerRadius: ({ radius }) => radius * 0.7,
											cornerRadius: 8,
											color: 'device',
											key: 'device',
										}),
									],
								}),
							],
							color: { domain: deviceNames, legend: colorLegend({ label: 'Device' }) },
							theme: HLM_CHART_THEME,
						},
						{ tooltip: hlmChartTooltip() },
					),
					'Visitors by device',
					'Rounded donut chart showing visitor share across four device types.',
				),
			},
			{
				title: 'Half donut',
				description: 'A compact semicircular part-to-whole layout.',
				options: chartOptions(
					defineChart(
						{
							marks: [
								polar({
									inset: 8,
									radiusRatio: 0.78,
									marks: [
										radialArc(halfDonut, {
											innerRadius: ({ radius }) => radius * 0.62,
											cornerRadius: 5,
											color: 'device',
											key: 'device',
										}),
									],
								}),
							],
							color: { domain: deviceNames, legend: colorLegend({ label: 'Device' }) },
							theme: HLM_CHART_THEME,
						},
						{ tooltip: hlmChartTooltip() },
					),
					'Visitors by device',
					'Half donut chart showing visitor share across four device types.',
				),
			},
		],
	},
	{
		id: 'radial-charts',
		label: 'Radial',
		description: 'Use angle and radius for compact cyclic comparisons.',
		examples: [
			{
				title: 'Radial bars',
				description: 'Values extend through radius around an angle band.',
				options: chartOptions(
					defineChart(
						{
							marks: [
								polar({
									radiusRatio: 0.78,
									angle: { scale: () => scaleBand<string>().domain(radialNames).padding(0.12) },
									radius: {
										scale: scaleLinear().domain([0, 100]),
										range: [({ radius }) => radius * 0.24, ({ radius }) => radius],
									},
									marks: [
										radialBarRadius(radialMetrics, {
											angle: 'metric',
											radius: 'value',
											color: 'metric',
											key: 'metric',
										}),
									],
								}),
							],
							color: { domain: radialNames },
							theme: HLM_CHART_THEME,
						},
						{ tooltip: hlmChartTooltip() },
					),
					'Product metrics as radial bars',
					'Radial bar chart comparing five product metrics.',
				),
			},
			{
				title: 'Concentric bars',
				description: 'Values extend through angle on concentric bands.',
				options: chartOptions(
					defineChart(
						{
							marks: [
								polar({
									radiusRatio: 0.78,
									angle: { scale: scaleLinear().domain([0, 100]) },
									radius: { scale: () => scaleBand<string>().domain(radialNames).padding(0.2) },
									marks: [
										radialBarAngle(radialMetrics, {
											angle: 'value',
											radius: 'metric',
											color: 'metric',
											key: 'metric',
											cornerRadius: 'full',
										}),
									],
								}),
							],
							color: { domain: radialNames },
							theme: HLM_CHART_THEME,
						},
						{ tooltip: hlmChartTooltip() },
					),
					'Product metrics as concentric bars',
					'Concentric radial bar chart comparing five product metrics.',
				),
			},
			{
				title: 'Polar profile',
				description: 'An area and line profile across cyclic dimensions.',
				options: chartOptions(
					defineChart(
						{
							marks: [
								polar({
									radiusRatio: 0.72,
									angle: { scale: scalePoint<string>().domain(radialNames), wrap: true },
									radius: { scale: scaleLinear().domain([0, 100]) },
									marks: [
										radialArea(radialMetrics, {
											angle: 'metric',
											radius: 'value',
											fill: 'var(--chart-2)',
											fillOpacity: 0.22,
										}),
										radialLine(radialMetrics, {
											angle: 'metric',
											radius: 'value',
											stroke: 'var(--chart-2)',
											strokeWidth: 2.5,
											points: true,
										}),
									],
								}),
							],
							theme: HLM_CHART_THEME,
						},
						{ tooltip: hlmChartTooltip() },
					),
					'Product metric profile',
					'Polar area and line chart comparing five product metrics.',
				),
			},
			{
				title: 'Radial gauge',
				description: 'A compact completion metric with center text.',
				options: chartOptions(
					defineChart(
						{
							marks: [
								polar({
									radiusRatio: 0.76,
									angle: { scale: scaleLinear().domain([0, 1]) },
									radius: { scale: scaleLinear().domain([0, 1]) },
									marks: [
										radialArc(completionSlices, {
											innerRadius: ({ radius }) => radius * 0.72,
											cornerRadius: 999,
											color: 'status',
											key: 'status',
										}),
										radialText([completion[0]], {
											angle: 0,
											radius: 0,
											text: () => '72%',
											key: 'status',
											fill: 'currentColor',
											fontSize: 22,
											fontWeight: 700,
										}),
									],
								}),
							],
							color: {
								domain: ['Complete', 'Remaining'],
								range: ['var(--chart-1)', 'var(--muted)'],
							},
							theme: HLM_CHART_THEME,
						},
						{ tooltip: hlmChartTooltip() },
					),
					'Project completion',
					'Radial gauge showing 72 percent completion.',
				),
			},
		],
	},
] as const;
