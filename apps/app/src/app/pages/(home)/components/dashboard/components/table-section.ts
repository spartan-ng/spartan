import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerChevronLeft, tablerChevronRight, tablerChevronsLeft, tablerChevronsRight } from '@ng-icons/tabler-icons';
import {
	TableHeadSelection,
	TableRowSelection,
} from '@spartan-ng/app/app/pages/(components)/components/(data-table)/selection-column';
import { TableHeadSortButton } from '@spartan-ng/app/app/pages/(components)/components/(data-table)/sort-header-button';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
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
	VisibilityState,
} from '@tanstack/angular-table';
import {
	DashboardLocalStorageService,
	DEFAULT_DASHBOARD_TABLE_COLUMNS,
} from '../services/dashboard-local-storage.service';
import { ActionDropdown } from './action-dropdown';
import { DASHBOARD_DATA, DashboardData } from './dashboard-data.model';
import { DashboardTableActions } from './dashboard-table-action';
import { HeaderCell } from './header-cell';
import { LimitCell } from './limit-cell';
import { ReviewerCell } from './reviewer-cell copy';
import { StatusCell } from './status-cell';
import { TargetCell } from './target-cell';
import { TypeCell } from './type-cell';

@Component({
	selector: 'spartan-dashboard-table-section',
	imports: [
		HlmTabsImports,
		HlmTableImports,
		BrnSelectImports,
		HlmSelectImports,
		HlmButton,
		FormsModule,
		HlmBadge,
		FlexRender,
		NgIcon,
		HlmIcon,
		HlmLabel,
		DashboardTableActions,
	],
	providers: [
		provideIcons({ tablerChevronLeft, tablerChevronsLeft, tablerChevronRight, tablerChevronsRight }),
		DashboardLocalStorageService,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'px-6',
	},
	template: `
		<hlm-tabs tab="account" class="w-full">
			<div class="flex justify-between">
				<hlm-tabs-list
					aria-label="tabs example"
					class="**:data-[slot=badge]:bg-muted-foreground/30 hidden h-9 **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex"
				>
					<button hlmTabsTrigger="account">Outline</button>
					<button hlmTabsTrigger="past-performance">
						Past Performance
						<span hlmBadge variant="secondary">3</span>
					</button>
					<button hlmTabsTrigger="key-personnel">
						Key Personnel
						<span hlmBadge variant="secondary">2</span>
					</button>
					<button hlmTabsTrigger="focus-documents">Focus Documents</button>
				</hlm-tabs-list>
				<spartan-dashboard-table-actions table="table" />
			</div>
			<div hlmTabsContent="account">
				<div class="max-h-[700px] w-full overflow-auto rounded-md border">
					@defer {
						<div hlmTableContainer>
							<table hlmTable>
								<thead hlmTHead class="bg-muted sticky top-0 z-10">
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
								<tbody hlmTBody class="w-full">
									@for (row of table.getRowModel().rows; track row.id) {
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
				<div class="mt-4 flex flex-col justify-between sm:flex-row sm:items-center">
					<span class="text-muted-foreground text-sm">
						{{ table.getSelectedRowModel().rows.length }} of {{ table.getRowCount() }} row(s) selected
					</span>
					<div class="mt-2 flex gap-8 sm:mt-0">
						<div class="flex gap-2">
							<span hlmLabel>Row per page:</span>
							<brn-select
								class="inline-block"
								placeholder="{{ _availablePageSizes[0] }}"
								[ngModel]="table.getState().pagination.pageSize"
								(ngModelChange)="table.setPageSize($event); table.resetPageIndex()"
							>
								<hlm-select-trigger size="sm" class="mr-1 inline-flex h-8 w-fit">
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
						</div>

						<span hlmLabel>Page {{ table.getState().pagination.pageIndex + 1 }} of {{ table.getPageCount() }}</span>

						<div class="flex space-x-1">
							<button
								size="icon-sm"
								variant="outline"
								hlmBtn
								[disabled]="!table.getCanPreviousPage()"
								(click)="table.firstPage()"
							>
								<ng-icon hlm name="tablerChevronsLeft" size="sm" />
							</button>
							<button
								size="icon-sm"
								variant="outline"
								hlmBtn
								[disabled]="!table.getCanPreviousPage()"
								(click)="table.previousPage()"
							>
								<ng-icon hlm name="tablerChevronLeft" size="sm" />
							</button>
							<button
								size="icon-sm"
								variant="outline"
								hlmBtn
								[disabled]="!table.getCanNextPage()"
								(click)="table.nextPage()"
							>
								<ng-icon hlm name="tablerChevronRight" size="sm" />
							</button>
							<button
								size="icon-sm"
								variant="outline"
								hlmBtn
								[disabled]="!table.getCanNextPage()"
								(click)="table.lastPage()"
							>
								<ng-icon hlm name="tablerChevronsRight" size="sm" />
							</button>
						</div>
					</div>
				</div>
			</div>
			<div hlmTabsContent="past-performance">
				<div class="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
			</div>
			<div hlmTabsContent="key-personnel">
				<div class="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
			</div>
			<div hlmTabsContent="focus-documents">
				<div class="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
			</div>
		</hlm-tabs>
	`,
})
export class DashboardTableSection {
	private readonly _localStorageService = inject(DashboardLocalStorageService);
	private readonly _visibility = signal<VisibilityState>(DEFAULT_DASHBOARD_TABLE_COLUMNS);
	private readonly _columnFilters = signal<ColumnFiltersState>([]);
	private readonly _sorting = signal<SortingState>([]);
	private readonly _pagination = signal<PaginationState>({
		pageSize: 10,
		pageIndex: 0,
	});
	protected readonly _availablePageSizes = [5, 10, 20, 10000];
	protected readonly _columns: ColumnDef<DashboardData>[] = [
		{
			accessorKey: 'select',
			id: 'select',
			header: () => flexRenderComponent(TableHeadSelection),
			cell: () => flexRenderComponent(TableRowSelection),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'header',
			id: 'header',
			header: () => 'Header',
			cell: () => flexRenderComponent(HeaderCell),
			enableSorting: false,
		},
		{
			accessorKey: 'type',
			id: 'type',
			filterFn: 'arrIncludesSome',
			header: () => 'Type',
			cell: () => flexRenderComponent(TypeCell),
			enableSorting: false,
		},
		{
			accessorKey: 'status',
			id: 'status',
			filterFn: 'arrIncludesSome',
			header: () => 'Status',
			cell: () => flexRenderComponent(StatusCell),
			enableSorting: false,
		},
		{
			accessorKey: 'target',
			id: 'target',
			filterFn: 'arrIncludesSome',
			header: () => flexRenderComponent(TableHeadSortButton, { inputs: { header: '' } }),
			cell: () => flexRenderComponent(TargetCell),
		},
		{
			accessorKey: 'limit',
			id: 'limit',
			filterFn: 'arrIncludesSome',
			header: () => flexRenderComponent(TableHeadSortButton, { inputs: { header: '' } }),
			cell: () => flexRenderComponent(LimitCell),
		},
		{
			accessorKey: 'reviewer',
			id: 'reviewer',
			filterFn: 'arrIncludesSome',
			header: () => 'Reviewer',
			cell: () => flexRenderComponent(ReviewerCell),
			enableSorting: false,
		},
		{
			id: 'action',
			enableHiding: false,
			cell: () => flexRenderComponent(ActionDropdown),
		},
	];

	public readonly table = createAngularTable<DashboardData>(() => ({
		data: DASHBOARD_DATA,
		columns: this._columns,
		state: {
			columnFilters: this._columnFilters(),
			sorting: this._sorting(),
			pagination: this._pagination(),
			columnVisibility: this._visibility(),
		},
		onColumnVisibilityChange: (updater) => {
			updater instanceof Function ? this._visibility.update(updater) : this._visibility.set(updater);
			this._localStorageService.saveTaskTableColumns(this._visibility());
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
				pageSize: 10,
			},
		},
	}));
}
