import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpnPolarGrid, SpnRadar, SpnRadarChart, SpnTooltip, SpnTooltipContentDef } from '@spartan-ng/charts';

@Component({
	selector: 'spartan-radar-chart-grid-custom',
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
				<spn-polar-grid stroke="var(--border)" radialLines="false" [polarRadius]="polarRadius" />
				<spn-radar dataKey="desktop" name="Desktop" fill="var(--chart-1)" stroke="var(--chart-1)" fillOpacity="0.6" />
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
export class RadarChartGridCustom {
	protected readonly margin = { top: 5, right: 5, bottom: 5, left: 5 };
	protected readonly polarRadius = [90];
	protected readonly data = [
		{ month: 'January', desktop: 186 },
		{ month: 'February', desktop: 305 },
		{ month: 'March', desktop: 237 },
		{ month: 'April', desktop: 273 },
		{ month: 'May', desktop: 209 },
		{ month: 'June', desktop: 214 },
	];
}
