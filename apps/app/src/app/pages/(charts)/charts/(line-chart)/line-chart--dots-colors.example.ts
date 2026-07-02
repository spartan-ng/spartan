import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
	LineDotContext,
	SpnCartesianGrid,
	SpnLine,
	SpnLineChart,
	SpnTooltip,
	SpnTooltipContentDef,
	SpnXAxis,
	SpnYAxis,
} from '@spartan-ng/charts';

@Component({
	selector: 'spartan-line-chart-dots-colors',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full' },
	imports: [SpnLineChart, SpnXAxis, SpnYAxis, SpnLine, SpnCartesianGrid, SpnTooltip, SpnTooltipContentDef],
	template: `
		<spn-line-chart class="block h-[250px] w-full" [data]="data" [margin]="margin">
			<spn-cartesian-grid vertical="false" stroke="color-mix(in oklch, var(--border) 50%, transparent)" />
			<spn-x-axis
				dataKey="browser"
				axisLine="false"
				tickLine="false"
				tickSize="0"
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
				[dotRenderer]="coloredDot"
				activeDot="false"
				animationDuration="800"
			/>
			<spn-tooltip>
				<ng-template spnTooltipContent let-state>
					<div
						class="bg-background border-border/50 grid min-w-[8rem] gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl"
					>
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
	`,
})
export class LineChartDotsColors {
	protected readonly margin = { top: 24, right: 24, bottom: 24, left: 24 };
	protected readonly yDomain = [0, 320] as [number, number];
	protected readonly emptyTick = (): string => '';

	// Colour each dot from the datum's own `fill` field.
	protected readonly coloredDot = (context: LineDotContext): string => {
		const fill = String(context.payload['fill'] ?? 'var(--chart-2)');
		return `<circle cx="0" cy="0" r="5" fill="${fill}" stroke="${fill}"></circle>`;
	};

	protected readonly data = [
		{ browser: 'chrome', visitors: 275, fill: 'var(--chart-1)' },
		{ browser: 'safari', visitors: 200, fill: 'var(--chart-2)' },
		{ browser: 'firefox', visitors: 187, fill: 'var(--chart-3)' },
		{ browser: 'edge', visitors: 173, fill: 'var(--chart-4)' },
		{ browser: 'other', visitors: 90, fill: 'var(--chart-5)' },
	];
}
