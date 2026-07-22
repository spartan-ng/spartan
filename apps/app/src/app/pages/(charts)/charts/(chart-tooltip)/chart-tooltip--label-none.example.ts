import { ChangeDetectionStrategy, Component } from '@angular/core';
import { type BarRadius, SpnBar, SpnBarChart, SpnTooltip, SpnTooltipContentDef, SpnXAxis } from '@spartan-ng/charts';

@Component({
	selector: 'spartan-tooltip-label-none',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full' },
	imports: [SpnBarChart, SpnXAxis, SpnBar, SpnTooltip, SpnTooltipContentDef],
	template: `
		<div class="w-full">
			<spn-bar-chart class="block h-[250px] w-full" [data]="data" [margin]="margin" defaultIndex="1">
				<spn-x-axis
					dataKey="date"
					axisLine="false"
					tickLine="false"
					tickSize="0"
					tickPadding="10"
					[tickFormatter]="formatDay"
					stroke="var(--muted-foreground)"
				/>
				<spn-bar dataKey="running" name="Running" fill="var(--chart-1)" [radius]="runningRadius" stackId="a" />
				<spn-bar dataKey="swimming" name="Swimming" fill="var(--chart-2)" [radius]="swimmingRadius" stackId="a" />
				<spn-tooltip>
					<ng-template spnTooltipContent let-state>
						<div
							class="bg-background border-border/50 grid min-w-[8rem] gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl"
						>
							@for (item of state.payload; track item.dataKey) {
								<div class="flex w-full items-center gap-2">
									<span class="text-muted-foreground">{{ item.name }}</span>
									<span class="text-foreground ml-auto font-mono font-medium tabular-nums">{{ item.value }}</span>
								</div>
							}
						</div>
					</ng-template>
				</spn-tooltip>
			</spn-bar-chart>
		</div>
	`,
})
export class TooltipLabelNone {
	protected readonly margin = { top: 12, right: 12, bottom: 24, left: 12 };
	protected readonly runningRadius: BarRadius = [0, 0, 4, 4];
	protected readonly swimmingRadius: BarRadius = [4, 4, 0, 0];
	protected readonly formatDay = (value: unknown): string =>
		new Date(String(value)).toLocaleDateString('en-US', { weekday: 'short' });
	protected readonly data = [
		{ date: '2024-07-15', running: 450, swimming: 300 },
		{ date: '2024-07-16', running: 380, swimming: 420 },
		{ date: '2024-07-17', running: 520, swimming: 120 },
		{ date: '2024-07-18', running: 140, swimming: 550 },
		{ date: '2024-07-19', running: 600, swimming: 350 },
		{ date: '2024-07-20', running: 480, swimming: 400 },
	];
}
