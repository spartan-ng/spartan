import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import {
	SpnCartesianGrid,
	SpnLine,
	SpnLineChart,
	SpnTooltip,
	SpnTooltipContentDef,
	SpnXAxis,
	SpnYAxis,
} from '@spartan-ng/charts';

const BROWSER_LABELS: Record<string, string> = {
	chrome: 'Chrome',
	safari: 'Safari',
	firefox: 'Firefox',
	edge: 'Edge',
	other: 'Other',
};
const CHART_HEIGHT = 250;

@Component({
	selector: 'spartan-line-chart-label-custom',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full' },
	imports: [SpnLineChart, SpnXAxis, SpnYAxis, SpnLine, SpnCartesianGrid, SpnTooltip, SpnTooltipContentDef],
	template: `
		<div class="relative h-[250px] w-full">
			<spn-line-chart class="block h-full w-full" [data]="data" [margin]="margin">
				<spn-cartesian-grid vertical="false" stroke="color-mix(in oklch, var(--border) 50%, transparent)" />
				<spn-x-axis
					dataKey="browser"
					axisLine="false"
					tickLine="false"
					tickSize="0"
					tickPadding="14"
					[tickFormatter]="emptyTick"
					stroke="var(--muted-foreground)"
				/>
				<spn-y-axis
					[domain]="yDomain"
					[tickFormatter]="emptyTick"
					axisLine="false"
					tickLine="false"
					tickSize="0"
					stroke="var(--muted-foreground)"
				/>
				<spn-line
					dataKey="visitors"
					name="Visitors"
					curve="natural"
					stroke="var(--chart-2)"
					strokeWidth="2"
					dot="true"
					dotSize="4"
					dotFill="var(--chart-2)"
					dotStroke="transparent"
					dotStrokeWidth="0"
					activeDot="true"
					activeDotSize="6"
					activeDotFill="var(--chart-2)"
					activeDotStroke="transparent"
					activeDotStrokeWidth="0"
					animationDuration="800"
				/>
				<spn-tooltip>
					<ng-template spnTooltipContent let-state>
						<div
							class="bg-background border-border/50 grid min-w-[8rem] gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl"
						>
							@if (state.label !== undefined && state.label !== null && state.label !== '') {
								<div class="font-medium">{{ state.label }}</div>
							}
							@for (item of state.payload; track item.dataKey) {
								<div class="flex w-full items-center gap-2">
									<span class="size-2.5 shrink-0 rounded-[2px]" [style.background]="item.color"></span>
									<span class="text-muted-foreground">{{ item.name }}</span>
									<span class="text-foreground ml-auto font-mono font-medium tabular-nums">{{ item.value }}</span>
								</div>
							}
						</div>
					</ng-template>
				</spn-tooltip>
			</spn-line-chart>
			<div class="pointer-events-none absolute inset-0">
				@for (point of labelPoints(); track point.key) {
					<span
						class="text-muted-foreground absolute -translate-x-1/2 text-xs"
						[style.left]="point.left"
						[style.top.px]="point.y"
					>
						{{ point.label }}
					</span>
				}
			</div>
		</div>
	`,
})
export class LineChartLabelCustom {
	protected readonly chartHeight = CHART_HEIGHT;
	protected readonly margin = { top: 24, right: 24, bottom: 12, left: 24 };
	protected readonly yDomain = [0, 280] as [number, number];
	protected readonly emptyTick = (): string => '';
	protected readonly data = [
		{ browser: 'chrome', visitors: 275, fill: 'var(--chart-1)' },
		{ browser: 'safari', visitors: 200, fill: 'var(--chart-2)' },
		{ browser: 'firefox', visitors: 187, fill: 'var(--chart-3)' },
		{ browser: 'edge', visitors: 173, fill: 'var(--chart-4)' },
		{ browser: 'other', visitors: 90, fill: 'var(--chart-5)' },
	];
	protected readonly labelPoints = computed(() => {
		const innerHeight = this.chartHeight - this.margin.top - this.margin.bottom;
		const [yMin, yMax] = this.yDomain;
		const gap = this.margin.left + this.margin.right;
		return this.data.map((point, index) => {
			const frac = index / Math.max(this.data.length - 1, 1);
			return {
				key: `${point.browser}-${index}`,
				label: BROWSER_LABELS[point.browser] ?? point.browser,
				// Pixel-accurate to the chart's fixed px margins, so text isn't distorted.
				left: `calc(${this.margin.left}px + ${frac} * (100% - ${gap}px))`,
				y: this.margin.top + ((yMax - point.visitors) / (yMax - yMin)) * innerHeight - 18,
			};
		});
	});
}
