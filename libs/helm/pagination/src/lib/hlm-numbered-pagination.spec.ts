import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HlmNumberedPagination } from './hlm-numbered-pagination';
import { HlmNumberedPaginationQueryParams } from './hlm-numbered-pagination-query-params';

@Component({
	selector: 'hlm-mock-numbered',
	imports: [HlmNumberedPagination],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-numbered-pagination
			[currentPage]="5"
			[itemsPerPage]="10"
			[totalItems]="100"
			[mobileMaxSize]="mobileMaxSize()"
		/>
	`,
})
class HlmMockNumbered {
	public readonly mobileMaxSize = signal(5);
}

@Component({
	selector: 'hlm-mock-numbered-query-params',
	imports: [HlmNumberedPaginationQueryParams],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-numbered-pagination-query-params
			[currentPage]="5"
			[itemsPerPage]="10"
			[totalItems]="100"
			[mobileMaxSize]="mobileMaxSize()"
		/>
	`,
})
class HlmMockNumberedQueryParams {
	public readonly mobileMaxSize = signal(5);
}

function mobilePages(component: typeof HlmMockNumbered | typeof HlmMockNumberedQueryParams, mobileMaxSize: number) {
	const fixture = TestBed.createComponent(component);
	fixture.componentInstance.mobileMaxSize.set(mobileMaxSize);
	fixture.detectChanges();
	const items: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('li.sm\\:hidden'));
	return items.map((li) => (li.querySelector('hlm-pagination-ellipsis') ? '...' : li.textContent?.trim()));
}

describe('Numbered pagination mobile page links', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({ providers: [provideRouter([])] });
	});

	for (const [name, component] of [
		['hlm-numbered-pagination', HlmMockNumbered],
		['hlm-numbered-pagination-query-params', HlmMockNumberedQueryParams],
	] as const) {
		describe(name, () => {
			it('should show mobileMaxSize page links including the active page', () => {
				expect(mobilePages(component, 5)).toEqual(['1', '...', '5', '...', '10']);
			});

			it('should keep the active page when mobileMaxSize is below five', () => {
				expect(mobilePages(component, 4)).toEqual(['1', '...', '5', '...', '10']);
				expect(mobilePages(component, 3)).toEqual(['1', '...', '5', '...', '10']);
			});
		});
	}
});
