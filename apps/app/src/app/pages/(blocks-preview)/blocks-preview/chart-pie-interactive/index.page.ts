import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, viewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
	selector: 'spartan-chart-pie-interactive',
	encapsulation: ViewEncapsulation.None,
	host: { class: 'block p-6' },
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex flex-col gap-1.5">
			<h3 class="text-lg leading-none font-semibold tracking-tight">Interactive Donut Chart</h3>
			<p class="text-muted-foreground text-sm">Click a segment to highlight it</p>
		</div>
		<div class="mt-4">
			<canvas #chart class="w-full"></canvas>
		</div>
	`,
})
export default class ChartPieInteractiveComponent implements AfterViewInit, OnDestroy {
	protected readonly _chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart');
	private readonly _chartInstance: Chart | null = null;

	ngAfterViewInit(): void {
		const canvas = this._chartRef()?.nativeElement;
		if (!canvas) return;

		const originalColors = [
			'hsl(12, 76%, 61%)',
			'hsl(173, 58%, 39%)',
			'hsl(197, 37%, 24%)',
			'hsl(43, 74%, 66%)',
			'hsl(27, 87%, 67%)',
		];
		const fadedColors = [
			'hsla(12, 76%, 61%, 0.3)',
			'hsla(173, 58%, 39%, 0.3)',
			'hsla(197, 37%, 24%, 0.3)',
			'hsla(43, 74%, 66%, 0.3)',
			'hsla(27, 87%, 67%, 0.3)',
		];
		let selectedIndex: number | null = null;

		this._chartInstance = new Chart(canvas, {
			type: 'doughnut',
			data: {
				labels: ['Chrome', 'Safari', 'Firefox', 'Edge', 'Other'],
				datasets: [
					{
						data: [275, 200, 187, 173, 90],
						backgroundColor: [...originalColors],
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
				onClick: (_event, elements) => {
					if (!this._chartInstance) return;
					const dataset = this._chartInstance.data.datasets[0];
					if (elements.length > 0) {
						const index = elements[0].index;
						if (selectedIndex === index) {
							dataset.backgroundColor = [...originalColors];
							selectedIndex = null;
						} else {
							dataset.backgroundColor = originalColors.map((c, i) => (i === index ? c : fadedColors[i]));
							selectedIndex = index;
						}
					} else {
						dataset.backgroundColor = [...originalColors];
						selectedIndex = null;
					}
					this._chartInstance.update();
				},
			},
		});
	}

	ngOnDestroy(): void {
		this._chartInstance?.destroy();
	}
}
