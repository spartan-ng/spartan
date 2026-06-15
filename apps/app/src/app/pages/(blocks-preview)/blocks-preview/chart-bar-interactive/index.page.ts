import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, viewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { INTERACTIVE_CHART_DATA } from '../shared/chart/chart-data';

@Component({
	selector: 'spartan-chart-bar-interactive',
	encapsulation: ViewEncapsulation.None,
	host: { class: 'block p-6' },
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex flex-col gap-1.5">
			<h3 class="text-lg leading-none font-semibold tracking-tight">Interactive Bar Chart</h3>
			<p class="text-muted-foreground text-sm">Showing total visitors for the last 90 days</p>
		</div>
		<div class="mt-4 flex gap-2">
			<button
				class="inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors"
				[class]="
					_activeTab === 'desktop'
						? 'bg-primary text-primary-foreground'
						: 'bg-muted text-muted-foreground hover:bg-muted/80'
				"
				(click)="switchTab('desktop')"
			>
				Desktop
			</button>
			<button
				class="inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors"
				[class]="
					_activeTab === 'mobile'
						? 'bg-primary text-primary-foreground'
						: 'bg-muted text-muted-foreground hover:bg-muted/80'
				"
				(click)="switchTab('mobile')"
			>
				Mobile
			</button>
		</div>
		<div class="mt-4">
			<canvas #chart class="w-full"></canvas>
		</div>
	`,
})
export default class ChartBarInteractiveComponent implements AfterViewInit, OnDestroy {
	protected readonly _chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart');
	private _chartInstance: Chart | null = null;
	protected _activeTab: 'desktop' | 'mobile' = 'desktop';

	ngAfterViewInit(): void {
		this.renderChart();
	}

	switchTab(tab: 'desktop' | 'mobile'): void {
		this._activeTab = tab;
		this.renderChart();
	}

	private renderChart(): void {
		if (this._chartInstance) {
			this._chartInstance.destroy();
		}
		const canvas = this._chartRef()?.nativeElement;
		if (!canvas) return;

		const labels = INTERACTIVE_CHART_DATA.map((d) => {
			const date = new Date(d.date);
			return `${date.getMonth() + 1}/${date.getDate()}`;
		});
		const data = INTERACTIVE_CHART_DATA.map((d) => (this._activeTab === 'desktop' ? d.desktop : d.mobile));
		const color = this._activeTab === 'desktop' ? 'hsl(12, 76%, 61%)' : 'hsl(173, 58%, 39%)';

		this._chartInstance = new Chart(canvas, {
			type: 'bar',
			data: {
				labels,
				datasets: [
					{
						label: this._activeTab === 'desktop' ? 'Desktop' : 'Mobile',
						data,
						backgroundColor: color,
						borderRadius: 2,
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
						ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 15, font: { size: 10 } },
					},
					y: { grid: { display: false }, border: { display: false } },
				},
			},
		});
	}

	ngOnDestroy(): void {
		this._chartInstance?.destroy();
	}
}
