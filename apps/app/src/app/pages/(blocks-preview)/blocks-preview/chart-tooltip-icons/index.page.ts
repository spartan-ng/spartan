import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, viewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
	selector: 'spartan-chart-tooltip-icons',
	encapsulation: ViewEncapsulation.None,
	host: { class: 'block p-6' },
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex flex-col gap-1.5">
			<h3 class="text-lg leading-none font-semibold tracking-tight">Tooltip with Icons</h3>
			<p class="text-muted-foreground text-sm">Custom HTML tooltip showing colored icons</p>
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
export default class ChartTooltipIconsComponent implements AfterViewInit, OnDestroy {
	protected readonly _chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart');
	private _chartInstance: Chart | null = null;

	ngAfterViewInit(): void {
		const canvas = this._chartRef()?.nativeElement;
		if (!canvas) return;

		const getOrCreateTooltip = (chart: Chart) => {
			let tooltipEl = chart.canvas.parentNode?.querySelector('div.chartjs-tooltip') as HTMLElement;
			if (!tooltipEl) {
				tooltipEl = document.createElement('div');
				tooltipEl.className = 'chartjs-tooltip';
				tooltipEl.style.position = 'absolute';
				tooltipEl.style.pointerEvents = 'none';
				tooltipEl.style.transition = 'all 0.15s ease';
				tooltipEl.style.background = 'hsl(0, 0%, 100%)';
				tooltipEl.style.border = '1px solid hsl(0, 0%, 90%)';
				tooltipEl.style.borderRadius = '8px';
				tooltipEl.style.padding = '10px 14px';
				tooltipEl.style.fontSize = '12px';
				tooltipEl.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
				chart.canvas.parentNode?.appendChild(tooltipEl);
			}
			return tooltipEl;
		};

		const iconColors: Record<string, string> = {
			Running: 'hsl(12, 76%, 61%)',
			Swimming: 'hsl(173, 58%, 39%)',
		};

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
						enabled: false,
						external: (context) => {
							const tooltipModel = context.tooltip;
							const tooltipEl = getOrCreateTooltip(context.chart);
							if (tooltipModel.opacity === 0) {
								tooltipEl.style.opacity = '0';
								return;
							}
							if (tooltipModel.body) {
								tooltipEl.textContent = '';
								const titleLines = tooltipModel.title || [];
								const bodyItems = tooltipModel.body.map((b) => b.lines);
								if (titleLines.length > 0) {
									const titleDiv = document.createElement('div');
									titleDiv.style.fontWeight = '600';
									titleDiv.style.marginBottom = '4px';
									titleDiv.textContent = titleLines[0];
									tooltipEl.appendChild(titleDiv);
								}
								bodyItems.forEach((lines) => {
									lines.forEach((line) => {
										const label = line.split(':')[0].trim();
										const color = iconColors[label] || '#888';
										const rowDiv = document.createElement('div');
										rowDiv.style.display = 'flex';
										rowDiv.style.alignItems = 'center';
										rowDiv.style.gap = '6px';
										rowDiv.style.margin = '2px 0';
										const dotSpan = document.createElement('span');
										dotSpan.style.width = '8px';
										dotSpan.style.height = '8px';
										dotSpan.style.borderRadius = '50%';
										dotSpan.style.background = color;
										dotSpan.style.display = 'inline-block';
										rowDiv.appendChild(dotSpan);
										const textSpan = document.createElement('span');
										textSpan.textContent = line;
										rowDiv.appendChild(textSpan);
										tooltipEl.appendChild(rowDiv);
									});
								});
							}
							tooltipEl.style.left = tooltipModel.caretX + 'px';
							tooltipEl.style.top = tooltipModel.caretY - 10 + 'px';
							tooltipEl.style.opacity = '1';
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
