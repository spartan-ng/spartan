import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { createChartScene } from '@tanstack/charts';
import { vitest } from 'vitest';
import { chartSections } from './charts.examples';
import ChartsPage from './charts.page';

describe('ChartsPage', () => {
	beforeEach(async () => {
		vitest.stubGlobal(
			'IntersectionObserver',
			class {
				public readonly observe = vitest.fn();
				public readonly unobserve = vitest.fn();
				public readonly disconnect = vitest.fn();
			},
		);

		await TestBed.configureTestingModule({
			imports: [ChartsPage],
			providers: [provideRouter([{ path: 'charts', component: ChartsPage }])],
		}).compileComponents();
	});

	afterEach(() => vitest.unstubAllGlobals());

	it('links to the Chart documentation and source on GitHub', () => {
		const fixture = TestBed.createComponent(ChartsPage);
		fixture.detectChanges();

		const documentationLink = fixture.nativeElement.querySelector('a[href="/components/chart"]') as HTMLAnchorElement;
		const githubLink = fixture.nativeElement.querySelector(
			'a[href="https://github.com/spartan-ng/spartan/blob/main/apps/app/src/app/pages/(charts)/charts.examples.ts"]',
		) as HTMLAnchorElement;

		expect(documentationLink.textContent?.trim()).toBe('Chart documentation');
		expect(githubLink.textContent?.trim()).toBe('Open in');
		expect(githubLink.target).toBe('_blank');
	});

	it('renders only the four examples for the selected chart type', async () => {
		const fixture = TestBed.createComponent(ChartsPage);
		fixture.detectChanges();

		const chartTypeLinks = fixture.nativeElement.querySelectorAll(
			'[aria-label="Chart types"] a',
		) as NodeListOf<HTMLAnchorElement>;

		expect(chartSections.every(({ examples }) => examples.length === 4)).toBe(true);
		expect(fixture.nativeElement.querySelector('[data-chart-section] h2').textContent.trim()).toBe('Area Charts');
		expect(fixture.nativeElement.querySelectorAll('[data-chart-section] article')).toHaveLength(4);
		expect(Array.from(chartTypeLinks, (link) => link.getAttribute('href'))).toEqual([
			'/charts#area-charts',
			'/charts#bar-charts',
			'/charts#line-charts',
			'/charts#pie-charts',
			'/charts#radial-charts',
		]);
		expect(chartTypeLinks[0].dataset['state']).toBe('active');

		await TestBed.inject(Router).navigateByUrl('/charts#bar-charts');
		fixture.detectChanges();

		expect(fixture.nativeElement.querySelector('[data-chart-section] h2').textContent.trim()).toBe('Bar Charts');
		expect(fixture.nativeElement.querySelectorAll('[data-chart-section] article')).toHaveLength(4);
		expect(fixture.nativeElement.querySelector('[data-chart-section]').id).toBe('bar-charts');
	});

	it('builds a renderable scene for all twenty chart definitions', () => {
		for (const section of chartSections) {
			for (const example of section.examples) {
				const scene = createChartScene(example.options.definition, { width: 640, height: 360 });

				expect(scene.nodes.length, example.title).toBeGreaterThan(0);
			}
		}
	});
});
