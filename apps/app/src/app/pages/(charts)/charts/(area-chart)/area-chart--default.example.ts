import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
	SpnArea,
	SpnAreaChart,
	SpnCartesianGrid,
	SpnTooltip,
	SpnTooltipContentDef,
	SpnXAxis,
} from '@spartan-ng/charts';

@Component({
	selector: 'spartan-area-chart-default',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full' },
	imports: [SpnAreaChart, SpnXAxis, SpnArea, SpnCartesianGrid, SpnTooltip, SpnTooltipContentDef],
	template: `
		<spn-area-chart class="block h-[250px] w-full" [data]="data" [margin]="margin">
			<spn-cartesian-grid vertical="false" stroke="color-mix(in oklch, var(--border) 50%, transparent)" />
			<spn-x-axis
				dataKey="month"
				axisLine="false"
				tickLine="false"
				tickSize="0"
				tickPadding="14"
				[tickFormatter]="formatMonth"
				stroke="var(--muted-foreground)"
			/>
			<spn-area
				dataKey="desktop"
				name="Desktop"
				curve="natural"
				fill="var(--chart-1)"
				fillOpacity="0.4"
				stroke="var(--chart-1)"
				strokeWidth="1"
				animationDuration="1500"
				dot
				dotSize="0"
				activeDot="true"
				activeDotSize="4"
				activeDotFill="var(--chart-1)"
				activeDotStroke="transparent"
				activeDotStrokeWidth="0"
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
		</spn-area-chart>
	`,
})
export class AreaChartDefault {
	protected readonly margin = { top: 12, right: 12, bottom: 30, left: 12 };
	protected readonly formatMonth = (value: unknown): string => String(value).slice(0, 3);
	protected readonly data = [
		{ month: 'January', desktop: 186, mobile: 80, other: 45 },
		{ month: 'February', desktop: 305, mobile: 200, other: 100 },
		{ month: 'March', desktop: 237, mobile: 120, other: 150 },
		{ month: 'April', desktop: 73, mobile: 190, other: 50 },
		{ month: 'May', desktop: 209, mobile: 130, other: 100 },
		{ month: 'June', desktop: 214, mobile: 140, other: 160 },
	];
}
