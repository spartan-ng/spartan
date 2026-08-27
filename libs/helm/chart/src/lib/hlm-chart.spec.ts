import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { barY, defineChart } from '@tanstack/charts';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { tooltip } from '@tanstack/charts/tooltip';
import { HlmChartImports } from '..';
import { HLM_CHART_THEME } from './hlm-chart-theme';
import { hlmChartTooltip } from './hlm-chart-tooltip';

interface Revenue {
	month: string;
	revenue: number;
}

const rows: Revenue[] = [
	{ month: 'Jan', revenue: 42 },
	{ month: 'Feb', revenue: 58 },
	{ month: 'Mar', revenue: 51 },
];

@Component({
	imports: [HlmChartImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<tanstack-chart hlmChart [options]="_chartOptions" />
	`,
})
class ChartHost {
	protected readonly _chartOptions = {
		definition: defineChart(
			{
				marks: [barY(rows, { x: 'month', y: 'revenue' })],
				scales: {
					x: { scale: () => scaleBand<string>().padding(0.16) },
					y: { scale: scaleLinear, grid: true },
				},
				theme: HLM_CHART_THEME,
			},
			{ tooltip: hlmChartTooltip<Revenue, string, number>() },
		),
		ariaLabel: 'Monthly revenue',
		width: 400,
		height: 240,
	};
}

describe('HlmChart', () => {
	it('renders the official TanStack Angular chart with an accessible name', async () => {
		const fixture = TestBed.createComponent(ChartHost);
		fixture.detectChanges();
		await fixture.whenStable();

		const host = fixture.nativeElement.querySelector('tanstack-chart') as HTMLElement;
		const svg = host.querySelector('svg');

		expect(svg).toBeTruthy();
		expect(svg?.getAttribute('aria-label')).toBe('Monthly revenue');
		expect(host.dataset['slot']).toBe('chart');
	});

	it('maps Spartan chart and tooltip tokens to TanStack CSS variables', () => {
		const fixture = TestBed.createComponent(ChartHost);
		fixture.detectChanges();

		const host = fixture.nativeElement.querySelector('tanstack-chart') as HTMLElement;

		expect(host.style.getPropertyValue('--ts-chart-1')).toBe('var(--chart-1)');
		expect(host.style.getPropertyValue('--ts-chart-focus-fill')).toBe('var(--background)');
		expect(host.style.getPropertyValue('--ts-chart-crosshair-label-halo')).toBe('var(--background)');
		expect(host.style.getPropertyValue('--ts-chart-crosshair-marker-fill')).toBe('var(--background)');
		expect(host.style.getPropertyValue('--ts-chart-tooltip-background')).toBe('var(--popover)');
		expect(host.style.getPropertyValue('--ts-chart-tooltip-color')).toBe('var(--popover-foreground)');
	});

	it('leaves style-specific chart layout to the registry', () => {
		const fixture = TestBed.createComponent(ChartHost);
		fixture.detectChanges();

		const host = fixture.nativeElement.querySelector('tanstack-chart') as HTMLElement;

		expect(host.classList).toContain('spartan-chart');
		expect(host.classList).toContain('text-foreground');
		expect(host.classList).not.toContain('block');
		expect(host.classList).not.toContain('w-full');
		expect(host.classList).not.toContain('text-xs');
	});

	it('keeps TanStack tooltip options while merging custom classes', () => {
		const configured = hlmChartTooltip({ className: 'revenue-tooltip', placement: 'top', sticky: false });

		expect(configured).toMatchObject({
			use: tooltip,
			className: 'spartan-chart-tooltip revenue-tooltip',
			placement: 'top',
			sticky: false,
		});
	});

	it('uses semantic Spartan tokens for the complete TanStack theme', () => {
		expect(HLM_CHART_THEME).toEqual({
			foreground: 'var(--foreground)',
			muted: 'var(--muted-foreground)',
			grid: 'var(--border)',
			background: 'transparent',
			palette: ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'],
		});
	});
});
