import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
	type RadarAxisLabelLine,
	SpnPolarGrid,
	SpnRadar,
	SpnRadarChart,
	SpnTooltip,
	SpnTooltipContentDef,
} from '@spartan-ng/charts';

interface RadarDatum {
	month: string;
	desktop: number;
	mobile: number;
}

@Component({
	selector: 'spartan-radar-chart-label-custom',
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
				[axisLabel]="customAxisLabel"
			>
				<spn-polar-grid stroke="var(--border)" />
				<spn-radar dataKey="desktop" name="Desktop" fill="var(--chart-1)" stroke="var(--chart-1)" fillOpacity="0.6" />
				<spn-radar dataKey="mobile" name="Mobile" fill="var(--chart-2)" stroke="var(--chart-2)" fillOpacity="1" />
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
export class RadarChartLabelCustom {
	protected readonly margin = { top: 10, right: 10, bottom: 10, left: 10 };
	protected readonly data: RadarDatum[] = [
		{ month: 'January', desktop: 186, mobile: 80 },
		{ month: 'February', desktop: 305, mobile: 200 },
		{ month: 'March', desktop: 237, mobile: 120 },
		{ month: 'April', desktop: 73, mobile: 190 },
		{ month: 'May', desktop: 209, mobile: 130 },
		{ month: 'June', desktop: 214, mobile: 140 },
	];

	protected readonly customAxisLabel = (datum: RadarDatum): RadarAxisLabelLine[] => [
		{ text: String(datum.desktop ?? '') },
		{ text: '/', muted: true },
		{ text: String(datum.mobile ?? '') },
		{ text: datum.month, muted: true, break: true },
	];
}
