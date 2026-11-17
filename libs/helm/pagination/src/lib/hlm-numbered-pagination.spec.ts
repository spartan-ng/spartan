import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { HlmNumberedPagination } from './hlm-numbered-pagination';
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
});
