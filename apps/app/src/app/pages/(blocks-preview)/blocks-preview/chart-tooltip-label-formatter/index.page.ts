import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, viewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
	selector: 'spartan-chart-tooltip-label-formatter',
	encapsulation: ViewEncapsulation.None,
	host: { class: 'block p-6' },
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex flex-col gap-1.5">
			<h3 class="text-lg leading-none font-semibold tracking-tight">Formatted Date Label Tooltip</h3>
			<p class="text-muted-foreground text-sm">Tooltip with formatted date labels</p>
		</div>
		<div class="mt-4">
			<canvas #chart class="w-full"></canvas>
		</div>
		<div class="flex items-center gap-4 pt-4 text-sm">
			<div class="flex items-center gap-1.5">
				<span class="h-3 w-3 shrink-0 rounded-sm" style="background: hsl(12, 76%, 61%)"></span>
				<span class="text-muted-foreground">Running</span>
			</div>
			<div class="flex items-center gap-1.5">
				<span class="h-3 w-3 shrink-0 rounded-sm" style="background: hsl(173, 58%, 39%)"></span>
				<span class="text-muted-foreground">Swimming</span>
			</div>
		</div>
	`,
})
export default class ChartTooltipLabelFormatterComponent implements AfterViewInit, OnDestroy {
	protected readonly _chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart');
	private _chartInstance: Chart | null = null;

	ngAfterViewInit(): void {
		const canvas = this._chartRef()?.nativeElement;
		if (!canvas) return;

		const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		this._chartInstance = new Chart(canvas, {
			type: 'bar',
			data: {
				labels: ['2024-07-15', '2024-07-16', '2024-07-17', '2024-07-18', '2024-07-19', '2024-07-20'],
				datasets: [
					{
						label: 'Running',
						data: [450, 380, 520, 140, 600, 480],
						backgroundColor: 'hsl(12, 76%, 61%)',
					},
					{
						label: 'Swimming',
						data: [300, 420, 120, 550, 350, 400],
						backgroundColor: 'hsl(173, 58%, 39%)',
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				plugins: {
					legend: { display: false },
					tooltip: {
						mode: 'index',
						intersect: false,
						callbacks: {
							title: (items) => {
								const dateStr = items[0].label;
								const date = new Date(dateStr + 'T00:00:00');
								const dayName = dayNames[date.getDay()];
								const monthName = monthNames[date.getMonth()];
								const day = date.getDate();
								return `${dayName}, ${monthName} ${day}`;
							},
						},
					},
				},
				scales: {
					x: {
						stacked: true,
						grid: { display: false },
						ticks: { maxRotation: 0 },
					},
					y: {
						stacked: true,
						grid: { color: 'hsl(0, 0%, 90%)' },
					},
				},
				interaction: { intersect: false, mode: 'index' },
			},
		});
	}

	ngOnDestroy(): void {
		this._chartInstance?.destroy();
	}
}
