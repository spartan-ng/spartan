export const paymentsCode = `
export type Payment = {
	id: string;
	amount: number;
	status: 'pending' | 'processing' | 'success' | 'failed';
	email: string;
};

export const payments: Payment[] = [
	{
		id: '728ed52f',
		amount: 100,
		status: 'pending',
		email: 'm@example.com',
	},
	{
		id: '489e1d42',
		amount: 125,
		status: 'processing',
		email: 'example@gmail.com',
	},
	// ...
];
`;

export const featuresCode = `
import {
	columnFilteringFeature,
	columnVisibilityFeature,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	filterFn_includesString,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	sortFn_alphanumeric,
	sortFn_text,
	tableFeatures,
} from '@tanstack/angular-table';

// New in v9: declare the features this table uses — anything you don't
// register is tree-shaken out of the bundle.
export const features = tableFeatures({
	columnFilteringFeature,
	columnVisibilityFeature,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	filteredRowModel: createFilteredRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	sortedRowModel: createSortedRowModel(),
	filterFns: { includesString: filterFn_includesString },
	sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
});

// Pass this as the first generic argument to \`ColumnDef\`, \`Column\`, \`Table\`
// and \`Row\` so each type knows which feature APIs are available.
export type DataTableFeatures = typeof features;
`;

export const columnsCode = `
import { createColumnHelper } from '@tanstack/angular-table';
import { type DataTableFeatures } from './data-table-features';
import { type Payment } from './payments';

// Use \`accessor\` for data columns and \`display\` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Payment>();

export const columns = columnHelper.columns([
	columnHelper.accessor('status', {
		header: 'Status',
	}),
	columnHelper.accessor('email', {
		header: 'Email',
	}),
	columnHelper.accessor('amount', {
		header: 'Amount',
	}),
]);
`;

export const basicTableCode = `
import { Component, input } from '@angular/core';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { type ColumnDef, FlexRender, injectTable, type RowData } from '@tanstack/angular-table';
import { features, type DataTableFeatures } from './data-table-features';

@Component({
	selector: 'app-data-table',
	imports: [FlexRender, HlmTableImports],
	template: \`
		<div class="overflow-hidden rounded-md border">
			<div hlmTableContainer>
				<table hlmTable>
					<thead hlmTHead>
						@for (headerGroup of table.getHeaderGroups(); track headerGroup.id) {
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
					<tbody hlmTBody>
						@for (row of table.getRowModel().rows; track row.id) {
							<tr hlmTr [attr.data-state]="row.getIsSelected() && 'selected'">
								@for (cell of row.getVisibleCells(); track $index) {
									<td hlmTd>
										<ng-container *flexRender="cell.column.columnDef.cell; props: cell.getContext(); let cellText">
											<div [innerHTML]="cellText"></div>
										</ng-container>
									</td>
								}
							</tr>
						} @empty {
							<tr hlmTr>
								<td hlmTd class="h-24 text-center" [attr.colspan]="columns().length">No results.</td>
							</tr>
						}
					</tbody>
				</table>
			</div>
		</div>
	\`,
})
export class DataTable<TData extends RowData> {
	public readonly columns = input.required<ColumnDef<DataTableFeatures, TData>[]>();
	public readonly data = input.required<TData[]>();

	protected readonly table = injectTable(() => ({
		features,
		columns: this.columns(),
		data: this.data(),
	}));
}
`;

export const renderTableCode = `
import { Component, signal } from '@angular/core';
import { columns } from './columns';
import { DataTable } from './data-table';
import { type Payment } from './payments';

@Component({
	selector: 'app-demo-page',
	imports: [DataTable],
	template: \`
		<div class="container mx-auto py-10">
			<app-data-table [columns]="columns" [data]="data()" />
		</div>
	\`,
})
export class DemoPage {
	protected readonly columns = columns;

	// Fetch data from your API here.
	protected readonly data = signal<Payment[]>([
		{
			id: '728ed52f',
			amount: 100,
			status: 'pending',
			email: 'm@example.com',
		},
		// ...
	]);
}
`;

export const cellFormattingCode = `
export const columns = columnHelper.columns([
	columnHelper.accessor('amount', {
		header: '<div class="text-right">Amount</div>',
		cell: (info) => {
			const amount = parseFloat(info.getValue<string>());
			const formatted = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			}).format(amount);

			return \`<div class="text-right font-medium">\${formatted}</div>\`;
		},
	}),
]);
`;

export const actionDropdownCode = `
import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import type { Row } from '@tanstack/angular-table';
import { type DataTableFeatures } from './data-table-features';
import { type Payment } from './payments';

@Component({
	selector: 'app-action-dropdown',
	imports: [HlmButtonImports, NgIcon, HlmDropdownMenuImports],
	providers: [provideIcons({ lucideEllipsis })],
	template: \`
		<button hlmBtn size="icon-sm" variant="ghost" [hlmDropdownMenuTrigger]="ActionDropDownMenu">
			<span class="sr-only">Open menu</span>
			<ng-icon name="lucideEllipsis" />
		</button>

		<ng-template #ActionDropDownMenu>
			<hlm-dropdown-menu>
				<hlm-dropdown-menu-label>Actions</hlm-dropdown-menu-label>
				<button hlmDropdownMenuItem (click)="copyPaymentId()">Copy payment ID</button>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem>View customer</button>
				<button hlmDropdownMenuItem>View payment details</button>
			</hlm-dropdown-menu>
		</ng-template>
	\`,
})
export class ActionDropdown {
	public readonly row = input.required<Row<DataTableFeatures, Payment>>();

	copyPaymentId() {
		const payment = this.row().original;
		navigator.clipboard.writeText(payment.id);
	}
}
`;

export const rowActionsColumnCode = `
import { ActionDropdown } from './action-dropdown';

export const columns = columnHelper.columns([
	// ...
	columnHelper.display({
		id: 'actions',
		cell: () => ActionDropdown,
		enableHiding: false,
	}),
]);
`;

export const paginationCode = `
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'app-data-table',
	imports: [FlexRender, HlmButtonImports, HlmTableImports],
	template: \`
		<div class="overflow-hidden rounded-md border">
			<!-- table -->
		</div>

		<div class="flex items-center justify-end space-x-2 py-4">
			<button
				hlmBtn
				variant="outline"
				size="sm"
				[disabled]="!table.getCanPreviousPage()"
				(click)="table.previousPage()"
			>
				Previous
			</button>
			<button hlmBtn variant="outline" size="sm" [disabled]="!table.getCanNextPage()" (click)="table.nextPage()">
				Next
			</button>
		</div>
	\`,
})
export class DataTable<TData extends RowData> {
	// ...
}
`;

export const sortingStateCode = `
import { Component, input, signal } from '@angular/core';
import { injectTable, isFunction, type SortingState } from '@tanstack/angular-table';

export class DataTable<TData extends RowData> {
	private readonly _sorting = signal<SortingState>([]);

	protected readonly table = injectTable(() => ({
		features,
		columns: this.columns(),
		data: this.data(),
		onSortingChange: (updater) => (isFunction(updater) ? this._sorting.update(updater) : this._sorting.set(updater)),
		state: {
			sorting: this._sorting(),
		},
	}));
}
`;

export const sortHeaderButtonCode = `
import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpDown } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { type Column } from '@tanstack/angular-table';
import { type DataTableFeatures } from './data-table-features';
import { type Payment } from './payments';

@Component({
	imports: [HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideArrowUpDown })],
	template: \`
		<button hlmBtn size="sm" variant="ghost" class="capitalize" (click)="sortClick()">
			{{ column().id }}
			<ng-icon name="lucideArrowUpDown" />
		</button>
	\`,
})
export class TableHeadSortButton {
	public readonly column = input.required<Column<DataTableFeatures, Payment, unknown>>();

	protected sortClick() {
		this.column().toggleSorting(this.column().getIsSorted() === 'asc');
	}
}
`;

export const sortingColumnCode = `
import { TableHeadSortButton } from './sort-header-button';

export const columns = columnHelper.columns([
	columnHelper.accessor('email', {
		header: () => TableHeadSortButton,
		cell: (info) => \`<div class="lowercase">\${info.getValue<string>()}</div>\`,
	}),
]);
`;

export const filteringCode = `
import { Component, input, signal } from '@angular/core';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { type ColumnFiltersState, injectTable, isFunction } from '@tanstack/angular-table';

@Component({
	selector: 'app-data-table',
	imports: [FlexRender, HlmButtonImports, HlmInputImports, HlmTableImports],
	template: \`
		<div class="flex items-center py-4">
			<input hlmInput class="w-full md:w-80" placeholder="Filter emails..." (input)="filterChanged($event)" />
		</div>
		<div class="overflow-hidden rounded-md border">
			<!-- table -->
		</div>
	\`,
})
export class DataTable<TData extends RowData> {
	private readonly _columnFilters = signal<ColumnFiltersState>([]);

	protected readonly table = injectTable(() => ({
		features,
		columns: this.columns(),
		data: this.data(),
		onColumnFiltersChange: (updater) =>
			isFunction(updater) ? this._columnFilters.update(updater) : this._columnFilters.set(updater),
		state: {
			columnFilters: this._columnFilters(),
		},
	}));

	protected filterChanged(event: Event) {
		this.table.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value);
	}
}
`;

export const visibilityCode = `
import { Component, input, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { type ColumnVisibilityState, injectTable, isFunction } from '@tanstack/angular-table';

@Component({
	selector: 'app-data-table',
	imports: [FlexRender, HlmButtonImports, HlmDropdownMenuImports, HlmInputImports, HlmTableImports, NgIcon],
	providers: [provideIcons({ lucideChevronDown })],
	template: \`
		<div class="flex items-center py-4">
			<!-- filter input -->

			<button hlmBtn variant="outline" align="end" class="ml-auto" [hlmDropdownMenuTrigger]="menu">
				Columns
				<ng-icon name="lucideChevronDown" class="ml-2" />
			</button>
			<ng-template #menu>
				<hlm-dropdown-menu class="w-32">
					@for (column of hidableColumns; track column.id) {
						<button
							hlmDropdownMenuCheckbox
							class="capitalize"
							[checked]="column.getIsVisible()"
							(triggered)="column.toggleVisibility()"
						>
							<hlm-dropdown-menu-checkbox-indicator />
							{{ column.columnDef.id }}
						</button>
					}
				</hlm-dropdown-menu>
			</ng-template>
		</div>
		<div class="overflow-hidden rounded-md border">
			<!-- table -->
		</div>
	\`,
})
export class DataTable<TData extends RowData> {
	private readonly _columnVisibility = signal<ColumnVisibilityState>({});

	protected readonly table = injectTable(() => ({
		features,
		columns: this.columns(),
		data: this.data(),
		onColumnVisibilityChange: (updater) =>
			isFunction(updater) ? this._columnVisibility.update(updater) : this._columnVisibility.set(updater),
		state: {
			columnVisibility: this._columnVisibility(),
		},
	}));

	protected readonly hidableColumns = this.table.getAllColumns().filter((column) => column.getCanHide());
}
`;

export const selectionColumnCode = `
import { Component, input } from '@angular/core';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { type Row, type Table } from '@tanstack/angular-table';
import { type DataTableFeatures } from './data-table-features';
import { type Payment } from './payments';

@Component({
	imports: [HlmCheckboxImports],
	host: {
		class: 'flex',
		'aria-label': 'Select all',
	},
	template: \`
		<hlm-checkbox
			[checked]="table().getIsAllRowsSelected()"
			[indeterminate]="table().getIsSomeRowsSelected() && !table().getIsAllPageRowsSelected()"
			(checkedChange)="table().toggleAllPageRowsSelected($event)"
		/>
	\`,
})
export class TableHeadSelection {
	public readonly table = input.required<Table<DataTableFeatures, Payment>>();
}

@Component({
	imports: [HlmCheckboxImports],
	host: {
		class: 'flex',
		'aria-label': 'Select Row',
	},
	template: \`
		<hlm-checkbox [checked]="row().getIsSelected()" (checkedChange)="row().toggleSelected($event)" />
	\`,
})
export class TableRowSelection {
	public readonly row = input.required<Row<DataTableFeatures, Payment>>();
}
`;

export const rowSelectionCode = `
import { TableHeadSelection, TableRowSelection } from './selection-column';

export const columns = columnHelper.columns([
	columnHelper.display({
		id: 'select',
		header: () => TableHeadSelection,
		cell: () => TableRowSelection,
		enableHiding: false,
	}),
	// ...
]);
`;

export const rowSelectionStateCode = `
import { Component, input, signal } from '@angular/core';
import { injectTable, isFunction, type RowSelectionState } from '@tanstack/angular-table';

export class DataTable<TData extends RowData> {
	private readonly _rowSelection = signal<RowSelectionState>({});

	protected readonly table = injectTable(() => ({
		features,
		columns: this.columns(),
		data: this.data(),
		onRowSelectionChange: (updater) =>
			isFunction(updater) ? this._rowSelection.update(updater) : this._rowSelection.set(updater),
		state: {
			rowSelection: this._rowSelection(),
		},
	}));
}
`;

export const selectedRowsCode = `
<div class="text-muted-foreground text-sm">
	{{ table.getSelectedRowModel().rows.length }} of {{ table.getRowCount() }} row(s) selected.
</div>
`;

export const columnHeaderCode = `
import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowDown, lucideArrowUp, lucideChevronsUpDown, lucideEyeOff } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { type Column } from '@tanstack/angular-table';
import { type DataTableFeatures } from './data-table-features';
import { type Payment } from './payments';

@Component({
	selector: 'app-data-table-column-header',
	imports: [HlmButtonImports, HlmDropdownMenuImports, NgIcon],
	providers: [provideIcons({ lucideArrowDown, lucideArrowUp, lucideChevronsUpDown, lucideEyeOff })],
	template: \`
		@if (column().getCanSort()) {
			<div class="flex items-center gap-2">
				<button
					hlmBtn
					variant="ghost"
					size="sm"
					class="data-[state=open]:bg-accent -ml-3 h-8"
					align="start"
					[hlmDropdownMenuTrigger]="menu"
				>
					<span>{{ title() }}</span>
					@switch (column().getIsSorted()) {
						@case ('desc') {
							<ng-icon name="lucideArrowDown" />
						}
						@case ('asc') {
							<ng-icon name="lucideArrowUp" />
						}
						@default {
							<ng-icon name="lucideChevronsUpDown" />
						}
					}
				</button>
				<ng-template #menu>
					<hlm-dropdown-menu>
						<button hlmDropdownMenuItem (click)="column().toggleSorting(false)">
							<ng-icon name="lucideArrowUp" />
							Asc
						</button>
						<button hlmDropdownMenuItem (click)="column().toggleSorting(true)">
							<ng-icon name="lucideArrowDown" />
							Desc
						</button>
						<hlm-dropdown-menu-separator />
						<button hlmDropdownMenuItem (click)="column().toggleVisibility(false)">
							<ng-icon name="lucideEyeOff" />
							Hide
						</button>
					</hlm-dropdown-menu>
				</ng-template>
			</div>
		} @else {
			<div>{{ title() }}</div>
		}
	\`,
})
export class DataTableColumnHeader {
	public readonly column = input.required<Column<DataTableFeatures, Payment, unknown>>();
	public readonly title = input.required<string>();
}
`;

export const columnHeaderUsageCode = `
import { flexRenderComponent } from '@tanstack/angular-table';
import { DataTableColumnHeader } from './data-table-column-header';

export const columns = columnHelper.columns([
	columnHelper.accessor('email', {
		header: ({ column }) => flexRenderComponent(DataTableColumnHeader, { inputs: { column, title: 'Email' } }),
	}),
]);
`;

export const reusablePaginationCode = `
import { Component, computed } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight, lucideChevronsLeft, lucideChevronsRight } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { injectTableContext } from '@tanstack/angular-table';

@Component({
	selector: 'app-data-table-pagination',
	imports: [HlmButtonImports, HlmSelectImports, NgIcon],
	providers: [provideIcons({ lucideChevronLeft, lucideChevronRight, lucideChevronsLeft, lucideChevronsRight })],
	template: \`
		<div class="flex items-center justify-between px-2">
			<div class="text-muted-foreground flex-1 text-sm">
				{{ table().getFilteredSelectedRowModel().rows.length }} of
				{{ table().getFilteredRowModel().rows.length }} row(s) selected.
			</div>
			<div class="flex items-center space-x-6 lg:space-x-8">
				<div class="flex items-center space-x-2">
					<p class="text-sm font-medium">Rows per page</p>
					<hlm-select [value]="pagination().pageSize" (valueChange)="setPageSize($event)">
						<hlm-select-trigger class="h-8 w-[70px]">
							<hlm-select-value />
						</hlm-select-trigger>
						<hlm-select-content *hlmSelectPortal>
							@for (pageSize of pageSizes; track pageSize) {
								<hlm-select-item [value]="pageSize">{{ pageSize }}</hlm-select-item>
							}
						</hlm-select-content>
					</hlm-select>
				</div>
				<div class="flex w-[100px] items-center justify-center text-sm font-medium">
					Page {{ pagination().pageIndex + 1 }} of {{ table().getPageCount() }}
				</div>
				<div class="flex items-center space-x-2">
					<button
						hlmBtn
						variant="outline"
						size="icon"
						class="hidden size-8 lg:flex"
						[disabled]="!table().getCanPreviousPage()"
						(click)="table().setPageIndex(0)"
					>
						<span class="sr-only">Go to first page</span>
						<ng-icon name="lucideChevronsLeft" />
					</button>
					<button
						hlmBtn
						variant="outline"
						size="icon"
						class="size-8"
						[disabled]="!table().getCanPreviousPage()"
						(click)="table().previousPage()"
					>
						<span class="sr-only">Go to previous page</span>
						<ng-icon name="lucideChevronLeft" />
					</button>
					<button
						hlmBtn
						variant="outline"
						size="icon"
						class="size-8"
						[disabled]="!table().getCanNextPage()"
						(click)="table().nextPage()"
					>
						<span class="sr-only">Go to next page</span>
						<ng-icon name="lucideChevronRight" />
					</button>
					<button
						hlmBtn
						variant="outline"
						size="icon"
						class="hidden size-8 lg:flex"
						[disabled]="!table().getCanNextPage()"
						(click)="table().setPageIndex(table().getPageCount() - 1)"
					>
						<span class="sr-only">Go to last page</span>
						<ng-icon name="lucideChevronsRight" />
					</button>
				</div>
			</div>
		</div>
	\`,
})
export class DataTablePagination {
	// Provided by the nearest \`[tanStackTable]\` directive, so no table input
	// or generics are needed and this component works with any table.
	protected readonly table = injectTableContext();

	protected readonly pageSizes = [10, 20, 25, 30, 40, 50];

	// Table atoms are backed by Angular signals, so this stays in sync.
	protected readonly pagination = computed(() => this.table().atoms.pagination.get());

	protected setPageSize(value: unknown) {
		this.table().setPageSize(Number(value));
	}
}
`;

export const reusablePaginationUsageCode = `
import { TanStackTable } from '@tanstack/angular-table';
import { DataTablePagination } from './data-table-pagination';

@Component({
	selector: 'app-data-table',
	imports: [DataTablePagination, FlexRender, HlmTableImports, TanStackTable],
	template: \`
		<div class="overflow-hidden rounded-md border">
			<!-- table -->
		</div>

		<div class="py-4" [tanStackTable]="table">
			<app-data-table-pagination />
		</div>
	\`,
})
export class DataTable<TData extends RowData> {
	// ...
}
`;

export const viewOptionsCode = `
import { Component, computed } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSettings2 } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { injectTableContext } from '@tanstack/angular-table';

@Component({
	selector: 'app-data-table-view-options',
	imports: [HlmButtonImports, HlmDropdownMenuImports, NgIcon],
	providers: [provideIcons({ lucideSettings2 })],
	template: \`
		<button
			hlmBtn
			variant="outline"
			size="sm"
			class="ml-auto hidden h-8 lg:flex"
			align="end"
			[hlmDropdownMenuTrigger]="menu"
		>
			<ng-icon name="lucideSettings2" />
			View
		</button>
		<ng-template #menu>
			<hlm-dropdown-menu class="w-[150px]">
				<hlm-dropdown-menu-label>Toggle columns</hlm-dropdown-menu-label>
				<hlm-dropdown-menu-separator />
				@for (column of hidableColumns(); track column.id) {
					<button
						hlmDropdownMenuCheckbox
						class="capitalize"
						[checked]="column.getIsVisible()"
						(triggered)="column.toggleVisibility()"
					>
						<hlm-dropdown-menu-checkbox-indicator />
						{{ column.id }}
					</button>
				}
			</hlm-dropdown-menu>
		</ng-template>
	\`,
})
export class DataTableViewOptions {
	protected readonly table = injectTableContext();

	protected readonly hidableColumns = computed(() =>
		this.table()
			.getAllColumns()
			.filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide()),
	);
}
`;

export const viewOptionsUsageCode = `
<div class="flex items-center py-4" [tanStackTable]="table">
	<!-- filter input -->
	<app-data-table-view-options />
</div>
`;
