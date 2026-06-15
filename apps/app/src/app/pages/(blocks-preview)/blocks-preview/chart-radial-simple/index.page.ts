import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, viewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
	selector: 'spartan-chart-radial-simple',
	encapsulation: ViewEncapsulation.None,
	host: { class: 'block p-6' },
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex flex-col gap-1.5">
			<h3 class="text-lg leading-none font-semibold tracking-tight">Radial Chart</h3>
			<p class="text-muted-foreground text-sm">Browser market share</p>
		</div>
		<div class="mt-4">
			<canvas #chart class="w-full"></canvas>
		</div>
	`,
})
export default class ChartRadialSimpleComponent implements AfterViewInit, OnDestroy {
	protected readonly _chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart');
	private _chartInstance: Chart | null = null;

	ngAfterViewInit(): void {
		const canvas = this._chartRef()?.nativeElement;
		if (!canvas) return;

		this._chartInstance = new Chart(canvas, {
			type: 'polarArea',
			data: {
				labels: ['Chrome', 'Safari', 'Firefox', 'Edge', 'Other'],
				datasets: [
					{
						data: [275, 200, 187, 173, 90],
						backgroundColor: [
							'hsla(12, 76%, 61%, 0.7)',
							'hsla(173, 58%, 39%, 0.7)',
							'hsla(197, 37%, 24%, 0.7)',
							'hsla(43, 74%, 66%, 0.7)',
							'hsla(27, 87%, 67%, 0.7)',
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
