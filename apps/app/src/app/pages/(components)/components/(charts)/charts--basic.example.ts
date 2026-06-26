import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpnBar, SpnBarChart, SpnXAxis } from '@spartan-ng/charts';

@Component({
	selector: 'spartan-charts-basic',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full' },
	imports: [SpnBarChart, SpnBar, SpnXAxis],
	template: `
		<spn-bar-chart class="block h-[250px] w-full" [data]="data" [margin]="margin">
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
		</spn-bar-chart>
	`,
})
export class ChartsBasic {
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
