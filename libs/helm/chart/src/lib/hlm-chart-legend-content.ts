import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'hlm-chart-legend-content, [hlmChartLegendContent]',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			class="flex items-center justify-center gap-4"
			[class.pb-3]="verticalAlign() === 'top'"
			[class.pt-3]="verticalAlign() !== 'top'"
		>
			@for (item of items(); track $index) {
				<div class="flex items-center gap-1.5">
					@if (!hideIcon()) {
						<div class="h-2 w-2 shrink-0 rounded-[2px]" [style.backgroundColor]="item.color"></div>
					}
					<span>{{ item.label }}</span>
				</div>
			}
		</div>
	`,
})
export class HlmChartLegendContent {
	public readonly items = input<Array<{ label: string; color: string }>>([]);
	public readonly verticalAlign = input<'top' | 'bottom'>('bottom');
	public readonly hideIcon = input<boolean>(false);
}
