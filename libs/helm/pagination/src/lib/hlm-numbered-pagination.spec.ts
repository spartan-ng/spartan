import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { provideRouter } from '@angular/router';
import { render, screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { HlmNumberedPagination } from './hlm-numbered-pagination';
import { HlmNumberedPaginationQueryParams } from './hlm-numbered-pagination-query-params';
import { provideHlmPaginationConfig } from './hlm-pagination.token';

@Component({
	selector: 'hlm-numbered-pagination-host',
	imports: [HlmNumberedPagination],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-numbered-pagination [(currentPage)]="page" [(itemsPerPage)]="pageSize" [totalItems]="100" />
	`,
})
class NumberedPaginationHost {
	public readonly page = signal(2);
	public readonly pageSize = signal(10);
}

@Component({
	selector: 'hlm-numbered-pagination-edges-host',
	imports: [HlmNumberedPagination],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-numbered-pagination
			[(currentPage)]="page"
			[(itemsPerPage)]="pageSize"
			[totalItems]="100"
			[showEdges]="showEdges()"
		/>
	`,
})
class EdgesToggleHost {
	public readonly page = signal(2);
	public readonly pageSize = signal(10);
	public readonly showEdges = signal(true);
}

@Component({
	selector: 'hlm-numbered-pagination-shared-host',
	imports: [HlmNumberedPagination],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div data-testid="first">
			<hlm-numbered-pagination [(currentPage)]="page" [(itemsPerPage)]="pageSize" [totalItems]="100" />
		</div>
		<div data-testid="second">
			<hlm-numbered-pagination [(currentPage)]="page" [(itemsPerPage)]="pageSize" [totalItems]="100" />
		</div>
	`,
})
class SharedPageHost {
	public readonly page = signal(2);
	public readonly pageSize = signal(10);
}

@Component({
	selector: 'hlm-numbered-pagination-both-host',
	imports: [HlmNumberedPagination, HlmNumberedPaginationQueryParams],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-numbered-pagination [(currentPage)]="page" [(itemsPerPage)]="pageSize" [totalItems]="100" />
		<hlm-numbered-pagination-query-params [currentPage]="page()" [(itemsPerPage)]="pageSize" [totalItems]="100" />
	`,
})
class BothPaginationsHost {
	public readonly page = signal(2);
	public readonly pageSize = signal(10);
}

@Component({
	selector: 'hlm-numbered-pagination-query-params-host',
	imports: [HlmNumberedPaginationQueryParams],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-numbered-pagination-query-params
			link="/items"
			[currentPage]="1"
			[(itemsPerPage)]="pageSize"
			[totalItems]="totalItems()"
		/>
	`,
})
class QueryParamsPaginationHost {
	public readonly pageSize = signal(10);
	public readonly totalItems = signal(100);
}

@Component({
	selector: 'hlm-numbered-pagination-shadow-host',
	imports: [HlmNumberedPagination],
	// the test needs a real shadow root; no styles are involved
	// eslint-disable-next-line @nx/workspace-avoid-component-styles
	encapsulation: ViewEncapsulation.ShadowDom,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-numbered-pagination [(currentPage)]="page" [(itemsPerPage)]="pageSize" [totalItems]="totalItems()" />
	`,
})
class ShadowPaginationHost {
	public readonly page = signal(1);
	public readonly pageSize = signal(10);
	public readonly totalItems = signal(100);
}

describe('HlmNumberedPagination accessibility', () => {
	it('renders page numbers as focusable buttons and marks the current page', async () => {
		await render(NumberedPaginationHost);

		const current = screen.getByRole('button', { name: '2' });
		expect(current).toHaveAttribute('aria-current', 'page');
		expect(screen.getByRole('button', { name: '1' })).not.toHaveAttribute('aria-current');
	});

	it('changes page with the keyboard', async () => {
		const user = userEvent.setup();
		const { fixture } = await render(NumberedPaginationHost);

		screen.getByRole('button', { name: '3' }).focus();
		await user.keyboard('{Enter}');
		expect(fixture.componentInstance.page()).toBe(3);

		screen.getByRole('button', { name: 'Go to previous page' }).focus();
		await user.keyboard('{Enter}');
		expect(fixture.componentInstance.page()).toBe(2);

		screen.getByRole('button', { name: 'Go to next page' }).focus();
		await user.keyboard(' ');
		expect(fixture.componentInstance.page()).toBe(3);
	});

	it('reaches every control with Tab', async () => {
		const user = userEvent.setup();
		await render(NumberedPaginationHost);

		await user.tab();
		expect(screen.getByRole('button', { name: 'Go to previous page' })).toHaveFocus();
		await user.tab();
		expect(screen.getByRole('button', { name: '1' })).toHaveFocus();
	});

	it('labels the page size selector', async () => {
		await render(NumberedPaginationHost);
		expect(screen.getByRole('combobox', { name: 'Items per page' })).toBeInTheDocument();
	});

	it('uses the configured page size label', async () => {
		await render(NumberedPaginationHost, {
			providers: [provideHlmPaginationConfig({ pageSizeAriaLabel: 'Rows per page' })],
		});
		expect(screen.getByRole('combobox', { name: 'Rows per page' })).toBeInTheDocument();
	});

	it('moves focus to the current page when Previous disappears on the first page', async () => {
		const user = userEvent.setup();
		const { fixture } = await render(NumberedPaginationHost);

		screen.getByRole('button', { name: 'Go to previous page' }).focus();
		await user.keyboard('{Enter}');
		await fixture.whenStable();

		expect(fixture.componentInstance.page()).toBe(1);
		expect(screen.queryByRole('button', { name: 'Go to previous page' })).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: '1' })).toHaveFocus();
	});

	it('moves focus to the current page when Next disappears on the last page', async () => {
		const user = userEvent.setup();
		const { fixture } = await render(NumberedPaginationHost);
		fixture.componentInstance.page.set(9);
		await fixture.whenStable();

		screen.getByRole('button', { name: 'Go to next page' }).focus();
		await user.keyboard('{Enter}');
		await fixture.whenStable();

		expect(fixture.componentInstance.page()).toBe(10);
		expect(screen.getByRole('button', { name: '10' })).toHaveFocus();
	});

	it('gives each page size selector its own label when both variants are on the page', async () => {
		const { container } = await render(BothPaginationsHost, { providers: [provideRouter([])] });

		const labels = [...container.querySelectorAll<HTMLLabelElement>('label[for]')];
		expect(labels).toHaveLength(2);
		expect(labels[0].htmlFor).not.toBe(labels[1].htmlFor);
		expect(screen.getAllByRole('combobox', { name: 'Items per page' })).toHaveLength(2);
	});

	it('moves focus to the current page when the edges are hidden', async () => {
		const { fixture } = await render(EdgesToggleHost);

		screen.getByRole('button', { name: 'Go to previous page' }).focus();
		fixture.componentInstance.showEdges.set(false);
		await fixture.whenStable();

		expect(screen.queryByRole('button', { name: 'Go to previous page' })).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: '2' })).toHaveFocus();
	});

	it('restores focus in the pagination that last had it when both share the page', async () => {
		const user = userEvent.setup();
		const { fixture } = await render(SharedPageHost);
		const first = within(screen.getByTestId('first'));
		const second = within(screen.getByTestId('second'));

		// focus visits the first pagination, then moves to the second one
		first.getByRole('button', { name: 'Go to previous page' }).focus();
		second.getByRole('button', { name: 'Go to previous page' }).focus();
		await user.keyboard('{Enter}');
		await fixture.whenStable();

		expect(fixture.componentInstance.page()).toBe(1);
		expect(second.getByRole('button', { name: '1' })).toHaveFocus();
	});

	it('keeps focus on the only page when the other pages disappear (query params variant)', async () => {
		const { fixture } = await render(QueryParamsPaginationHost, { providers: [provideRouter([])] });

		screen.getByRole('link', { name: 'Go to next page' }).focus();
		fixture.componentInstance.totalItems.set(5);
		await fixture.whenStable();

		expect(screen.queryByRole('link', { name: 'Go to next page' })).not.toBeInTheDocument();
		expect(screen.getByText('1', { selector: 'a[aria-current="page"]' })).toHaveFocus();
	});

	it('restores focus when the pagination is rendered inside a shadow root', async () => {
		const { fixture } = await render(ShadowPaginationHost);
		const root = (fixture.nativeElement as HTMLElement).shadowRoot as ShadowRoot;

		root.querySelector<HTMLElement>('[aria-label="Go to next page"]')!.focus();
		fixture.componentInstance.totalItems.set(5);
		await fixture.whenStable();

		expect(root.querySelector('[aria-label="Go to next page"]')).toBeNull();
		expect(root.activeElement).toBe(root.querySelector('[aria-current="page"]'));
	});
});
