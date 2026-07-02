import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, viewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';

const datalabelPlugin = {
	id: 'datalabels',
	afterDatasetsDraw(chart: Chart) {
		const { ctx } = chart;
		chart.data.datasets.forEach((dataset, datasetIndex) => {
			const meta = chart.getDatasetMeta(datasetIndex);
			if (meta.hidden) return;
			meta.data.forEach((element, index) => {
				const value = dataset.data[index];
				const label = chart.data.labels?.[index] ?? '';
				ctx.save();
				ctx.font = '11px sans-serif';
				ctx.fillStyle = 'hsl(0, 0%, 40%)';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'bottom';
				ctx.fillText(`${label}`, element.x, (element as any).y - 18);
				ctx.fillText(String(value), element.x, (element as any).y - 6);
				ctx.restore();
			});
		});
	},
};

@Component({
	selector: 'spartan-chart-line-label-custom',
	encapsulation: ViewEncapsulation.None,
	host: { class: 'block p-6' },
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex flex-col gap-1.5">
			<h3 class="text-lg leading-none font-semibold tracking-tight">Line Chart with Custom Labels</h3>
			<p class="text-muted-foreground text-sm">Browser usage by category</p>
		</div>
		<div class="mt-4">
			<canvas #chart class="w-full"></canvas>
		</div>
		<div class="flex flex-wrap items-center gap-4 pt-4 text-sm">
			<div class="flex items-center gap-2">
				<span class="h-3 w-3 rounded-full" style="background: hsl(12, 76%, 61%)"></span>
				<span>Chrome</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="h-3 w-3 rounded-full" style="background: hsl(173, 58%, 39%)"></span>
				<span>Safari</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="h-3 w-3 rounded-full" style="background: hsl(197, 37%, 24%)"></span>
				<span>Firefox</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="h-3 w-3 rounded-full" style="background: hsl(43, 74%, 66%)"></span>
				<span>Edge</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="h-3 w-3 rounded-full" style="background: hsl(27, 87%, 67%)"></span>
				<span>Other</span>
			</div>
		</div>
	`,
})
export default class ChartLineLabelCustomComponent implements AfterViewInit, OnDestroy {
	protected readonly _chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart');
	private _chartInstance: Chart | null = null;

	ngAfterViewInit(): void {
		const canvas = this._chartRef()?.nativeElement;
		if (!canvas) return;
		const colors = [
			'hsl(12, 76%, 61%)',
			'hsl(173, 58%, 39%)',
			'hsl(197, 37%, 24%)',
			'hsl(43, 74%, 66%)',
			'hsl(27, 87%, 67%)',
		];
		this._chartInstance = new Chart(canvas, {
			type: 'line',
			data: {
				labels: ['Chrome', 'Safari', 'Firefox', 'Edge', 'Other'],
				datasets: [
					{
						label: 'Visitors',
						data: [275, 200, 187, 173, 90],
						borderColor: 'hsl(12, 76%, 61%)',
						backgroundColor: 'hsl(12, 76%, 61%)',
						pointBackgroundColor: colors,
						pointBorderColor: colors,
						pointRadius: 5,
						pointHoverRadius: 7,
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
			plugins: [datalabelPlugin],
		});
	}

	ngOnDestroy(): void {
		this._chartInstance?.destroy();
	}
}
