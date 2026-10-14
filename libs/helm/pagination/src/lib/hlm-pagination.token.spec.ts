import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HlmNumberedPagination } from './hlm-numbered-pagination';
import { HlmNumberedPaginationQueryParams } from './hlm-numbered-pagination-query-params';
import { HlmPaginationNext } from './hlm-pagination-next';
import { HlmPaginationPrevious } from './hlm-pagination-previous';
import { provideHlmPaginationConfig } from './hlm-pagination.token';

@Component({
	selector: 'hlm-mock-links',
	imports: [HlmPaginationPrevious, HlmPaginationNext],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-pagination-previous link="." />
		<hlm-pagination-next link="." />
	`,
})
class HlmMockLinks {}

@Component({
	selector: 'hlm-mock-numbered',
	imports: [HlmNumberedPagination],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-numbered-pagination [currentPage]="2" [itemsPerPage]="10" [totalItems]="50" />
	`,
})
class HlmMockNumbered {}

@Component({
	selector: 'hlm-mock-numbered-overrides',
	imports: [HlmNumberedPagination],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-numbered-pagination
			[currentPage]="2"
			[itemsPerPage]="10"
			[totalItems]="50"
			totalItemsLabel="elementi"
			pagesLabel="pagine"
			previousLabel="Indietro"
			previousAriaLabel="Pagina precedente"
			nextLabel="Avanti"
			nextAriaLabel="Pagina successiva"
		/>
	`,
})
class HlmMockNumberedOverrides {}

@Component({
	selector: 'hlm-mock-numbered-query-params',
	imports: [HlmNumberedPaginationQueryParams],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-numbered-pagination-query-params [currentPage]="2" [itemsPerPage]="10" [totalItems]="50" />
	`,
})
class HlmMockNumberedQueryParams {}

function render<T>(component: new () => T): HTMLElement {
	const fixture = TestBed.createComponent(component);
	fixture.detectChanges();
	return fixture.nativeElement;
}

function previousLink(el: HTMLElement): HTMLAnchorElement {
	return el.querySelector('hlm-pagination-previous a') as HTMLAnchorElement;
}

function nextLink(el: HTMLElement): HTMLAnchorElement {
	return el.querySelector('hlm-pagination-next a') as HTMLAnchorElement;
}

describe('HlmPaginationConfig', () => {
	describe('without a provider', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({ providers: [provideRouter([])] });
		});

		it('should keep the existing default labels on previous and next', () => {
			const el = render(HlmMockLinks);

			expect(previousLink(el).textContent?.trim()).toBe('Previous');
			expect(previousLink(el).getAttribute('aria-label')).toBe('Go to previous page');
			expect(nextLink(el).textContent?.trim()).toBe('Next');
			expect(nextLink(el).getAttribute('aria-label')).toBe('Go to next page');
		});

		it('should keep the existing default labels on numbered pagination', () => {
			const el = render(HlmMockNumbered);

			expect(el.textContent).toContain('total items');
			expect(el.textContent).toContain('pages');
			expect(previousLink(el).textContent?.trim()).toBe('Previous');
			expect(nextLink(el).textContent?.trim()).toBe('Next');
		});

		it('should prefer input overrides over the defaults', () => {
			const el = render(HlmMockNumberedOverrides);

			expect(el.textContent).toContain('elementi');
			expect(el.textContent).toContain('pagine');
			expect(previousLink(el).textContent?.trim()).toBe('Indietro');
			expect(previousLink(el).getAttribute('aria-label')).toBe('Pagina precedente');
			expect(nextLink(el).textContent?.trim()).toBe('Avanti');
			expect(nextLink(el).getAttribute('aria-label')).toBe('Pagina successiva');
		});
	});

	describe('with provideHlmPaginationConfig', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [
					provideRouter([]),
					provideHlmPaginationConfig({
						totalItemsLabel: 'elementi',
						pagesLabel: 'pagine',
						previousLabel: 'Indietro',
						previousAriaLabel: 'Pagina precedente',
						nextLabel: 'Avanti',
					}),
				],
			});
		});

		it('should apply the config to previous and next, falling back to defaults for missing keys', () => {
			const el = render(HlmMockLinks);

			expect(previousLink(el).textContent?.trim()).toBe('Indietro');
			expect(previousLink(el).getAttribute('aria-label')).toBe('Pagina precedente');
			expect(nextLink(el).textContent?.trim()).toBe('Avanti');
			expect(nextLink(el).getAttribute('aria-label')).toBe('Go to next page');
		});

		it('should apply the config to numbered pagination', () => {
			const el = render(HlmMockNumbered);

			expect(el.textContent).toContain('elementi');
			expect(el.textContent).toContain('pagine');
			expect(previousLink(el).getAttribute('aria-label')).toBe('Pagina precedente');
			expect(nextLink(el).textContent?.trim()).toBe('Avanti');
		});

		it('should apply the config to numbered pagination with query params', () => {
			const el = render(HlmMockNumberedQueryParams);

			expect(el.textContent).toContain('elementi');
			expect(el.textContent).toContain('pagine');
			expect(previousLink(el).getAttribute('aria-label')).toBe('Pagina precedente');
			expect(nextLink(el).textContent?.trim()).toBe('Avanti');
		});
	});
});
