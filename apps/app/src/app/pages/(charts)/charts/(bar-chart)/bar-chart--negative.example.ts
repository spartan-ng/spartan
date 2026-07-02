import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
	type BarLabelConfig,
	SpnBar,
	SpnBarChart,
	SpnCartesianGrid,
	SpnTooltip,
	SpnTooltipContentDef,
	SpnXAxis,
} from '@spartan-ng/charts';

const POS = 'var(--chart-1)';
const NEG = 'var(--chart-2)';

@Component({
	selector: 'spartan-bar-chart-negative',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full' },
	imports: [SpnBarChart, SpnXAxis, SpnBar, SpnCartesianGrid, SpnTooltip, SpnTooltipContentDef],
	template: `
		<spn-bar-chart class="block h-[250px] w-full" [data]="data" [margin]="margin">
			<spn-cartesian-grid vertical="false" stroke="color-mix(in oklch, var(--border) 50%, transparent)" />
			<spn-x-axis
				dataKey="month"
				axisLine="false"
				tickLine="false"
				tickSize="0"
				tickPadding="10"
				[tickFormatter]="emptyFormatter"
				stroke="var(--muted-foreground)"
			/>
			<spn-bar dataKey="visitors" name="Visitors" fill="var(--chart-1)" radius="4" [label]="label" />
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
	`,
})
export class BarChartNegative {
	protected readonly margin = { top: 24, right: 12, bottom: 24, left: 12 };
	protected readonly label: BarLabelConfig = { dataKey: 'month', offset: 8, fontSize: 12 };
	protected readonly emptyFormatter = (): string => '';
	protected readonly data = [
		{ month: 'January', visitors: 186, fill: POS },
		{ month: 'February', visitors: 205, fill: POS },
		{ month: 'March', visitors: -207, fill: NEG },
		{ month: 'April', visitors: 173, fill: POS },
		{ month: 'May', visitors: -209, fill: NEG },
		{ month: 'June', visitors: 214, fill: POS },
	];
}
