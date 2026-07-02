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
	selector: 'spartan-line-chart-dots-custom',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full' },
	imports: [SpnLineChart, SpnXAxis, SpnYAxis, SpnLine, SpnCartesianGrid, SpnTooltip, SpnTooltipContentDef],
	template: `
		<spn-line-chart class="block h-[250px] w-full" [data]="data" [margin]="margin">
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
			<spn-y-axis
				[domain]="yDomain"
				[tickFormatter]="emptyTick"
				axisLine="false"
				tickLine="false"
				tickSize="0"
				stroke="var(--muted-foreground)"
			/>
			<spn-line
				dataKey="desktop"
				name="Desktop"
				curve="natural"
				stroke="var(--chart-1)"
				strokeWidth="2"
				dot="true"
				[dotRenderer]="gitCommitDot"
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
export class LineChartDotsCustom {
	protected readonly margin = { top: 24, right: 12, bottom: 30, left: 12 };
	protected readonly yDomain = [0, 320] as [number, number];
	protected readonly formatMonth = (value: unknown): string => String(value).slice(0, 3);
	protected readonly emptyTick = (): string => '';

	// Draws a lucide "git-commit-vertical" glyph centred on each point.
	protected readonly gitCommitDot = (_context: LineDotContext): string =>
		`<g fill="none" stroke="var(--chart-1)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<line x1="0" y1="-9" x2="0" y2="-3"></line>
			<circle cx="0" cy="0" r="3" fill="var(--chart-1)"></circle>
			<line x1="0" y1="3" x2="0" y2="9"></line>
		</g>`;

	protected readonly data = [
		{ month: 'January', desktop: 186, mobile: 80 },
		{ month: 'February', desktop: 305, mobile: 200 },
		{ month: 'March', desktop: 237, mobile: 120 },
		{ month: 'April', desktop: 73, mobile: 190 },
		{ month: 'May', desktop: 209, mobile: 130 },
		{ month: 'June', desktop: 214, mobile: 140 },
	];
}
