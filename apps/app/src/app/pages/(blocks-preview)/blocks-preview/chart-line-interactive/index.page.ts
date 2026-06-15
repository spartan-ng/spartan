import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, viewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
	selector: 'spartan-chart-line-interactive',
	encapsulation: ViewEncapsulation.None,
	host: { class: 'block p-6' },
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex flex-col gap-1.5">
			<h3 class="text-lg leading-none font-semibold tracking-tight">Interactive Line Chart</h3>
			<p class="text-muted-foreground text-sm">Showing desktop and mobile visitors for 90 days</p>
		</div>
		<div class="mt-4 flex gap-2">
			<button
				class="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
				[class]="
					_activeTab === 'desktop'
						? 'bg-primary text-primary-foreground shadow'
						: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground bg-transparent'
				"
				(click)="switchTab('desktop')"
			>
				Desktop
			</button>
			<button
				class="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
				[class]="
					_activeTab === 'mobile'
						? 'bg-primary text-primary-foreground shadow'
						: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground bg-transparent'
				"
				(click)="switchTab('mobile')"
			>
				Mobile
			</button>
			<button
				class="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
				[class]="
					_activeTab === 'all'
						? 'bg-primary text-primary-foreground shadow'
						: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground bg-transparent'
				"
				(click)="switchTab('all')"
			>
				All
			</button>
		</div>
		<div class="mt-4">
			<canvas #chart class="w-full"></canvas>
		</div>
		<div class="flex items-center gap-4 pt-4 text-sm">
			<div class="flex items-center gap-2">
				<span class="h-3 w-3 rounded-full" style="background: hsl(12, 76%, 61%)"></span>
				<span>Desktop</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="h-3 w-3 rounded-full" style="background: hsl(173, 58%, 39%)"></span>
				<span>Mobile</span>
			</div>
		</div>
	`,
})
export default class ChartLineInteractiveComponent implements AfterViewInit, OnDestroy {
	protected readonly _chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart');
	private _chartInstance: Chart | null = null;
	protected _activeTab: 'desktop' | 'mobile' | 'all' = 'all';

	private readonly _dates = this.generateDates();
	private readonly _desktopData = this.generateData(90, 50, 400);
	private readonly _mobileData = this.generateData(90, 50, 400);

	private generateDates(): string[] {
		const dates: string[] = [];
		const start = new Date(2024, 3, 1);
		for (let i = 0; i < 90; i++) {
			const d = new Date(start);
			d.setDate(d.getDate() + i);
			dates.push(d.toISOString().slice(0, 10));
		}
		return dates;
	}

	private generateData(count: number, min: number, max: number): number[] {
		const data: number[] = [];
		let prev = min + Math.random() * (max - min);
		for (let i = 0; i < count; i++) {
			prev = prev + (Math.random() - 0.5) * 60;
			prev = Math.max(min, Math.min(max, prev));
			data.push(Math.round(prev));
		}
		return data;
	}

	ngAfterViewInit(): void {
		const canvas = this._chartRef()?.nativeElement;
		if (!canvas) return;
		this._chartInstance = new Chart(canvas, {
			type: 'line',
			data: {
				labels: this._dates,
				datasets: [
					{
						label: 'Desktop',
						data: this._desktopData,
						borderColor: 'hsl(12, 76%, 61%)',
						backgroundColor: 'hsl(12, 76%, 61%)',
						tension: 0.4,
						pointRadius: 0,
					},
					{
						label: 'Mobile',
						data: this._mobileData,
						borderColor: 'hsl(173, 58%, 39%)',
						backgroundColor: 'hsl(173, 58%, 39%)',
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
					x: { grid: { display: false }, ticks: { maxRotation: 0, maxTicksLimit: 12 } },
					y: { grid: { display: false }, ticks: { maxRotation: 0 } },
				},
				interaction: { intersect: false, mode: 'index' },
			},
		});
	}

	switchTab(tab: 'desktop' | 'mobile' | 'all'): void {
		this._activeTab = tab;
		if (!this._chartInstance) return;
		const ds0 = this._chartInstance.data.datasets[0];
		const ds1 = this._chartInstance.data.datasets[1];
		if (tab === 'desktop') {
			ds0.hidden = false;
			ds1.hidden = true;
		} else if (tab === 'mobile') {
			ds0.hidden = true;
			ds1.hidden = false;
		} else {
			ds0.hidden = false;
			ds1.hidden = false;
		}
		this._chartInstance.update();
	}

	ngOnDestroy(): void {
		this._chartInstance?.destroy();
	}
}
