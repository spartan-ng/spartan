import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, viewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
	selector: 'spartan-chart-radial-stacked',
	encapsulation: ViewEncapsulation.None,
	host: { class: 'block p-6' },
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex flex-col gap-1.5">
			<h3 class="text-lg leading-none font-semibold tracking-tight">Stacked Radial Chart</h3>
			<p class="text-muted-foreground text-sm">Two concentric rings with corner radius</p>
		</div>
		<div class="mt-4">
			<canvas #chart class="w-full"></canvas>
		</div>
	`,
})
export default class ChartRadialStackedComponent implements AfterViewInit, OnDestroy {
	protected readonly _chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart');
	private _chartInstance: Chart | null = null;

	ngAfterViewInit(): void {
		const canvas = this._chartRef()?.nativeElement;
		if (!canvas) return;

		this._chartInstance = new Chart(canvas, {
			type: 'doughnut',
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
						borderRadius: 4,
					},
					{
						data: [150, 120, 100, 80, 50],
						backgroundColor: [
							'hsla(12, 76%, 61%, 0.5)',
							'hsla(173, 58%, 39%, 0.5)',
							'hsla(197, 37%, 24%, 0.5)',
							'hsla(43, 74%, 66%, 0.5)',
							'hsla(27, 87%, 67%, 0.5)',
						],
						borderWidth: 1,
						borderColor: '#fff',
						borderRadius: 4,
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
