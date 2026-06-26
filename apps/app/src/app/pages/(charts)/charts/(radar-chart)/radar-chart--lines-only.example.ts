import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpnPolarGrid, SpnRadar, SpnRadarChart, SpnTooltip, SpnTooltipContentDef } from '@spartan-ng/charts';

@Component({
	selector: 'spartan-radar-chart-lines-only',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full' },
	imports: [SpnRadarChart, SpnRadar, SpnPolarGrid, SpnTooltip, SpnTooltipContentDef],
	template: `
		<div class="relative mx-auto block aspect-square h-[250px] w-[250px] max-w-full">
			<spn-radar-chart
				class="mx-auto block aspect-square h-[250px] w-[250px] max-w-full"
				[data]="data"
				dataKey="month"
				[margin]="margin"
			>
				<spn-polar-grid stroke="var(--border)" radialLines="false" />
				<spn-radar
					dataKey="desktop"
					name="Desktop"
					fill="var(--chart-1)"
					stroke="var(--chart-1)"
					fillOpacity="0"
					strokeWidth="2"
				/>
				<spn-radar
					dataKey="mobile"
					name="Mobile"
					fill="var(--chart-2)"
					stroke="var(--chart-2)"
					fillOpacity="0"
					strokeWidth="2"
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
			</spn-radar-chart>
		</div>
	`,
})
export class RadarChartLinesOnly {
	protected readonly margin = { top: 5, right: 5, bottom: 5, left: 5 };
	protected readonly data = [
		{ month: 'January', desktop: 186, mobile: 160 },
		{ month: 'February', desktop: 185, mobile: 170 },
		{ month: 'March', desktop: 207, mobile: 180 },
		{ month: 'April', desktop: 173, mobile: 160 },
		{ month: 'May', desktop: 160, mobile: 190 },
		{ month: 'June', desktop: 174, mobile: 204 },
	];
}
