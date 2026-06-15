import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, viewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
	selector: 'spartan-chart-line-dots',
	encapsulation: ViewEncapsulation.None,
	host: { class: 'block p-6' },
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex flex-col gap-1.5">
			<h3 class="text-lg leading-none font-semibold tracking-tight">Line Chart with Dots</h3>
			<p class="text-muted-foreground text-sm">Showing desktop and mobile visitors</p>
		</div>
		<div class="mt-4">
			<canvas #chart class="w-full"></canvas>
		</div>
		<div class="flex items-center gap-4 pt-4 text-sm">
			<div class="flex items-center gap-2">
				<span class="h-3 w-3 rounded-full" style="background: hsl(12, 76%, 61%)"></span>
				<span>Desktop</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="h-3 w-3 rounded-full" style="background: hsl(173, 58%, 39%)"></span>
				<span>Mobile</span>
			</div>
		</div>
	`,
})
export default class ChartLineDotsComponent implements AfterViewInit, OnDestroy {
	protected readonly _chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart');
	private readonly _chartInstance: Chart | null = null;

	ngAfterViewInit(): void {
		const canvas = this._chartRef()?.nativeElement;
		if (!canvas) return;
		this._chartInstance = new Chart(canvas, {
			type: 'line',
			data: {
				labels: ['January', 'February', 'March', 'April', 'May', 'June'],
				datasets: [
					{
						label: 'Desktop',
						data: [186, 305, 237, 73, 209, 214],
						borderColor: 'hsl(12, 76%, 61%)',
						backgroundColor: 'hsl(12, 76%, 61%)',
						pointRadius: 4,
						pointHoverRadius: 6,
						tension: 0.4,
					},
					{
						label: 'Mobile',
						data: [80, 200, 120, 190, 130, 140],
						borderColor: 'hsl(173, 58%, 39%)',
						backgroundColor: 'hsl(173, 58%, 39%)',
						pointRadius: 4,
						pointHoverRadius: 6,
						tension: 0.4,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				plugins: { legend: { display: false } },
				scales: {
					x: { grid: { display: false }, ticks: { maxRotation: 0 } },
					y: { grid: { display: false }, ticks: { maxRotation: 0 } },
				},
			},
		});
	}

	ngOnDestroy(): void {
		this._chartInstance?.destroy();
	}
}
