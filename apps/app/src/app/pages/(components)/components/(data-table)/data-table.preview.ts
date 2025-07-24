import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnMenuTrigger } from '@spartan-ng/brain/menu';
import { BrnSelectModule } from '@spartan-ng/brain/select';
import { HlmButtonModule } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmMenuModule } from '@spartan-ng/helm/menu';
import { HlmSelectModule } from '@spartan-ng/helm/select';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { hlmMuted } from '@spartan-ng/helm/typography';
import {
	ColumnDef,
	ColumnFiltersState,
	createAngularTable,
	FlexRender,
	flexRenderComponent,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	PaginationState,
	SortingState,
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
		FlexRender,
		FormsModule,
		BrnMenuTrigger,
		HlmMenuModule,
		HlmButtonModule,
		NgIcon,
		HlmIcon,
		HlmInput,
		BrnSelectModule,
		HlmSelectModule,
		...HlmTableImports,
	],
	providers: [provideIcons({ lucideChevronDown })],
	host: {
		class: 'w-full',
	},
	template: `
		<div class="flex flex-col justify-between gap-4 sm:flex-row">
			<input hlmInput class="w-full md:w-80" placeholder="Filter emails..." (input)="_filterChanged($event)" />

			<button hlmBtn variant="outline" align="end" [brnMenuTriggerFor]="menu">
				Columns
				<ng-icon hlm name="lucideChevronDown" class="ml-2" size="sm" />
			</button>
			<ng-template #menu>
				<hlm-menu class="w-32">
					@for (column of _hidableColumns; track column.id) {
						<button
							hlmMenuItemCheckbox
							class="capitalize"
							[checked]="column.getIsVisible()"
							(triggered)="column.toggleVisibility()"
						>
							<hlm-menu-item-check />
							{{ column.columnDef.id }}
						</button>
					}
				</hlm-menu>
			</ng-template>
		</div>
		<div class="border-border mt-4 block h-[18rem] w-full overflow-auto rounded-md border">
			<!-- we defer the loading of the table, because tanstack manipulates the DOM with flexRender which can cause errors during SSR -->
			@defer {
				<table hlmTable class="w-full">
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
					<tbody hlmTBody class="w-full">
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
			}
		</div>

		<div class="mt-4 flex flex-col justify-between sm:flex-row sm:items-center">
			@if (_table.getRowCount() > 0) {
				<span class="${hlmMuted} text-sm">
					{{ _table.getSelectedRowModel().rows.length }} of {{ _table.getRowCount() }} row(s) selected
				</span>
				<div class="mt-2 flex sm:mt-0">
					<brn-select
						class="inline-block"
						[ngModel]="_table.getState().pagination.pageSize"
						(ngModelChange)="_table.setPageSize($event); _table.resetPageIndex()"
					>
						<hlm-select-trigger class="w-15 mr-1 inline-flex h-9">
							<hlm-select-value />
						</hlm-select-trigger>
						<hlm-select-content>
							@for (size of _availablePageSizes; track size) {
								<hlm-option [value]="size">
									{{ size === 10000 ? 'All' : size }}
								</hlm-option>
							}
						</hlm-select-content>
					</brn-select>

					<div class="flex space-x-1">
						<button
							size="sm"
							variant="outline"
							hlmBtn
							[disabled]="!_table.getCanPreviousPage()"
							(click)="_table.previousPage()"
						>
							Previous
						</button>
						<button
							size="sm"
							variant="outline"
							hlmBtn
							[disabled]="!_table.getCanNextPage()"
							(click)="_table.nextPage()"
						>
							Next
						</button>
					</div>
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
	protected readonly _availablePageSizes = [5, 10, 20, 10000];

	protected _filterChanged(event: Event) {
		this._table.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value);
	}

	protected readonly _columns: ColumnDef<Payment>[] = [
		{
			accessorKey: 'select',
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
			cell: (info) => `<span class="capitalize">${info.getValue<string>()}</span>`,
			enableSorting: false,
		},
		{
			accessorKey: 'email',
			id: 'email',
			header: () => flexRenderComponent(TableHeadSortButton, { inputs: { header: '' } }),
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
			id: 'action',
			enableHiding: false,
			cell: () => flexRenderComponent(ActionDropdown),
		},
	];

	private readonly _columnFilters = signal<ColumnFiltersState>([]);
	private readonly _sorting = signal<SortingState>([]);
	private readonly _pagination = signal<PaginationState>({
		pageSize: 5,
		pageIndex: 0,
	});

	protected readonly _table = createAngularTable<Payment>(() => ({
		data: PAYMENT_DATA,
		columns: this._columns,
		state: {
			columnFilters: this._columnFilters(),
			sorting: this._sorting(),
			pagination: this._pagination(),
		},
		onColumnFiltersChange: (updater) => {
			updater instanceof Function ? this._columnFilters.update(updater) : this._columnFilters.set(updater);
		},
		onSortingChange: (updater) => {
			updater instanceof Function ? this._sorting.update(updater) : this._sorting.set(updater);
		},
		onPaginationChange: (updater) => {
			updater instanceof Function ? this._pagination.update(updater) : this._pagination.set(updater);
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: {
				pageSize: 5,
			},
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
	{
		id: 'p0r8sd2f',
		amount: 123,
		status: 'failed',
		email: 'john.doe@example.com',
	},
	{
		id: '8uyv3n1x',
		amount: 589,
		status: 'processing',
		email: 'emma.smith@gmail.com',
	},
	{
		id: '2zqo6ptr',
		amount: 456,
		status: 'success',
		email: 'jackson78@hotmail.com',
	},
	{
		id: 'l7we9a3m',
		amount: 632,
		status: 'success',
		email: 'grace_22@yahoo.com',
	},
	{
		id: 'o9p2v3qk',
		amount: 987,
		status: 'failed',
		email: 'robert.adams@gmail.com',
	},
	{
		id: 'q1o8r7mz',
		amount: 321,
		status: 'processing',
		email: 'alexander34@gmail.com',
	},
	{
		id: 'i5n3s0tv',
		amount: 555,
		status: 'failed',
		email: 'olivia_morris@hotmail.com',
	},
	{
		id: '3xr7s2nl',
		amount: 789,
		status: 'success',
		email: 'michael_cole@yahoo.com',
	},
	{
		id: 'u9v2p1qy',
		amount: 234,
		status: 'success',
		email: 'lily.jones@gmail.com',
	},
	{
		id: 'b4q0e1cp',
		amount: 876,
		status: 'failed',
		email: 'ryan_14@hotmail.com',
	},
	{
		id: 's1z8m7op',
		amount: 456,
		status: 'success',
		email: 'sophia.green@gmail.com',
	},
	{
		id: 'n5a3v0lt',
		amount: 987,
		status: 'failed',
		email: 'david.miller@yahoo.com',
	},
	{
		id: '2qr7v9sm',
		amount: 654,
		status: 'processing',
		email: 'emma_jones@hotmail.com',
	},
	{
		id: 'y9b2h8qq',
		amount: 789,
		status: 'success',
		email: 'jacob_89@gmail.com',
	},
	{
		id: 'c4a0r1xp',
		amount: 123,
		status: 'failed',
		email: 'samantha.richards@yahoo.com',
	},
];
