import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, viewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
	selector: 'spartan-chart-radar-label-custom',
	encapsulation: ViewEncapsulation.None,
	host: { class: 'block p-6' },
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex flex-col gap-1.5">
			<h3 class="text-lg leading-none font-semibold tracking-tight">Radar Chart</h3>
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
export default class ChartRadarLabelCustomComponent implements AfterViewInit, OnDestroy {
	protected readonly _chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart');
	private readonly _chartInstance: Chart | null = null;

	ngAfterViewInit(): void {
		const canvas = this._chartRef()?.nativeElement;
		if (!canvas) return;
		this._chartInstance = new Chart(canvas, {
			type: 'radar',
			data: {
				labels: ['January', 'February', 'March', 'April', 'May', 'June'],
				datasets: [
					{
						label: 'Desktop',
						data: [186, 305, 237, 73, 209, 214],
						borderColor: 'hsl(12, 76%, 61%)',
						backgroundColor: 'hsla(12, 76%, 61%, 0.6)',
						fill: true,
					},
					{
						label: 'Mobile',
						data: [80, 200, 120, 190, 130, 140],
						borderColor: 'hsl(173, 58%, 39%)',
						backgroundColor: 'hsla(173, 58%, 39%, 0.6)',
						fill: true,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				plugins: {
					legend: { display: false },
				},
				scales: {
					r: {
						pointLabels: {
							font: { size: 12, weight: 'bold' as const },
							color: 'hsl(12, 76%, 61%)',
						},
					},
				},
			},
		});
	}

	ngOnDestroy(): void {
		this._chartInstance?.destroy();
	}
}
