import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
	type BarLabelConfig,
	SpnBar,
	SpnBarChart,
	SpnTooltip,
	SpnTooltipContentDef,
	SpnYAxis,
} from '@spartan-ng/charts';

@Component({
	selector: 'spartan-bar-chart-label-custom',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full' },
	imports: [SpnBarChart, SpnYAxis, SpnBar, SpnTooltip, SpnTooltipContentDef],
	template: `
		<spn-bar-chart class="block h-[250px] w-full" [data]="data" [margin]="margin" layout="horizontal">
			<spn-y-axis
				dataKey="month"
				axisLine="false"
				tickLine="false"
				tickSize="0"
				tickPadding="10"
				[tickFormatter]="emptyFormatter"
				stroke="var(--muted-foreground)"
			/>
			<spn-bar dataKey="desktop" name="Desktop" fill="var(--chart-2)" radius="4" [label]="labels" />
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
export class BarChartLabelCustom {
	protected readonly margin = { top: 12, right: 28, bottom: 12, left: 6 };
	protected readonly emptyFormatter = (): string => '';
	protected readonly labels: BarLabelConfig[] = [
		{ dataKey: 'month', position: 'insideLeft', offset: 8, fontSize: 12, fill: 'var(--background)' },
		{ dataKey: 'desktop', position: 'right', offset: 8, fontSize: 12, fill: 'var(--foreground)' },
	];
	protected readonly data = [
		{ month: 'January', desktop: 186, mobile: 80 },
		{ month: 'February', desktop: 305, mobile: 200 },
		{ month: 'March', desktop: 237, mobile: 120 },
		{ month: 'April', desktop: 73, mobile: 190 },
		{ month: 'May', desktop: 209, mobile: 130 },
		{ month: 'June', desktop: 214, mobile: 140 },
	];
}
