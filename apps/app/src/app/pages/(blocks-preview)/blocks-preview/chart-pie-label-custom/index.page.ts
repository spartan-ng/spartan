import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, viewChild } from '@angular/core';
import { ArcElement, Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const datalabelPlugin = {
	id: 'datalabels',
	afterDatasetsDraw(chart: Chart) {
		const { ctx } = chart;
		(chart.getDatasetMeta(0).data as ArcElement[]).forEach((arc, i) => {
			const data = chart.data.datasets[0].data[i];
			ctx.save();
			ctx.fillStyle = '#fff';
			ctx.font = 'bold 12px sans-serif';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			const { x, y } = arc.tooltipPosition(false);
			ctx.fillText(`${data}`, x, y);
			ctx.restore();
		});
	},
};

@Component({
	selector: 'spartan-chart-pie-label-custom',
	encapsulation: ViewEncapsulation.None,
	host: { class: 'block p-6' },
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex flex-col gap-1.5">
			<h3 class="text-lg leading-none font-semibold tracking-tight">Pie Chart with Custom Labels</h3>
			<p class="text-muted-foreground text-sm">Browser market share with visitor counts</p>
		</div>
		<div class="mt-4">
			<canvas #chart class="w-full"></canvas>
		</div>
	`,
})
export default class ChartPieLabelCustomComponent implements AfterViewInit, OnDestroy {
	protected readonly _chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart');
	private _chartInstance: Chart | null = null;

	ngAfterViewInit(): void {
		const canvas = this._chartRef()?.nativeElement;
		if (!canvas) return;

		this._chartInstance = new Chart(canvas, {
			type: 'pie',
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
				plugins: {
					legend: { display: false },
				},
			},
			plugins: [datalabelPlugin],
		});
	}

	ngOnDestroy(): void {
		this._chartInstance?.destroy();
	}
}
