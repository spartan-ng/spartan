import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, viewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';

const insideLabelsPlugin = {
	id: 'insideLabels',
	afterDatasetsDraw(chart: Chart) {
		const { ctx } = chart;
		chart.data.datasets.forEach((dataset, i) => {
			const meta = chart.getDatasetMeta(i);
			meta.data.forEach((element, index) => {
				const value = dataset.data[index] as number;
				const barWidth = (element as any).width;
				const text = String(value);
				ctx.save();
				ctx.font = '12px sans-serif';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillStyle = '#fff';
				if (barWidth > 40) {
					ctx.fillText(text, (element as any).x - barWidth / 2 + 16, (element as any).y);
				}
				ctx.restore();
			});
		});
	},
};

@Component({
	selector: 'spartan-chart-bar-label-custom',
	encapsulation: ViewEncapsulation.None,
	host: { class: 'block p-6' },
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex flex-col gap-1.5">
			<h3 class="text-lg leading-none font-semibold tracking-tight">Bar Chart - Custom Label</h3>
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
export default class ChartBarLabelCustomComponent implements AfterViewInit, OnDestroy {
	protected readonly _chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart');
	private _chartInstance: Chart | null = null;

	ngAfterViewInit(): void {
		const canvas = this._chartRef()?.nativeElement;
		if (!canvas) return;
		this._chartInstance = new Chart(canvas, {
			plugins: [insideLabelsPlugin],
			type: 'bar',
			data: {
				labels: ['January', 'February', 'March', 'April', 'May', 'June'],
				datasets: [
					{
						label: 'Desktop',
						data: [186, 305, 237, 73, 209, 214],
						backgroundColor: 'hsl(12, 76%, 61%)',
						borderRadius: 4,
					},
					{
						label: 'Mobile',
						data: [80, 200, 120, 190, 130, 140],
						backgroundColor: 'hsl(173, 58%, 39%)',
						borderRadius: 4,
					},
				],
			},
			options: {
				indexAxis: 'y',
				responsive: true,
				maintainAspectRatio: true,
				plugins: { legend: { display: true, position: 'bottom' } },
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
