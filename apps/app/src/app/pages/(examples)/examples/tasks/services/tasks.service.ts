import { SelectionModel } from '@angular/cdk/collections';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { useBrnColumnManager } from '@spartan-ng/brain/table';
import { debounceTime, map } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';

@Injectable({
	providedIn: 'root',
})
export class TasksService {
	private readonly _localStorageService = inject(LocalStorageService);

	protected readonly _rawFilterInput = signal('');
	protected readonly _taskFilter = signal('');
	protected readonly _statusFilter = signal<TaskStatus[]>([]);
	protected readonly _priorityFilter = signal<TaskPriority[]>([]);
	private readonly _debouncedFilter = toSignal(toObservable(this._rawFilterInput).pipe(debounceTime(300)));
	protected readonly _brnColumnManager = useBrnColumnManager({
		id: { visible: false, label: 'Id' },
		title: { visible: false, label: 'Title' },
		status: { visible: false, label: 'Status' },
		priority: { visible: false, label: 'Priority' },
	});
	protected readonly _allDisplayedColumns = computed(() => [
		'select',
		...this._brnColumnManager.displayedColumns(),
		'actions',
	]);

	private readonly _displayedIndices = signal({ start: 0, end: 0 });

	private readonly _selectionModel = new SelectionModel<Task>(true);
	protected readonly _selected = toSignal(this._selectionModel.changed.pipe(map((change) => change.source.selected)), {
		initialValue: [],
	});

	private readonly _tasks = signal(TASK_DATA);

	public readonly _filteredTasks = computed(() => {
		let tasks = this._tasks();
		const taskFilter = this._taskFilter()?.trim()?.toLowerCase();
		const statusFilter = this._statusFilter();
		const priorityFilter = this._priorityFilter();

		// status filter
		if (statusFilter.length) {
			tasks = tasks.filter((a) => statusFilter.includes(a.status));
		}

		// priority filter
		if (priorityFilter.length) {
			tasks = tasks.filter((a) => priorityFilter.includes(a.priority));
		}

		// search filter
		if (taskFilter && taskFilter.length > 0) {
			tasks = tasks.filter(
				(a) => a.title.toLowerCase().includes(taskFilter) || a.id.toLowerCase().includes(taskFilter),
			);
		}
		return tasks;
	});

	private readonly _taskSort = signal<'ASC' | 'DESC' | null>(null);
	private readonly _taskSortColumn = signal<SortingColumns>('status');

	protected readonly _filteredSortedPaginatedTasks = computed(() => {
		const sort = this._taskSort();
		const start = this._displayedIndices().start;
		const end = this._displayedIndices().end + 1;
		const tasks = this._filteredTasks();
		const sortColumn = this._taskSortColumn();
		return [...tasks]
			.sort((a1, a2) => {
				const value1 = a1[sortColumn];
				const value2 = a2[sortColumn];
				if (typeof value1 === 'number' && typeof value2 === 'number') {
					return (sort === 'ASC' ? 1 : -1) * (value1 - value2);
				} else if (typeof value1 === 'string' && typeof value2 === 'string') {
					return (sort === 'ASC' ? 1 : -1) * value1.localeCompare(value2);
				} else {
					throw new Error(`Unsupported sorting type: ${typeof value1}`);
				}
			})
			.slice(start, end);
	});
	protected readonly _allFilteredPaginatedTasksSelected = computed(() =>
		this._filteredSortedPaginatedTasks().every((task: Task) => this._selected().includes(task)),
	);
	protected readonly _checkboxState = computed(() => {
		const noneSelected = this._selected().length === 0;
		const allSelectedOrIndeterminate = this._allFilteredPaginatedTasksSelected() ? true : 'indeterminate';
		return noneSelected ? false : allSelectedOrIndeterminate;
	});

	constructor() {
		// needed to sync the debounced filter to the name filter, but being able to override the
		// filter when loading new users without debounce
		effect(() => this._taskFilter.set(this._debouncedFilter() ?? ''), { allowSignalWrites: true });
		const columnSettings = this._localStorageService.getTaskTableColumns();
		for (const column of columnSettings) {
			this._brnColumnManager.setVisible(column as any);
		}
	}

	isTaskSelected(task: Task) {
		return this._selectionModel.isSelected(task);
	}

	toggleTask(task: Task) {
		this._selectionModel.toggle(task);
	}

	handleHeaderCheckboxChange() {
		const previousCbState = this._checkboxState();
		if (previousCbState === 'indeterminate' || !previousCbState) {
			this._selectionModel.select(...this._filteredSortedPaginatedTasks());
		} else {
			this._selectionModel.deselect(...this._filteredSortedPaginatedTasks());
		}
	}

	handleTaskSortChange(column: SortingColumns) {
		this._taskSortColumn.set(column);
		const sort = this._taskSort();
		if (sort === 'ASC') {
			this._taskSort.set('DESC');
		} else if (sort === 'DESC') {
			this._taskSort.set(null);
		} else {
			this._taskSort.set('ASC');
		}
	}

	getColumnManager() {
		return this._brnColumnManager;
	}

	getTaskFilter() {
		return this._taskFilter;
	}

	getRawFilterInput() {
		return this._rawFilterInput;
	}

	getStatusFilter() {
		return this._statusFilter;
	}

	getPriorityFilter() {
		return this._priorityFilter;
	}

	getAllDisplayedColumns() {
		return this._allDisplayedColumns;
	}

	getSelected() {
		return this._selected;
	}

	getFilteredSortedPaginatedTasks() {
		return this._filteredSortedPaginatedTasks;
	}

	getCheckboxState() {
		return this._checkboxState;
	}

	setDisplayedIndices(startIndex: number, endIndex: number) {
		this._displayedIndices.set({ start: startIndex, end: endIndex });
	}
}

export type SortingColumns = 'id' | 'title' | 'status' | 'priority';
type TaskStatus = 'Todo' | 'In Progress' | 'Backlog' | 'Canceled' | 'Done';
type TaskPriority = 'High' | 'Medium' | 'Low';

export type Task = {
	id: string;
	title: string;
	status: TaskStatus;
	priority: TaskPriority;
};

const TASK_DATA: Task[] = [
	{
		id: 'TASK-8782',
		title: "You can't compress the program without quantifying the open-source SSD",
		status: 'In Progress',
		priority: 'Medium',
	},
	{
		id: 'TASK-7878',
		title: 'Try to calculate the EXE feed, maybe it will index the multi-byte pixel!',
		status: 'Backlog',
		priority: 'Medium',
	},
	{
		id: 'TASK-7839',
		title: 'We need to bypass the neural TCP card!',
		status: 'Todo',
		priority: 'High',
	},
	{
		id: 'TASK-5562',
		title: 'The SAS interface is down, bypass the open-source pixel so we can back',
		status: 'Backlog',
		priority: 'Medium',
	},
	{
		id: 'TASK-8686',
		title: "I'll parse the wireless SSL protocol, that should driver the API panel!",
		status: 'Canceled',
		priority: 'Medium',
	},
	{
		id: 'TASK-1280',
		title: 'Use the digital TLS panel, then you can transmit the haptic system!',
		status: 'Done',
		priority: 'High',
	},
	{
		id: 'TASK-7262',
		title: 'The UTF8 application is down, parse the neural bandwidth so we can back',
		status: 'Done',
		priority: 'High',
	},
	{
		id: 'TASK-1138',
		title: "Generating the driver won't do anything, we need to quantify the 1080p S",
		status: 'In Progress',
		priority: 'Medium',
	},
	{
		id: 'TASK-7184',
		title: 'We need to program the back-end THX pixel!',
		status: 'Todo',
		priority: 'Low',
	},
	{
		id: 'TASK-5160',
		title: "Calculating the bus won't do anything, we need to navigate the back-end",
		status: 'In Progress',
		priority: 'High',
	},
];
