import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, viewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
	selector: 'spartan-chart-area-stacked',
	encapsulation: ViewEncapsulation.None,
	host: { class: 'block p-6' },
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex flex-col gap-1.5">
			<h3 class="text-lg leading-none font-semibold tracking-tight">Area Chart</h3>
			<p class="text-muted-foreground text-sm">Showing total visitors for the last 6 months</p>
		</div>
		<div class="mt-4">
			<canvas #chart class="w-full"></canvas>
		</div>
		<div class="flex items-center gap-4 pt-4 text-sm">
			<div class="flex items-center gap-1.5">
				<span class="h-3 w-3 shrink-0 rounded-sm" style="background: hsl(12, 76%, 61%)"></span>
				<span class="text-muted-foreground">Desktop</span>
			</div>
			<div class="flex items-center gap-1.5">
				<span class="h-3 w-3 shrink-0 rounded-sm" style="background: hsl(173, 58%, 39%)"></span>
				<span class="text-muted-foreground">Mobile</span>
			</div>
		</div>
	`,
})
export default class ChartAreaStackedComponent implements AfterViewInit, OnDestroy {
	protected readonly _chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart');
	private _chartInstance: Chart | null = null;

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
						backgroundColor: 'hsla(12, 76%, 61%, 0.4)',
						fill: true,
						tension: 0.4,
						pointRadius: 0,
					},
					{
						label: 'Mobile',
						data: [80, 200, 120, 190, 130, 140],
						borderColor: 'hsl(173, 58%, 39%)',
						backgroundColor: 'hsla(173, 58%, 39%, 0.4)',
						fill: true,
						tension: 0.4,
						pointRadius: 0,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				plugins: { legend: { display: false } },
				scales: {
					x: { grid: { display: false }, ticks: { maxRotation: 0 } },
					y: { display: false },
				},
				interaction: { intersect: false, mode: 'index' },
			},
		});
	}

	ngOnDestroy(): void {
		this._chartInstance?.destroy();
	}
}
