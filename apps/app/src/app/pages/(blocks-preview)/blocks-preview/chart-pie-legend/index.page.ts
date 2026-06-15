import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, viewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
	selector: 'spartan-chart-pie-legend',
	encapsulation: ViewEncapsulation.None,
	host: { class: 'block p-6' },
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex flex-col gap-1.5">
			<h3 class="text-lg leading-none font-semibold tracking-tight">Pie Chart with Legend</h3>
			<p class="text-muted-foreground text-sm">Browser market share</p>
		</div>
		<div class="mt-4">
			<canvas #chart class="w-full"></canvas>
		</div>
		<div class="flex flex-wrap items-center gap-4 pt-4 text-sm">
			<div class="flex items-center gap-1.5">
				<span class="h-3 w-3 shrink-0 rounded-sm" style="background: hsl(12, 76%, 61%)"></span>
				<span class="text-muted-foreground">Chrome</span>
			</div>
			<div class="flex items-center gap-1.5">
				<span class="h-3 w-3 shrink-0 rounded-sm" style="background: hsl(173, 58%, 39%)"></span>
				<span class="text-muted-foreground">Safari</span>
			</div>
			<div class="flex items-center gap-1.5">
				<span class="h-3 w-3 shrink-0 rounded-sm" style="background: hsl(197, 37%, 24%)"></span>
				<span class="text-muted-foreground">Firefox</span>
			</div>
			<div class="flex items-center gap-1.5">
				<span class="h-3 w-3 shrink-0 rounded-sm" style="background: hsl(43, 74%, 66%)"></span>
				<span class="text-muted-foreground">Edge</span>
			</div>
			<div class="flex items-center gap-1.5">
				<span class="h-3 w-3 shrink-0 rounded-sm" style="background: hsl(27, 87%, 67%)"></span>
				<span class="text-muted-foreground">Other</span>
			</div>
		</div>
	`,
})
export default class ChartPieLegendComponent implements AfterViewInit, OnDestroy {
	protected readonly _chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart');
	private _chartInstance: Chart | null = null;

	ngAfterViewInit(): void {
		const canvas = this._chartRef()?.nativeElement;
		if (!canvas) return;

		this._chartInstance = new Chart(canvas, {
			type: 'pie',
			data: {
				labels: ['Chrome', 'Safari', 'Firefox', 'Edge', 'Other'],
				datasets: [
					{
						data: [275, 200, 187, 173, 90],
						backgroundColor: [
							'hsl(12, 76%, 61%)',
							'hsl(173, 58%, 39%)',
							'hsl(197, 37%, 24%)',
							'hsl(43, 74%, 66%)',
							'hsl(27, 87%, 67%)',
						],
						borderWidth: 1,
						borderColor: '#fff',
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				plugins: {
					legend: { display: false },
				},
			},
		});
	}

	ngOnDestroy(): void {
		this._chartInstance?.destroy();
	}
}
