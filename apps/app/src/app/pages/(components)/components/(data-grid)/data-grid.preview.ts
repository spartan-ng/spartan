import { Component } from '@angular/core';
import { createRestAdapter, injectBrnDataGrid } from '@spartan-ng/brain/data-grid';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDataGridImports } from '@spartan-ng/helm/data-grid';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTableImports } from '@spartan-ng/helm/table';
import {
	columnFilteringFeature,
	columnVisibilityFeature,
	createColumnHelper,
	FlexRender,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	tableFeatures,
} from '@tanstack/angular-table';

export type DataGridUser = {
	id: string;
	name: string;
	email: string;
};

const features = tableFeatures({
	columnFilteringFeature,
	columnVisibilityFeature,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
});

export type DataGridFeatures = typeof features;

const columnHelper = createColumnHelper<DataGridFeatures, DataGridUser>();

const columns = [
	columnHelper.accessor('name', {
		id: 'name',
		header: 'Name',
		cell: (info) => info.getValue<string>(),
	}),
	columnHelper.accessor('email', {
		id: 'email',
		header: 'Email',
		cell: (info) => `<div class="lowercase">${info.getValue<string>()}</div>`,
	}),
];

const USERS: DataGridUser[] = [
	{ id: '1', name: 'Ada Lovelace', email: 'ada@example.com' },
	{ id: '2', name: 'Grace Hopper', email: 'grace@example.com' },
	{ id: '3', name: 'Alan Turing', email: 'alan@example.com' },
	{ id: '4', name: 'Edsger Dijkstra', email: 'edsger@example.com' },
	{ id: '5', name: 'Barbara Liskov', email: 'barbara@example.com' },
	{ id: '6', name: 'Donald Knuth', email: 'donald@example.com' },
	{ id: '7', name: 'Linus Torvalds', email: 'linus@example.com' },
	{ id: '8', name: 'Margaret Hamilton', email: 'margaret@example.com' },
];

const adapter = createRestAdapter<DataGridUser>({
	baseUrl: '/api/users',
	fetchFn: async (url, signal) => {
		signal.throwIfAborted();
		const params = new URLSearchParams(url.split('?')[1] ?? '');
		const page = Number(params.get('page') ?? '1') - 1;
		const pageSize = Number(params.get('pageSize') ?? '5');
		const q = (params.get('q') ?? '').toLowerCase();
		const rows = USERS.filter((u) => u.email.toLowerCase().includes(q));
		return { rows: rows.slice(page * pageSize, page * pageSize + pageSize), total: rows.length };
	},
});

@Component({
	selector: 'spartan-data-grid-preview',
	imports: [FlexRender, HlmDataGridImports, HlmTableImports, HlmInputImports, HlmButtonImports],
	host: { class: 'w-full' },
	template: `
		<div class="flex items-center gap-2 py-4">
			<input hlmInput class="w-full md:max-w-sm" placeholder="Filter emails..." (input)="_filterChanged($event)" />
		</div>
		<hlm-data-grid [loading]="_grid.loading()" [error]="_grid.error()" [total]="_grid.total()" [retry]="_grid.reload">
			<thead>
				@for (headerGroup of _grid.table.getHeaderGroups(); track headerGroup.id) {
					<tr hlmTr>
						@for (header of headerGroup.headers; track header.id) {
							<th hlmTh [attr.colSpan]="header.colSpan">
								@if (!header.isPlaceholder) {
									<ng-container
										*flexRender="header.column.columnDef.header; props: header.getContext(); let headerText"
									>
										<div [innerHTML]="headerText"></div>
									</ng-container>
								}
							</th>
						}
					</tr>
				}
			</thead>
			@for (row of _grid.table.getRowModel().rows; track row.id) {
				<tr hlmTr>
					@for (cell of row.getVisibleCells(); track cell.id) {
						<td hlmTd>
							<ng-container *flexRender="cell.column.columnDef.cell; props: cell.getContext(); let cellText">
								<div [innerHTML]="cellText"></div>
							</ng-container>
						</td>
					}
				</tr>
			}
		</hlm-data-grid>
		<hlm-data-grid-pagination [table]="_grid.table" />
	`,
})
export class DataGridPreview {
	protected readonly _grid = injectBrnDataGrid<DataGridUser>({
		adapter,
		initial: { pageSize: 5 },
		features,
		columns,
	});

	protected _filterChanged(event: Event) {
		this._grid.table.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value);
	}
}

export const defaultImports = `
import { HlmDataGridImports } from '@spartan-ng/helm/data-grid';
import { createRestAdapter, injectBrnDataGrid } from '@spartan-ng/brain/data-grid';
`;

export const defaultSkeleton = `
<hlm-data-grid [loading]="grid.loading()" [error]="grid.error()" [total]="grid.total()" [retry]="grid.reload">
	<thead>
		<!-- header groups via *flexRender -->
	</thead>
	<!-- rows via *flexRender -->
</hlm-data-grid>
<hlm-data-grid-pagination [table]="grid.table" />
`;
