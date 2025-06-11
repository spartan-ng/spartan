import { Component, inject, signal, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideArrowUpDown,
	lucideChevronDown,
	lucideChevronLeft,
	lucideChevronRight,
	lucideChevronsUp,
	lucideChevronUp,
	lucideCircle,
	lucideCircleCheckBig,
	lucideCircleDashed,
	lucideCircleDot,
	lucideCircleHelp,
	lucideCircleOff,
	lucideCog,
	lucideDot,
	lucideEllipsis,
	lucideLayers,
	lucideLogOut,
	lucideUser,
} from '@ng-icons/lucide';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { BrnSelectModule } from '@spartan-ng/brain/select';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonModule } from '@spartan-ng/helm/button';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { HlmMenuModule } from '@spartan-ng/helm/menu';
import { HlmSelectModule } from '@spartan-ng/helm/select';
import { HlmTableModule } from '@spartan-ng/helm/table';
import {
	ColumnDef,
	ColumnFiltersState,
	createAngularTable,
	flexRenderComponent,
	FlexRenderDirective,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	PaginationState,
	SortingState,
	VisibilityState,
} from '@tanstack/angular-table';
import {
	TableHeadSelectionComponent,
	TableRowSelectionComponent,
} from '../../../(components)/components/(data-table)/selection-column.component';
import { TableHeadSortButtonComponent } from '../../../(components)/components/(data-table)/sort-header-button.component';
import { ActionDropdownComponent } from './components/action-dropdown.component';
import { PriorityIconCellComponent } from './components/priority-icon-cell.component';
import { StatusIconCellComponent } from './components/status-icon-cell.component';
import { TableActionsComponent } from './components/table-actions.component';
import { TitleCellComponent } from './components/title-cell.component';
import { DEFAULT_TASK_TABLE_COLUMNS, LocalStorageService } from './services/local-storage.service';
import { Task, TASK_DATA } from './services/tasks.models';

@Component({
	selector: 'spartan-data-table-preview',
	imports: [
		FormsModule,
		BrnMenuTriggerDirective,
		HlmMenuModule,
		HlmTableModule,
		HlmButtonModule,
		HlmIconDirective,
		BrnSelectModule,
		HlmSelectModule,
		TableActionsComponent,
		NgIcon,
		HlmAvatarImports,
		FlexRenderDirective,
	],
	providers: [
		provideIcons({
			lucideArrowUpDown,
			lucideChevronDown,
			lucideChevronLeft,
			lucideChevronRight,
			lucideChevronUp,
			lucideChevronsUp,
			lucideCircle,
			lucideCircleCheckBig,
			lucideCircleDashed,
			lucideCircleDot,
			lucideCircleHelp,
			lucideCircleOff,
			lucideCog,
			lucideDot,
			lucideEllipsis,
			lucideLayers,
			lucideLogOut,
			lucideUser,
		}),
	],
	host: {
		class: 'w-full',
	},
	template: `
		<div class="h-full flex-1 flex-col space-y-4 p-8 py-6">
			<div class="flex items-center justify-between space-y-2">
				<div class="flex flex-col">
					<h2 class="text-2xl font-bold tracking-tight">Welcome back!</h2>
					<p class="text-muted-foreground">Here's a list of your tasks for this month!</p>
				</div>
				<hlm-avatar [brnMenuTriggerFor]="profile" align="center">
					<img src="/assets/avatar.png" alt="spartan logo. Resembling a spartanic shield" hlmAvatarImage />
					<span class="bg-destructive text-white" hlmAvatarFallback>AH</span>
				</hlm-avatar>

				<ng-template #profile>
					<hlm-menu>
						<div class="flex flex-col space-y-1" hlmMenuItem>
							<p class="text-sm font-medium leading-none">spartan</p>
							<p class="text-muted-foreground text-xs leading-none">m&#64;example.com</p>
						</div>

						<hlm-menu-separator />

						<hlm-menu-group>
							<hlm-menu-group>
								<button hlmMenuItem>
									<ng-icon hlm name="lucideUser" hlmMenuIcon />
									<span>Profile</span>
									<hlm-menu-shortcut>⇧⌘P</hlm-menu-shortcut>
								</button>

								<button hlmMenuItem>
									<ng-icon hlm name="lucideLayers" hlmMenuIcon />
									<span>Billing</span>
									<hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
								</button>

								<button hlmMenuItem>
									<ng-icon hlm name="lucideCog" hlmMenuIcon />
									<span>Settings</span>
									<hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
								</button>
							</hlm-menu-group>

							<hlm-menu-separator />

							<button hlmMenuItem>
								<ng-icon hlm name="lucideLogOut" hlmMenuIcon />
								<span>Logout</span>
								<hlm-menu-shortcut>⇧⌘Q</hlm-menu-shortcut>
							</button>
						</hlm-menu-group>
					</hlm-menu>
				</ng-template>
			</div>

			<table-actions table="table" />

			<div class="max-h-[700px] w-full overflow-auto rounded-md border">
				<table hlmTable>
					<thead hlmTHead class="bg-background sticky top-0 z-10">
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
			<div class="mt-4 flex flex-col justify-between sm:flex-row sm:items-center">
				<span class="text-muted-foreground text-sm">
					{{ table.getSelectedRowModel().rows.length }} of {{ table.getRowCount() }} row(s) selected
				</span>
				<div class="mt-2 flex sm:mt-0">
					<brn-select
						class="inline-block"
						placeholder="{{ availablePageSizes[0] }}"
						[ngModel]="table.getState().pagination.pageSize"
						(ngModelChange)="table.setPageSize($event); table.resetPageIndex()"
					>
						<hlm-select-trigger class="w-15 mr-1 inline-flex h-9">
							<hlm-select-value />
						</hlm-select-trigger>
						<hlm-select-content>
							@for (size of availablePageSizes; track size) {
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
							[disabled]="!table.getCanPreviousPage()"
							(click)="table.previousPage()"
						>
							Previous
						</button>
						<button size="sm" variant="outline" hlmBtn [disabled]="!table.getCanNextPage()" (click)="table.nextPage()">
							Next
						</button>
					</div>
				</div>
			</div>
		</div>
	`,
})
export default class TasksExamplePageComponent {
	protected readonly trackBy: TrackByFunction<Task> = (_: number, p: Task) => p.id;
	protected readonly availablePageSizes = [5, 10, 20, 10000];
	protected readonly pageSize = signal(this.availablePageSizes[1]); // default to page size 10
	private readonly _localStorageService = inject(LocalStorageService);

	constructor() {
		const cols = this._localStorageService.getTaskTableColumns();
		this._visibility.set(cols as VisibilityState);
	}

	protected readonly _columns: ColumnDef<Task>[] = [
		{
			accessorKey: 'select',
			id: 'select',
			header: () => flexRenderComponent(TableHeadSelectionComponent),
			cell: () => flexRenderComponent(TableRowSelectionComponent),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'id',
			id: 'id',
			header: () => flexRenderComponent(TableHeadSortButtonComponent),
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: 'title',
			id: 'title',
			header: () => flexRenderComponent(TableHeadSortButtonComponent),
			cell: () => flexRenderComponent(TitleCellComponent),
		},
		{
			accessorKey: 'status',
			id: 'status',
			filterFn: 'arrIncludesSome',
			header: () => flexRenderComponent(TableHeadSortButtonComponent),
			cell: () => flexRenderComponent(StatusIconCellComponent),
		},
		{
			accessorKey: 'priority',
			id: 'priority',
			filterFn: 'arrIncludesSome',
			header: () => flexRenderComponent(TableHeadSortButtonComponent),
			cell: () => flexRenderComponent(PriorityIconCellComponent),
		},
		{
			id: 'action',
			enableHiding: false,
			cell: () => flexRenderComponent(ActionDropdownComponent),
		},
	];

	private readonly _visibility = signal<VisibilityState>(DEFAULT_TASK_TABLE_COLUMNS);
	private readonly _columnFilters = signal<ColumnFiltersState>([]);
	private readonly _sorting = signal<SortingState>([]);
	private readonly _pagination = signal<PaginationState>({
		pageSize: 10,
		pageIndex: 0,
	});

	public readonly table = createAngularTable<Task>(() => ({
		data: TASK_DATA,
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
