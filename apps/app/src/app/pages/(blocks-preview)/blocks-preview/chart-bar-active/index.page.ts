import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, viewChild } from '@angular/core';
import { Chart } from 'chart.js';

const activeBarPlugin = {
	id: 'activeBar',
	afterDatasetsDraw(chart: Chart) {
		const { ctx } = chart;
		const meta = chart.getDatasetMeta(0);
		const activeIndex = 2;
		const element = meta.data[activeIndex] as any;
		if (!element) return;
		ctx.save();
		ctx.strokeStyle = 'hsl(12, 76%, 61%)';
		ctx.lineWidth = 2;
		ctx.setLineDash([4, 4]);
		const { x, y, width, base } = element;
		const isHorizontal = (chart.config.options as any)?.indexAxis === 'y';
		if (isHorizontal) {
			const left = Math.min(base, x) - 4;
			const top = y - width / 2 - 4;
			const barW = Math.abs(x - base) + 8;
			const barH = width + 8;
			ctx.strokeRect(left, top, barW, barH);
		} else {
			const barX = x - width / 2 - 4;
			const barY = Math.min(y, base);
			const barW = width + 8;
			const barH = Math.abs(base - y) + 8;
			ctx.strokeRect(barX, barY - 4, barW, barH);
		}
		ctx.restore();
	},
};

@Component({
	selector: 'spartan-chart-bar-active',
	encapsulation: ViewEncapsulation.None,
	host: { class: 'block p-6' },
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex flex-col gap-1.5">
			<h3 class="text-lg leading-none font-semibold tracking-tight">Bar Chart - Active</h3>
			<p class="text-muted-foreground text-sm">Showing visitors by browser</p>
		</div>
		<div class="mt-4">
			<canvas #chart class="w-full"></canvas>
		</div>
	`,
})
export default class ChartBarActiveComponent implements AfterViewInit, OnDestroy {
	protected readonly _chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart');
	private _chartInstance: Chart | null = null;

	ngAfterViewInit(): void {
		const canvas = this._chartRef()?.nativeElement;
		if (!canvas) return;

		const bgColors = [
			'hsl(12, 76%, 61%)',
			'hsl(12, 76%, 61%)',
			'hsl(173, 58%, 39%)',
			'hsl(12, 76%, 61%)',
			'hsl(12, 76%, 61%)',
		];

		this._chartInstance = new Chart(canvas, {
			plugins: [activeBarPlugin],
			type: 'bar',
			data: {
				labels: ['Chrome', 'Safari', 'Firefox', 'Edge', 'Other'],
				datasets: [
					{
						label: 'Visitors',
						data: [275, 200, 187, 173, 90],
						backgroundColor: bgColors,
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
