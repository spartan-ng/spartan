import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, viewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
	selector: 'spartan-chart-bar-mixed',
	encapsulation: ViewEncapsulation.None,
	host: { class: 'block p-6' },
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex flex-col gap-1.5">
			<h3 class="text-lg leading-none font-semibold tracking-tight">Bar Chart - Mixed Colors</h3>
			<p class="text-muted-foreground text-sm">Showing visitors by browser</p>
		</div>
		<div class="mt-4">
			<canvas #chart class="w-full"></canvas>
		</div>
	`,
})
export default class ChartBarMixedComponent implements AfterViewInit, OnDestroy {
	protected readonly _chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart');
	private _chartInstance: Chart | null = null;

	ngAfterViewInit(): void {
		const canvas = this._chartRef()?.nativeElement;
		if (!canvas) return;
		this._chartInstance = new Chart(canvas, {
			type: 'bar',
			data: {
				labels: ['Chrome', 'Safari', 'Firefox', 'Edge', 'Other'],
				datasets: [
					{
						label: 'Visitors',
						data: [275, 200, 187, 173, 90],
						backgroundColor: [
							'hsl(12, 76%, 61%)',
							'hsl(173, 58%, 39%)',
							'hsl(197, 37%, 24%)',
							'hsl(43, 74%, 66%)',
							'hsl(27, 87%, 67%)',
						],
						borderRadius: 5,
					},
				],
			},
			options: {
				indexAxis: 'y',
				responsive: true,
				maintainAspectRatio: true,
				plugins: { legend: { display: false } },
				scales: {
					x: { grid: { display: false }, border: { display: false } },
					y: { grid: { display: false }, border: { display: false } },
				},
			},
		});
	}

	ngOnDestroy(): void {
		this._chartInstance?.destroy();
	}
}
