import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, viewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { INTERACTIVE_CHART_DATA } from '../shared/chart/chart-data';
Chart.register(...registerables);

@Component({
	selector: 'spartan-chart-area-interactive',
	encapsulation: ViewEncapsulation.None,
	host: { class: 'block p-6' },
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex flex-col gap-1.5">
			<h3 class="text-lg leading-none font-semibold tracking-tight">Area Chart - Interactive</h3>
			<p class="text-muted-foreground text-sm">Showing daily visitors for the last 90 days</p>
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
export default class ChartAreaInteractiveComponent implements AfterViewInit, OnDestroy {
	protected readonly _chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart');
	private readonly _chartInstance: Chart | null = null;

	ngAfterViewInit(): void {
		const canvas = this._chartRef()?.nativeElement;
		if (!canvas) return;
		const labels = INTERACTIVE_CHART_DATA.map((d) => {
			const date = new Date(d.date);
			return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
		});
		this._chartInstance = new Chart(canvas, {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						label: 'Desktop',
						data: INTERACTIVE_CHART_DATA.map((d) => d.desktop),
						borderColor: 'hsl(12, 76%, 61%)',
						backgroundColor: 'hsla(12, 76%, 61%, 0.4)',
						fill: true,
						tension: 0.4,
						pointRadius: 0,
					},
					{
						label: 'Mobile',
						data: INTERACTIVE_CHART_DATA.map((d) => d.mobile),
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
					x: {
						grid: { display: false },
						ticks: { maxRotation: 0, maxTicksLimit: 10 },
					},
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
