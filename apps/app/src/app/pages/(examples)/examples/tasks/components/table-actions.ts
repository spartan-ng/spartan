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
					[state]="statusState()"
					(stateChanged)="statusStateChanged($event)"
					sideOffset="5"
					closeDelay="100"
					align="start"
				>
					<button hlmBtn brnPopoverTrigger variant="outline" size="sm" class="border-dashed">
						<ng-icon hlm name="lucideCirclePlus" class="mr-2" size="sm" />
						Status
						@if (statusFilter().length) {
							<div data-orientation="vertical" role="none" class="bg-border mx-2 h-4 w-[1px] shrink-0"></div>

							<div class="flex gap-1">
								@for (status of statusFilter(); track status) {
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
								@for (status of statuses(); track status) {
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
					[state]="priorityState()"
					(stateChanged)="priorityStateChanged($event)"
					sideOffset="5"
					closeDelay="100"
					align="start"
				>
					<button hlmBtn brnPopoverTrigger variant="outline" size="sm" class="border-dashed">
						<ng-icon hlm name="lucideCirclePlus" class="mr-2" size="sm" />
						Priority
						@if (priorityFilter().length) {
							<div data-orientation="vertical" role="none" class="bg-border mx-2 h-4 w-[1px] shrink-0"></div>

							<div class="flex gap-1">
								@for (priority of priorityFilter(); track priority) {
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
								@for (priority of priorities(); track priority) {
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

				@if (statusFilter().length || priorityFilter().length) {
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
					@for (column of hidableColumns; track column.id) {
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

	protected readonly table = this._tableComponent.table;

	protected readonly hidableColumns = this.table.getAllColumns().filter((column) => column.getCanHide());
	protected readonly statusFilter = signal<TaskStatus[]>([]);
	protected readonly statuses = signal(['Backlog', 'Todo', 'In Progress', 'Done', 'Canceled'] satisfies TaskStatus[]);
	protected readonly statusState = signal<'closed' | 'open'>('closed');

	protected readonly priorityFilter = signal<TaskPriority[]>([]);
	protected readonly priorities = signal(['Low', 'Medium', 'High', 'Critical'] satisfies TaskPriority[]);
	protected readonly priorityState = signal<'closed' | 'open'>('closed');

	protected taskFilterChange(event: Event) {
		this.table.getColumn('title')?.setFilterValue((event.target as HTMLInputElement).value);
	}

	isStatusSelected(status: TaskStatus): boolean {
		return this.statusFilter().some((s) => s === status);
	}

	statusStateChanged(state: 'open' | 'closed') {
		this.statusState.set(state);
	}

	statusSelected(status: TaskStatus): void {
		const current = this.statusFilter();
		const index = current.indexOf(status);
		if (index === -1) {
			this.statusFilter.set([...current, status]);
		} else {
			this.statusFilter.set(current.filter((s) => s !== status));
		}
		this.table.getColumn('status')?.setFilterValue(this.statusFilter());
	}

	isPrioritySelected(priority: TaskPriority): boolean {
		return this.priorityFilter().some((p) => p === priority);
	}

	priorityStateChanged(state: 'open' | 'closed') {
		this.priorityState.set(state);
	}

	prioritySelected(priority: TaskPriority): void {
		const current = this.priorityFilter();
		const index = current.indexOf(priority);
		if (index === -1) {
			this.priorityFilter.set([...current, priority]);
		} else {
			this.priorityFilter.set(current.filter((p) => p !== priority));
		}
		this.table.getColumn('priority')?.setFilterValue(this.priorityFilter());
	}

	resetFilters(): void {
		this.priorityFilter.set([]);
		this.statusFilter.set([]);
		this.table.resetColumnFilters();
	}
}
