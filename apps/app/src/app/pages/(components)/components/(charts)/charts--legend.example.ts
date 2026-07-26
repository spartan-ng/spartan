import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpnBar, SpnBarChart, SpnCartesianGrid, SpnTooltip, SpnTooltipContentDef, SpnXAxis } from '@spartan-ng/charts';

@Component({
	selector: 'spartan-charts-legend',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full' },
	imports: [SpnBarChart, SpnBar, SpnCartesianGrid, SpnXAxis, SpnTooltip, SpnTooltipContentDef],
	template: `
		<spn-bar-chart class="block h-[250px] w-full" [data]="data" [margin]="margin">
			<spn-cartesian-grid vertical="false" stroke="color-mix(in oklch, var(--border) 50%, transparent)" />
			<spn-x-axis
				dataKey="month"
				axisLine="false"
				tickLine="false"
				tickSize="0"
				tickPadding="10"
				[tickFormatter]="formatMonth"
				stroke="var(--muted-foreground)"
			/>
			<spn-bar dataKey="desktop" name="Desktop" fill="var(--chart-1)" radius="4" />
			<spn-bar dataKey="mobile" name="Mobile" fill="var(--chart-2)" radius="4" />
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
		</spn-bar-chart>
		<div class="flex items-center justify-center gap-4 pt-3">
			<div class="flex items-center gap-1.5">
				<span class="size-2 shrink-0 rounded-[2px] bg-[var(--chart-1)]"></span>
				<span class="text-foreground text-xs leading-none">Desktop</span>
			</div>
			<div class="flex items-center gap-1.5">
				<span class="size-2 shrink-0 rounded-[2px] bg-[var(--chart-2)]"></span>
				<span class="text-foreground text-xs leading-none">Mobile</span>
			</div>
		</div>
	`,
})
export class ChartsLegend {
	protected readonly margin = { top: 12, right: 12, bottom: 24, left: 12 };
	protected readonly formatMonth = (value: unknown): string => String(value).slice(0, 3);
	protected readonly data = [
		{ month: 'January', desktop: 186, mobile: 80 },
		{ month: 'February', desktop: 305, mobile: 200 },
		{ month: 'March', desktop: 237, mobile: 120 },
		{ month: 'April', desktop: 73, mobile: 190 },
		{ month: 'May', desktop: 209, mobile: 130 },
		{ month: 'June', desktop: 214, mobile: 140 },
	];
}
