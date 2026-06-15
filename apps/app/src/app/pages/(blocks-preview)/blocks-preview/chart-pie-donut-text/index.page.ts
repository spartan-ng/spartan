import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, viewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
	selector: 'spartan-chart-pie-donut-text',
	encapsulation: ViewEncapsulation.None,
	host: { class: 'block p-6' },
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex flex-col gap-1.5">
			<h3 class="text-lg leading-none font-semibold tracking-tight">Donut Chart with Text</h3>
			<p class="text-muted-foreground text-sm">Browser market share</p>
		</div>
		<div class="relative mt-4">
			<canvas #chart class="w-full"></canvas>
			<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
				<div class="text-center">
					<p class="text-3xl font-bold">925</p>
					<p class="text-muted-foreground text-sm">Total</p>
				</div>
			</div>
		</div>
	`,
})
export default class ChartPieDonutTextComponent implements AfterViewInit, OnDestroy {
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
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				cutout: '60%',
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
