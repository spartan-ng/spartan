import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideCheck,
	lucideChevronsDown,
	lucideChevronsLeft,
	lucideChevronsUp,
	lucideCircleHelp,
	lucideCirclePlus,
	lucideGlobe,
	lucideMicVocal,
	lucideSearch,
	lucideSettings2,
	lucideX,
} from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmCheckboxImports } from '@spartan-ng/ui-checkbox-helm';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmMenuComponent, HlmMenuItemImports, HlmMenuStructureImports } from '@spartan-ng/ui-menu-helm';
import { HlmPopoverImports } from '@spartan-ng/ui-popover-helm';
import { LocalStorageService } from '../services/local-storage.service';
import { TaskPriority, TasksService } from '../services/tasks.service';
import { PriorityPipe } from './priority.pipe';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'table-actions',
	standalone: true,
	host: {
		class: 'block',
	},
	imports: [
		HlmButtonDirective,
		FormsModule,
		HlmInputDirective,
		BrnMenuTriggerDirective,
		NgIcon,
		HlmIconDirective,
		HlmMenuComponent,
		HlmMenuItemImports,
		HlmMenuStructureImports,
		BrnPopoverImports,
		HlmCommandImports,
		BrnCommandImports,
		HlmPopoverImports,
		HlmCheckboxImports,
		PriorityPipe,
	],
	providers: [
		provideIcons({
			lucideMicVocal,
			lucideGlobe,
			lucideSettings2,
			lucideCirclePlus,
			lucideCheck,
			lucideChevronsDown,
			lucideChevronsLeft,
			lucideChevronsUp,
			lucideCircleHelp,
			lucideSearch,
			lucideX,
		}),
	],
	template: `
		<div class="wip-table-search flex flex-col justify-between gap-4 sm:flex-row">
			<div class="flex flex-col justify-between gap-4 sm:flex-row">
				<input
					hlmInput
					size="sm"
					class="w-full md:w-80"
					placeholder="Filter tasks..."
					[ngModel]="taskFilter()"
					(ngModelChange)="rawFilterInput.set($event)"
				/>

				<button hlmBtn variant="outline" size="sm" align="end" class="border-dashed" [brnMenuTriggerFor]="status">
					<ng-icon hlm name="lucideCirclePlus" class="mr-2" size="sm" />
					Status
				</button>
				<ng-template #status>
					<hlm-menu variant="menubar" class="w-48">
						<hlm-menu-group>
							<button inset hlmMenuItem>Show Playing Next</button>
							<button hlmMenuItemCheckbox checked>
								<hlm-menu-item-check />
								Show Lyrics
							</button>
							<hlm-menu-separator />

							<button inset hlmMenuItem disabled>Show Status Bar</button>
							<hlm-menu-separator />

							<button inset hlmMenuItem>Hide Sidebar</button>
							<button inset hlmMenuItem disabled>Enter Full Screen</button>
						</hlm-menu-group>
					</hlm-menu>
				</ng-template>

				<brn-popover
					[state]="priorityState()"
					(stateChanged)="priorityStateChanged($event)"
					sideOffset="5"
					closeDelay="100"
					align="start"
				>
					<button
						hlmBtn
						brnPopoverTrigger
						variant="outline"
						size="sm"
						class="border-dashed"
						[brnMenuTriggerFor]="status"
					>
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
							<ng-icon hlm name="lucideSearch" />
							<input placeholder="Priority" hlm-command-search-input />
						</hlm-command-search>
						<div *brnCommandEmpty hlmCommandEmpty>No results found.</div>
						<hlm-command-list>
							<hlm-command-group>
								@for (priority of priorities(); track priority) {
									<button hlm-command-item [value]="priority" (selected)="prioritySelected(priority)">
										<hlm-checkbox class="mr-2" [checked]="isPrioritySelected(priority)" />

										<ng-icon hlm [name]="priority | priorityIcon" color="gray" class="mx-2" size="sm" />
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

			<button hlmBtn variant="outline" size="sm" align="end" [brnMenuTriggerFor]="menu">
				<ng-icon hlm name="lucideSettings2" class="mr-2" size="sm" />
				View
			</button>
			<ng-template #menu>
				<hlm-menu class="w-32">
					@for (column of columnManager.allColumns; track column.name) {
						<button
							hlmMenuItemCheckbox
							[disabled]="columnManager.isColumnDisabled(column.name)"
							[checked]="columnManager.isColumnVisible(column.name)"
							(triggered)="onColumnFilterChanged(column.name)"
						>
							<hlm-menu-item-check />
							<span>{{ column.label }}</span>
						</button>
					}
				</hlm-menu>
			</ng-template>
		</div>
	`,
})
export class TableActionsComponent {
	private readonly _tasksService = inject(TasksService);
	private readonly _localStorageService = inject(LocalStorageService);

	protected readonly columnManager = this._tasksService.getColumnManager();
	protected readonly taskFilter = this._tasksService.getTaskFilter();
	protected readonly rawFilterInput = this._tasksService.getRawFilterInput();
	protected readonly statusFilter = this._tasksService.getStatusFilter();
	protected readonly priorityFilter = this._tasksService.getPriorityFilter();
	protected readonly priorities = signal(['Low', 'Medium', 'High'] satisfies TaskPriority[]);
	protected readonly priorityState = signal<'closed' | 'open'>('closed');

	onColumnFilterChanged(columnName: string): void {
		this.columnManager.toggleVisibility(columnName as any);
		const isVisible = this.columnManager.isColumnVisible(columnName);
		if (isVisible) {
			this._localStorageService.saveTaskTableColumn(columnName);
		} else {
			this._localStorageService.deleteTaskTableColumn(columnName);
		}
	}

	isPrioritySelected(priority: string): boolean {
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
	}

	resetFilters(): void {
		this._tasksService.resetFilters();
	}
}
