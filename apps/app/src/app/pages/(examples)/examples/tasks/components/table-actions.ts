import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideCheck,
	lucideChevronDown,
	lucideChevronLeft,
	lucideChevronsUp,
	lucideChevronUp,
	lucideCircle,
	lucideCircleCheckBig,
	lucideCircleDashed,
	lucideCircleDot,
	lucideCircleHelp,
	lucideCircleOff,
	lucideCirclePlus,
	lucideGlobe,
	lucideMicVocal,
	lucideSearch,
	lucideSettings2,
	lucideX,
} from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnMenuTrigger } from '@spartan-ng/brain/menu';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmMenu, HlmMenuItemImports } from '@spartan-ng/helm/menu';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import TasksExamplePage from '../(tasks).page';
import { PriorityIconPipe } from '../pipes/priority-icon.pipe';
import { StatusIconPipe } from '../pipes/status-icon.pipe';
import { TaskPriority, TaskStatus } from '../services/tasks.models';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'table-actions',
	host: {
		class: 'block',
	},
	imports: [
		HlmButton,
		FormsModule,
		HlmInput,
		BrnMenuTrigger,
		NgIcon,
		HlmIcon,
		HlmMenu,
		HlmMenuItemImports,
		BrnPopoverImports,
		HlmCommandImports,
		BrnCommandImports,
		HlmPopoverImports,
		HlmCheckboxImports,
		PriorityIconPipe,
		StatusIconPipe,
	],
	providers: [
		provideIcons({
			lucideCheck,
			lucideChevronDown,
			lucideChevronLeft,
			lucideChevronUp,
			lucideChevronsUp,
			lucideCircle,
			lucideCircleCheckBig,
			lucideCircleDashed,
			lucideCircleDot,
			lucideCircleHelp,
			lucideCircleOff,
			lucideCirclePlus,
			lucideGlobe,
			lucideMicVocal,
			lucideSearch,
			lucideSettings2,
			lucideX,
		}),
	],
	template: `
		<div class="wip-table-search flex flex-col justify-between gap-4 sm:flex-row">
			<div class="flex flex-col justify-between gap-4 sm:flex-row">
				<!-- TASK TITLE FILTER -->
				<input
					hlmInput
					size="sm"
					class="w-full md:w-80"
					placeholder="Filter tasks..."
					(input)="taskFilterChange($event)"
				/>

				<!-- STATUS FILTER -->
				<brn-popover
					[state]="_statusState()"
					(stateChanged)="statusStateChanged($event)"
					sideOffset="5"
					closeDelay="100"
					align="start"
				>
					<button hlmBtn brnPopoverTrigger variant="outline" size="sm" class="border-dashed">
						<ng-icon hlm name="lucideCirclePlus" class="mr-2" size="sm" />
						Status
						@if (_statusFilter().length) {
							<div data-orientation="vertical" role="none" class="bg-border mx-2 h-4 w-[1px] shrink-0"></div>

							<div class="flex gap-1">
								@for (status of _statusFilter(); track status) {
									<span class="bg-secondary text-secondary-foreground rounded px-1 py-0.5 text-xs">
										{{ status }}
									</span>
								}
							</div>
						}
					</button>
					<hlm-command *brnPopoverContent="let ctx" hlmPopoverContent class="w-[200px] p-0">
						<hlm-command-search>
							<ng-icon hlm name="lucideSearch" class="text-muted-foreground" />
							<input placeholder="Status" hlm-command-search-input />
						</hlm-command-search>
						<div *brnCommandEmpty hlmCommandEmpty>No results found.</div>
						<hlm-command-list>
							<hlm-command-group>
								@for (status of _statuses(); track status) {
									<button hlm-command-item [value]="status" (selected)="statusSelected(status)">
										<hlm-checkbox class="mr-2" [checked]="isStatusSelected(status)" />

										<ng-icon hlm [name]="status | statusIcon" class="text-muted-foreground mx-2" size="sm" />
										{{ status }}
									</button>
								}
							</hlm-command-group>
						</hlm-command-list>
					</hlm-command>
				</brn-popover>

				<!-- PRIORITY FILTER -->
				<brn-popover
					[state]="_priorityState()"
					(stateChanged)="priorityStateChanged($event)"
					sideOffset="5"
					closeDelay="100"
					align="start"
				>
					<button hlmBtn brnPopoverTrigger variant="outline" size="sm" class="border-dashed">
						<ng-icon hlm name="lucideCirclePlus" class="mr-2" size="sm" />
						Priority
						@if (_priorityFilter().length) {
							<div data-orientation="vertical" role="none" class="bg-border mx-2 h-4 w-[1px] shrink-0"></div>

							<div class="flex gap-1">
								@for (priority of _priorityFilter(); track priority) {
									<span class="bg-secondary text-secondary-foreground rounded px-1 py-0.5 text-xs">
										{{ priority }}
									</span>
								}
							</div>
						}
					</button>
					<hlm-command *brnPopoverContent="let ctx" hlmPopoverContent class="w-[200px] p-0">
						<hlm-command-search>
							<ng-icon hlm name="lucideSearch" class="text-muted-foreground" />
							<input placeholder="Priority" hlm-command-search-input />
						</hlm-command-search>
						<div *brnCommandEmpty hlmCommandEmpty>No results found.</div>
						<hlm-command-list>
							<hlm-command-group>
								@for (priority of _priorities(); track priority) {
									<button hlm-command-item [value]="priority" (selected)="prioritySelected(priority)">
										<hlm-checkbox class="mr-2" [checked]="isPrioritySelected(priority)" />

										<ng-icon hlm [name]="priority | priorityIcon" class="text-muted-foreground mx-2" size="sm" />
										{{ priority }}
									</button>
								}
							</hlm-command-group>
						</hlm-command-list>
					</hlm-command>
				</brn-popover>

				@if (_statusFilter().length || _priorityFilter().length) {
					<button hlmBtn variant="ghost" size="sm" align="end" (click)="resetFilters()">
						Reset
						<ng-icon hlm name="lucideX" class="ml-2" size="sm" />
					</button>
				}
			</div>

			<!-- Column visibility -->
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
	`,
})
export class TableActions {
	private readonly _tableComponent = inject(TasksExamplePage);

	protected readonly _table = this._tableComponent.table;

	protected readonly _hidableColumns = this._table.getAllColumns().filter((column) => column.getCanHide());
	protected readonly _statusFilter = signal<TaskStatus[]>([]);
	protected readonly _statuses = signal(['Backlog', 'Todo', 'In Progress', 'Done', 'Canceled'] satisfies TaskStatus[]);
	protected readonly _statusState = signal<'closed' | 'open'>('closed');

	protected readonly _priorityFilter = signal<TaskPriority[]>([]);
	protected readonly _priorities = signal(['Low', 'Medium', 'High', 'Critical'] satisfies TaskPriority[]);
	protected readonly _priorityState = signal<'closed' | 'open'>('closed');

	protected taskFilterChange(event: Event) {
		this._table.getColumn('title')?.setFilterValue((event.target as HTMLInputElement).value);
	}

	isStatusSelected(status: TaskStatus): boolean {
		return this._statusFilter().some((s) => s === status);
	}

	statusStateChanged(state: 'open' | 'closed') {
		this._statusState.set(state);
	}

	statusSelected(status: TaskStatus): void {
		const current = this._statusFilter();
		const index = current.indexOf(status);
		if (index === -1) {
			this._statusFilter.set([...current, status]);
		} else {
			this._statusFilter.set(current.filter((s) => s !== status));
		}
		this._table.getColumn('status')?.setFilterValue(this._statusFilter());
	}

	isPrioritySelected(priority: TaskPriority): boolean {
		return this._priorityFilter().some((p) => p === priority);
	}

	priorityStateChanged(state: 'open' | 'closed') {
		this._priorityState.set(state);
	}

	prioritySelected(priority: TaskPriority): void {
		const current = this._priorityFilter();
		const index = current.indexOf(priority);
		if (index === -1) {
			this._priorityFilter.set([...current, priority]);
		} else {
			this._priorityFilter.set(current.filter((p) => p !== priority));
		}
		this._table.getColumn('priority')?.setFilterValue(this._priorityFilter());
	}

	resetFilters(): void {
		this._priorityFilter.set([]);
		this._statusFilter.set([]);
		this._table.resetColumnFilters();
	}
}
