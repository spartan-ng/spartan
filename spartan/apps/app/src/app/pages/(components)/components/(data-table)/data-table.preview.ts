import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { hlmMuted } from '@spartan-ng/helm/typography';
import {
	type ColumnDef,
	type ColumnFiltersState,
	createAngularTable,
	flexRenderComponent,
	FlexRenderDirective,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type RowSelectionState,
	type SortingState,
	type VisibilityState,
} from '@tanstack/angular-table';
import { ActionDropdown } from './action-dropdown';
import { TableHeadSelection, TableRowSelection } from './selection-column';
import { TableHeadSortButton } from './sort-header-button';

export type Payment = {
	id: string;
	amount: number;
	status: 'pending' | 'processing' | 'success' | 'failed';
	email: string;
};

@Component({
	selector: 'spartan-data-table-preview',
	imports: [
		FlexRenderDirective,
		FormsModule,
		HlmDropdownMenuImports,
		HlmButtonImports,
		NgIcon,
		HlmIconImports,
		HlmInputImports,
		BrnSelectImports,
		HlmSelectImports,
		HlmTableImports,
	],
	providers: [provideIcons({ lucideChevronDown })],
	host: {
		class: 'w-full',
	},
	template: `
		<div class="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center">
			<input hlmInput class="w-full md:w-80" placeholder="Filter emails..." (input)="_filterChanged($event)" />

			<button hlmBtn variant="outline" align="end" [hlmDropdownMenuTrigger]="menu">
				Columns
				<ng-icon hlm name="lucideChevronDown" class="ml-2" size="sm" />
			</button>
			<ng-template #menu>
				<hlm-dropdown-menu class="w-32">
					@for (column of _hidableColumns; track column.id) {
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
			<!-- we defer the loading of the table, because tanstack manipulates the DOM with flexRender which can cause errors during SSR -->
			@defer {
				<div hlmTableContainer>
					<table hlmTable>
						<thead hlmTHead>
							@for (headerGroup of _table.getHeaderGroups(); track headerGroup.id) {
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
							@for (row of _table.getRowModel().rows; track row.id) {
								<tr hlmTr [attr.key]="row.id" [attr.data-state]="row.getIsSelected() && 'selected'">
									@for (cell of row.getVisibleCells(); track $index) {
										<td hlmTd>
											<ng-container *flexRender="cell.column.columnDef.cell; props: cell.getContext(); let cell">
												<div [innerHTML]="cell"></div>
											</ng-container>
										</td>
									}
								</tr>
							} @empty {
								<tr hlmTr>
									<td hlmTd class="h-24 text-center" [attr.colspan]="_columns.length">No results.</td>
								</tr>
							}
						</tbody>
					</table>
				</div>
			}
		</div>

		<div class="flex flex-col justify-between py-4 sm:flex-row sm:items-center">
			@if (_table.getRowCount() > 0) {
				<div class="${hlmMuted}">
					{{ _table.getSelectedRowModel().rows.length }} of {{ _table.getRowCount() }} row(s) selected
				</div>
				<div class="mt-2 flex space-x-2 sm:mt-0">
					<button
						size="sm"
						variant="outline"
						hlmBtn
						[disabled]="!_table.getCanPreviousPage()"
						(click)="_table.previousPage()"
					>
						Previous
					</button>
					<button size="sm" variant="outline" hlmBtn [disabled]="!_table.getCanNextPage()" (click)="_table.nextPage()">
						Next
					</button>
				</div>
			} @else {
				<div class="flex h-full w-full items-center justify-center">
					<div class="text-muted-foreground text-sm">No Data</div>
				</div>
			}
		</div>
	`,
})
export class DataTablePreview {
	protected _filterChanged(event: Event) {
		this._table.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value);
	}

	protected readonly _columns: ColumnDef<Payment>[] = [
		{
			id: 'select',
			header: () => flexRenderComponent(TableHeadSelection),
			cell: () => flexRenderComponent(TableRowSelection),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'status',
			id: 'status',
			header: 'Status',
			enableSorting: false,
			cell: (info) => `<span class="capitalize">${info.getValue<string>()}</span>`,
		},
		{
			accessorKey: 'email',
			id: 'email',
			header: () => flexRenderComponent(TableHeadSortButton, { inputs: { header: '' } }),
			cell: (info) => `<div class="lowercase">${info.getValue<string>()}</div>`,
		},
		{
			accessorKey: 'amount',
			id: 'amount',
			header: '<div class="text-right">Amount</div>',
			enableSorting: false,
			cell: (info) => {
				const amount = parseFloat(info.getValue<string>());
				const formatted = new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(amount);

				return `<div class="text-right">${formatted}</div>`;
			},
		},
		{
			id: 'actions',
			enableHiding: false,
			cell: () => flexRenderComponent(ActionDropdown),
		},
	];

	private readonly _columnFilters = signal<ColumnFiltersState>([]);
	private readonly _sorting = signal<SortingState>([]);
	private readonly _rowSelection = signal<RowSelectionState>({});
	private readonly _columnVisibility = signal<VisibilityState>({});

	protected readonly _table = createAngularTable<Payment>(() => ({
		data: PAYMENT_DATA,
		columns: this._columns,
		onSortingChange: (updater) => {
			updater instanceof Function ? this._sorting.update(updater) : this._sorting.set(updater);
		},
		onColumnFiltersChange: (updater) => {
			updater instanceof Function ? this._columnFilters.update(updater) : this._columnFilters.set(updater);
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: (updater) => {
			updater instanceof Function ? this._columnVisibility.update(updater) : this._columnVisibility.set(updater);
		},
		onRowSelectionChange: (updater) => {
			updater instanceof Function ? this._rowSelection.update(updater) : this._rowSelection.set(updater);
		},
		state: {
			sorting: this._sorting(),
			columnFilters: this._columnFilters(),
			columnVisibility: this._columnVisibility(),
			rowSelection: this._rowSelection(),
		},
	}));
	protected readonly _hidableColumns = this._table.getAllColumns().filter((column) => column.getCanHide());

	protected _filterChange(email: Event) {
		const target = email.target as HTMLInputElement;
		const typedValue = target.value;
		this._table.setGlobalFilter(typedValue);
	}
}

const PAYMENT_DATA: Payment[] = [
	{
		id: 'm5gr84i9',
		amount: 316,
		status: 'success',
		email: 'ken99@yahoo.com',
	},
	{
		id: '3u1reuv4',
		amount: 242,
		status: 'success',
		email: 'Abe45@gmail.com',
	},
	{
		id: 'derv1ws0',
		amount: 837,
		status: 'processing',
		email: 'Monserrat44@gmail.com',
	},
	{
		id: '5kma53ae',
		amount: 874,
		status: 'success',
		email: 'Silas22@gmail.com',
	},
	{
		id: 'bhqecj4p',
		amount: 721,
		status: 'failed',
		email: 'carmella@hotmail.com',
	},
];
