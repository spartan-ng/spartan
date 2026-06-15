import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, viewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
	selector: 'spartan-chart-bar-stacked',
	encapsulation: ViewEncapsulation.None,
	host: { class: 'block p-6' },
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex flex-col gap-1.5">
			<h3 class="text-lg leading-none font-semibold tracking-tight">Bar Chart - Stacked</h3>
			<p class="text-muted-foreground text-sm">Showing total visitors for the last 6 months</p>
		</div>
		<div class="mt-4">
			<canvas #chart class="w-full"></canvas>
		</div>
		<div class="flex items-start gap-2 pt-4 text-sm">
			<div class="grid gap-2">
				<div class="flex items-center gap-2 leading-none font-medium">Trending up by 5.2% this month</div>
				<div class="text-muted-foreground text-xs">January - June 2024</div>
			</div>
		</div>
	`,
})
export default class ChartBarStackedComponent implements AfterViewInit, OnDestroy {
	protected readonly _chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart');
	private readonly _chartInstance: Chart | null = null;

	ngAfterViewInit(): void {
		const canvas = this._chartRef()?.nativeElement;
		if (!canvas) return;
		this._chartInstance = new Chart(canvas, {
			type: 'bar',
			data: {
				labels: ['January', 'February', 'March', 'April', 'May', 'June'],
				datasets: [
					{
						label: 'Desktop',
						data: [186, 305, 237, 73, 209, 214],
						backgroundColor: 'hsl(12, 76%, 61%)',
						borderRadius: 4,
						stack: 'a',
					},
					{
						label: 'Mobile',
						data: [80, 200, 120, 190, 130, 140],
						backgroundColor: 'hsl(173, 58%, 39%)',
						borderRadius: 4,
						stack: 'a',
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				plugins: { legend: { display: true, position: 'bottom' } },
				scales: {
					x: { stacked: true, grid: { display: false }, ticks: { maxRotation: 0 } },
					y: { stacked: true, grid: { display: false }, border: { display: false } },
				},
			},
		});
	}

	ngOnDestroy(): void {
		this._chartInstance?.destroy();
	}
}
