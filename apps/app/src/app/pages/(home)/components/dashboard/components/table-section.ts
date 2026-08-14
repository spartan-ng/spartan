import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerChevronLeft, tablerChevronRight, tablerChevronsLeft, tablerChevronsRight } from '@ng-icons/tabler-icons';
import {
	TableHeadSelection,
	TableRowSelection,
} from '@spartan-ng/app/app/pages/(components)/components/(data-table)/selection-column';
import { TableHeadSortButton } from '@spartan-ng/app/app/pages/(components)/components/(data-table)/sort-header-button';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import {
	columnFilteringFeature,
	ColumnFiltersState,
	columnVisibilityFeature,
	type ColumnVisibilityState,
	createColumnHelper,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	filterFn_arrHas,
	filterFn_includesString,
	FlexRender,
	injectTable,
	type PaginationState,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	sortFn_alphanumeric,
	sortFn_text,
	type SortingState,
	tableFeatures,
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
import { ReviewerCell } from './reviewer-cell';
import { StatusCell } from './status-cell';
import { TargetCell } from './target-cell';
import { TypeCell } from './type-cell';

const features = tableFeatures({
	columnFilteringFeature,
	columnVisibilityFeature,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	filteredRowModel: createFilteredRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	sortedRowModel: createSortedRowModel(),
	filterFns: { includesString: filterFn_includesString, arrHas: filterFn_arrHas },
	sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
});

export type DashboardFeatures = typeof features;

const columnHelper = createColumnHelper<DashboardFeatures, DashboardData>();

const columns = columnHelper.columns([
	columnHelper.display({
		id: 'select',
		header: () => TableHeadSelection,
		cell: () => TableRowSelection,
		enableHiding: false,
	}),
	columnHelper.accessor('header', {
		id: 'header',
		header: 'Header',
		cell: () => HeaderCell,
	}),
	columnHelper.accessor('type', {
		id: 'type',
		header: 'Type',
		filterFn: 'arrHas',
		cell: () => TypeCell,
	}),
	columnHelper.accessor('status', {
		id: 'status',
		header: 'Status',
		filterFn: 'arrHas',
		cell: () => StatusCell,
	}),
	columnHelper.accessor('target', {
		id: 'target',
		filterFn: 'arrHas',
		header: () => TableHeadSortButton,
		cell: () => TargetCell,
	}),
	columnHelper.accessor('limit', {
		id: 'limit',
		filterFn: 'arrHas',
		header: () => TableHeadSortButton,
		cell: () => LimitCell,
	}),
	columnHelper.accessor('reviewer', {
		id: 'reviewer',
		header: 'Reviewer',
		filterFn: 'arrHas',
		cell: () => ReviewerCell,
	}),
	columnHelper.display({
		id: 'actions',
		enableHiding: false,
		cell: () => ActionDropdown,
	}),
]);

@Component({
	selector: 'spartan-dashboard-table-section',
	imports: [
		HlmTabsImports,
		HlmTableImports,
		HlmSelectImports,
		HlmButton,
		FormsModule,
		HlmBadge,
		FlexRender,
		NgIcon,
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
							<hlm-select
								class="inline-block"
								[ngModel]="table.atoms.pagination.get().pageSize"
								(ngModelChange)="table.setPageSize($event); table.resetPageIndex()"
							>
								<hlm-select-trigger size="sm" class="mr-1 inline-flex h-8 w-fit">
									<hlm-select-value placeholder="{{ _availablePageSizes[0] }}" />
								</hlm-select-trigger>
								<hlm-select-content *hlmSelectPortal>
									<hlm-select-group>
										@for (size of _availablePageSizes; track size) {
											<hlm-select-item [value]="size">
												{{ size === 10000 ? 'All' : size }}
											</hlm-select-item>
										}
									</hlm-select-group>
								</hlm-select-content>
							</hlm-select>
						</div>

						<span hlmLabel>Page {{ table.atoms.pagination.get().pageIndex + 1 }} of {{ table.getPageCount() }}</span>

						<div class="flex space-x-1">
							<button
								size="icon-sm"
								variant="outline"
								hlmBtn
								[disabled]="!table.getCanPreviousPage()"
								(click)="table.firstPage()"
							>
								<ng-icon name="tablerChevronsLeft" />
							</button>
							<button
								size="icon-sm"
								variant="outline"
								hlmBtn
								[disabled]="!table.getCanPreviousPage()"
								(click)="table.previousPage()"
							>
								<ng-icon name="tablerChevronLeft" />
							</button>
							<button
								size="icon-sm"
								variant="outline"
								hlmBtn
								[disabled]="!table.getCanNextPage()"
								(click)="table.nextPage()"
							>
								<ng-icon name="tablerChevronRight" />
							</button>
							<button
								size="icon-sm"
								variant="outline"
								hlmBtn
								[disabled]="!table.getCanNextPage()"
								(click)="table.lastPage()"
							>
								<ng-icon name="tablerChevronsRight" />
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
	protected readonly _columns = columns;

	private readonly _localStorageService = inject(DashboardLocalStorageService);
	private readonly _visibility = signal<ColumnVisibilityState>(DEFAULT_DASHBOARD_TABLE_COLUMNS);
	private readonly _columnFilters = signal<ColumnFiltersState>([]);
	private readonly _sorting = signal<SortingState>([]);
	private readonly _pagination = signal<PaginationState>({
		pageSize: 10,
		pageIndex: 0,
	});
	protected readonly _availablePageSizes = [5, 10, 20, 10000];

	constructor() {
		const cols = this._localStorageService.getTaskTableColumns();
		this._visibility.set(cols as ColumnVisibilityState);
	}

	public readonly table = injectTable(() => ({
		features,
		columns,
		data: DASHBOARD_DATA,
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
		initialState: {
			pagination: {
				pageIndex: 0,
				pageSize: 10,
			},
		},
	}));
}
