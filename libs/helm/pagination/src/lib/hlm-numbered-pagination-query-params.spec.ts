import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { fireEvent, render, RenderResult, screen } from '@testing-library/angular';
import { HlmNumberedPaginationQueryParams } from './hlm-numbered-pagination-query-params';

@Component({
	selector: 'hlm-numbered-pagination-query-params-host',
	imports: [HlmNumberedPaginationQueryParams],
	template: `
		<hlm-numbered-pagination-query-params
			[(currentPage)]="currentPage"
			[(itemsPerPage)]="itemsPerPage"
			[totalItems]="totalItems()"
			[enableSizeParams]="enableSizeParams()"
		/>
	`,
})
class HlmNumberedPaginationQueryParamsHost {
	public readonly currentPage = signal(1);
	public readonly itemsPerPage = signal(10);
	public readonly totalItems = signal(100);
	public readonly enableSizeParams = signal(true);
}

describe('HlmNumberedPaginationQueryParams', () => {
	let r: RenderResult<HlmNumberedPaginationQueryParamsHost>;
	let router: Router;

	beforeEach(async () => {
		r = await render(HlmNumberedPaginationQueryParamsHost, {
			providers: [provideRouter([])],
		});
		router = TestBed.inject(Router);
	});

	it('should add the size query param when a new page size is selected', async () => {
		fireEvent.click(screen.getByRole('combobox'));

		fireEvent.click(await screen.findByRole('option', { name: '20' }));

		r.detectChanges();
		await r.fixture.whenStable();

		const tree = router.parseUrl(router.url);

		expect(tree.queryParams['size']).toBe('20');
	});

	it('should preserve existing query params', async () => {
		await router.navigateByUrl('/?page=4&sort=name');

		fireEvent.click(screen.getByRole('combobox'));
		fireEvent.click(await screen.findByRole('option', { name: '20' }));

		r.detectChanges();
		await r.fixture.whenStable();

		const tree = router.parseUrl(router.url);

		expect(tree.queryParams).toEqual({
			page: '4',
			sort: 'name',
			size: '20',
		});
	});

	it('should not add the size query param when enableSizeParams is false', async () => {
		r.fixture.componentInstance.enableSizeParams.set(false);
		r.detectChanges();

		fireEvent.click(screen.getByRole('combobox'));
		fireEvent.click(await screen.findByRole('option', { name: '20' }));

		r.detectChanges();
		await r.fixture.whenStable();

		const tree = router.parseUrl(router.url);

		expect(tree.queryParams['size']).toBeUndefined();
	});

	it('should not write the initial page size to the query params', async () => {
		await router.navigateByUrl('/');

		r.detectChanges();
		await r.fixture.whenStable();

		const tree = router.parseUrl(router.url);

		expect(tree.queryParams['size']).toBeUndefined();
	});
});
