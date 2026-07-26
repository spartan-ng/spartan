import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { SpnPie, SpnPieChart } from '@spartan-ng/charts';
import { HlmSelectImports } from '@spartan-ng/helm/select';

const MONTH_LABELS: Record<string, string> = {
	january: 'January',
	february: 'February',
	march: 'March',
	april: 'April',
	may: 'May',
};

@Component({
	selector: 'spartan-pie-chart-interactive',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full' },
	imports: [SpnPieChart, SpnPie, HlmSelectImports],
	template: `
		<div class="flex flex-col">
			<div class="flex justify-end px-1 pb-2">
				<hlm-select [(value)]="activeMonth" [itemToString]="monthLabel">
					<hlm-select-trigger class="h-7 w-[130px] rounded-lg text-xs">
						<hlm-select-value />
					</hlm-select-trigger>
					<hlm-select-content *hlmSelectPortal>
						<hlm-select-group>
							@for (item of data; track item.month) {
								<hlm-select-item [value]="item.month">{{ monthLabel(item.month) }}</hlm-select-item>
							}
						</hlm-select-group>
					</hlm-select-content>
				</hlm-select>
			</div>
			<div class="relative mx-auto block aspect-square h-[250px] w-[250px] max-w-full">
				<spn-pie-chart class="mx-auto block aspect-square h-[250px] w-[250px] max-w-full" [data]="data">
					<spn-pie
						dataKey="desktop"
						nameKey="month"
						[colors]="palette"
						innerRadius="60"
						outerRadius="80%"
						stroke="none"
						strokeWidth="0"
						[activeIndex]="activeIndex()"
						activeRing="true"
					/>
				</spn-pie-chart>
				<div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
					<span class="text-foreground text-3xl font-bold">{{ activeValue() }}</span>
					<span class="text-muted-foreground text-sm">Visitors</span>
				</div>
			</div>
		</div>
	`,
})
export class PieChartInteractive {
	protected readonly palette = [
		'var(--chart-1)',
		'var(--chart-2)',
		'var(--chart-3)',
		'var(--chart-4)',
		'var(--chart-5)',
	];
	protected readonly data = [
		{ month: 'january', desktop: 186, fill: 'var(--chart-1)' },
		{ month: 'february', desktop: 305, fill: 'var(--chart-2)' },
		{ month: 'march', desktop: 237, fill: 'var(--chart-3)' },
		{ month: 'april', desktop: 173, fill: 'var(--chart-4)' },
		{ month: 'may', desktop: 209, fill: 'var(--chart-5)' },
	];
	protected readonly activeMonth = signal('january');
	protected readonly activeIndex = computed(() => this.data.findIndex((d) => d.month === this.activeMonth()));
	protected readonly activeValue = computed(() => (this.data[this.activeIndex()]?.desktop ?? 0).toLocaleString());
	protected readonly monthLabel = (value: string): string => MONTH_LABELS[value] ?? value;
}
