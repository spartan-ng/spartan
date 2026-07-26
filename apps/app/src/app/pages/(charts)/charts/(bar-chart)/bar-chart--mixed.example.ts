import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpnBar, SpnBarChart, SpnTooltip, SpnTooltipContentDef, SpnYAxis } from '@spartan-ng/charts';

const BROWSER_LABELS: Record<string, string> = {
	chrome: 'Chrome',
	safari: 'Safari',
	firefox: 'Firefox',
	edge: 'Edge',
	other: 'Other',
};

@Component({
	selector: 'spartan-bar-chart-mixed',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full' },
	imports: [SpnBarChart, SpnYAxis, SpnBar, SpnTooltip, SpnTooltipContentDef],
	template: `
		<spn-bar-chart class="block h-[250px] w-full" [data]="data" [margin]="margin" layout="horizontal">
			<spn-y-axis
				dataKey="browser"
				axisLine="false"
				tickLine="false"
				tickSize="0"
				tickPadding="10"
				[tickFormatter]="formatBrowser"
				stroke="var(--muted-foreground)"
			/>
			<spn-bar dataKey="visitors" name="Visitors" fill="var(--chart-1)" radius="5" />
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
export class BarChartMixed {
	protected readonly margin = { top: 12, right: 12, bottom: 12, left: 60 };
	protected readonly formatBrowser = (value: unknown): string => BROWSER_LABELS[String(value)] ?? String(value);
	protected readonly data = [
		{ browser: 'chrome', visitors: 275, fill: 'var(--chart-1)' },
		{ browser: 'safari', visitors: 200, fill: 'var(--chart-2)' },
		{ browser: 'firefox', visitors: 187, fill: 'var(--chart-3)' },
		{ browser: 'edge', visitors: 173, fill: 'var(--chart-4)' },
		{ browser: 'other', visitors: 90, fill: 'var(--chart-5)' },
	];
}
