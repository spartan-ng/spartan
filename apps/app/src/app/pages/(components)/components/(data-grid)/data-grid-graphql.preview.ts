import { Component, computed } from '@angular/core';
import { createGraphQLAdapter, injectBrnDataGrid } from '@spartan-ng/brain/data-grid';
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

export type DataGridGraphQLUser = {
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

export type DataGridGraphQLFeatures = typeof features;

const columnHelper = createColumnHelper<DataGridGraphQLFeatures, DataGridGraphQLUser>();

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

const USERS: DataGridGraphQLUser[] = [
	{ id: '1', name: 'Ada Lovelace', email: 'ada@example.com' },
	{ id: '2', name: 'Grace Hopper', email: 'grace@example.com' },
	{ id: '3', name: 'Alan Turing', email: 'alan@example.com' },
	{ id: '4', name: 'Edsger Dijkstra', email: 'edsger@example.com' },
	{ id: '5', name: 'Barbara Liskov', email: 'barbara@example.com' },
	{ id: '6', name: 'Donald Knuth', email: 'donald@example.com' },
	{ id: '7', name: 'Linus Torvalds', email: 'linus@example.com' },
	{ id: '8', name: 'Margaret Hamilton', email: 'margaret@example.com' },
	{ id: '9', name: 'John von Neumann', email: 'john@example.com' },
	{ id: '10', name: 'Katherine Johnson', email: 'katherine@example.com' },
];

const adapter = createGraphQLAdapter<DataGridGraphQLUser>({
	endpoint: '/graphql',
	query: 'query Users($offset: Int, $limit: Int, $where: UserFilter, $search: String) { users }',
	fetchFn: async (vars, signal) => {
		signal.throwIfAborted();
		const offset = vars.offset ?? 0;
		const limit = vars.limit ?? 5;
		const where = (vars.where as Record<string, unknown> | undefined) ?? {};
		const emailFilter: unknown = where['email'];
		const emailContains =
			typeof emailFilter === 'string'
				? emailFilter
				: String((emailFilter as { contains?: unknown } | undefined)?.contains ?? vars.search ?? '');
		const rows = USERS.filter((u) => u.email.toLowerCase().includes(emailContains.toLowerCase()));
		return { rows: rows.slice(offset, offset + limit), total: rows.length };
	},
});

@Component({
	selector: 'spartan-data-grid-graphql-preview',
	imports: [FlexRender, HlmDataGridImports, HlmTableImports, HlmInputImports, HlmButtonImports],
	host: { class: 'w-full' },
	template: `
		<div class="flex items-center gap-2 py-4">
			<input hlmInput class="w-full md:max-w-sm" placeholder="Filter emails..." (input)="_filterChanged($event)" />
		</div>
		<pre class="text-muted-foreground overflow-x-auto font-mono text-xs">{{ _variables() }}</pre>
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
export class DataGridGraphQLPreview {
	protected readonly _grid = injectBrnDataGrid<DataGridGraphQLUser>({
		adapter,
		initial: { pageSize: 5 },
		features,
		columns,
	});

	protected readonly _variables = computed(() => JSON.stringify(this._grid.query(), null, 2));

	protected _filterChanged(event: Event) {
		this._grid.table.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value);
	}
}
