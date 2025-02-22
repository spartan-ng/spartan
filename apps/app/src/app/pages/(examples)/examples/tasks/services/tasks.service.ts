import { SelectionModel } from '@angular/cdk/collections';
import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
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
	private readonly _taskSortColumn = signal<SortingColumns | null>(null);

	protected readonly _filteredSortedPaginatedTasks = computed(() => {
		const sort = this._taskSort();
		const start = this._displayedIndices().start;
		const end = this._displayedIndices().end + 1;
		const tasks = this._filteredTasks();
		const sortColumn = this._taskSortColumn();
		return [...tasks]
			.sort((a1, a2) => {
				if (!sortColumn) return 0;
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
		effect(() => {
			const debouncedFilter = this._debouncedFilter();
			untracked(() => this._taskFilter.set(debouncedFilter ?? ''));
		});
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

	resetFilters() {
		this._priorityFilter.set([]);
		this._statusFilter.set([]);
	}
}

export type SortingColumns = 'id' | 'title' | 'status' | 'priority';
export type TaskType = 'Bug' | 'Feature' | 'Documentation';
export type TaskStatus = 'Todo' | 'In Progress' | 'Backlog' | 'Canceled' | 'Done';
export type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type Task = {
	id: string;
	title: string;
	type: TaskType;
	status: TaskStatus;
	priority: TaskPriority;
};

const TASK_DATA: Task[] = [
	{
		id: 'TASK-8782',
		title: "You can't compress the program without quantifying the open-source SSD",
		status: 'In Progress',
		priority: 'Low',
		type: 'Bug',
	},
	{
		id: 'TASK-7878',
		title: 'Try to calculate the EXE feed, maybe it will index the multi-byte pixel!',
		status: 'Backlog',
		priority: 'Medium',
		type: 'Feature',
	},
	{
		id: 'TASK-7839',
		title: 'We need to bypass the neural TCP card!',
		status: 'Todo',
		priority: 'High',
		type: 'Documentation',
	},
	{
		id: 'TASK-5562',
		title: 'The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!',
		status: 'Backlog',
		priority: 'Medium',
		type: 'Bug',
	},
	{
		id: 'TASK-8686',
		title: "I'll parse the wireless SSL protocol, that should driver the API panel!",
		status: 'Canceled',
		priority: 'Medium',
		type: 'Feature',
	},
	{
		id: 'TASK-1280',
		title: 'Use the digital TLS panel, then you can transmit the haptic system!',
		status: 'Done',
		priority: 'High',
		type: 'Documentation',
	},
	{
		id: 'TASK-7262',
		title: "I'll transmit the wireless JBOD capacitor, that should hard drive the SSD feed!",
		status: 'Done',
		priority: 'High',
		type: 'Bug',
	},
	{
		id: 'TASK-1138',
		title: "Transmitting the transmitter won't do anything, we need to compress the virtual HDD sensor!",
		status: 'In Progress',
		priority: 'Medium',
		type: 'Feature',
	},
	{
		id: 'TASK-7184',
		title: 'We need to program the back-end THX pixel!',
		status: 'Done',
		priority: 'Low',
		type: 'Documentation',
	},
	{
		id: 'TASK-5160',
		title: 'The SQL interface is down, override the optical bus so we can program the ASCII interface!',
		status: 'In Progress',
		priority: 'High',
		type: 'Bug',
	},
	{
		id: 'TASK-9001',
		title: 'Need to refactor the quantum blockchain to optimize the AI neural mesh',
		status: 'Todo',
		priority: 'High',
		type: 'Feature',
	},
	{
		id: 'TASK-9002',
		title: 'The IPv6 matrix is overflowing, debug the recursive GPU bandwidth',
		status: 'In Progress',
		priority: 'Medium',
		type: 'Documentation',
	},
	{
		id: 'TASK-9003',
		title: 'Deploy microservice containers to scale the holographic RAM interface',
		status: 'Backlog',
		priority: 'Low',
		type: 'Bug',
	},
	{
		id: 'TASK-9004',
		title: 'Synchronize the blockchain ledger with the quantum entangled cache',
		status: 'Todo',
		priority: 'High',
		type: 'Feature',
	},
	{
		id: 'TASK-9005',
		title: 'The machine learning pipeline is corrupting the serverless Docker nodes',
		status: 'In Progress',
		priority: 'High',
		type: 'Documentation',
	},
	{
		id: 'TASK-9006',
		title: "Implement zero-trust authentication for the neural network's REST API",
		status: 'Done',
		priority: 'Medium',
		type: 'Bug',
	},
	{
		id: 'TASK-9007',
		title: 'The distributed NoSQL cluster is fragmenting the WebAssembly heap',
		status: 'Backlog',
		priority: 'Low',
		type: 'Feature',
	},
	{
		id: 'TASK-9008',
		title: 'Need to recompile the quantum-resistant encryption module in WebGL',
		status: 'In Progress',
		priority: 'High',
		type: 'Documentation',
	},
	{
		id: 'TASK-9009',
		title: 'The edge computing mesh is destabilizing the blockchain consensus',
		status: 'Todo',
		priority: 'Medium',
		type: 'Bug',
	},
	{
		id: 'TASK-9010',
		title: "Optimize the neural network's deep learning tensor for Web3 integration",
		status: 'Canceled',
		priority: 'Low',
		type: 'Feature',
	},
	{
		id: 'TASK-9011',
		title: 'The quantum fuzzy logic parser is corrupting the blockchain NFTs',
		status: 'Todo',
		priority: 'High',
		type: 'Documentation',
	},
	{
		id: 'TASK-9012',
		title: 'Need to recompile the Metaverse VR modules using Web Assembly',
		status: 'In Progress',
		priority: 'Medium',
		type: 'Bug',
	},
	{
		id: 'TASK-1337',
		title: 'The AI is generating recursive blockchain smart contracts',
		status: 'Backlog',
		priority: 'Critical',
		type: 'Feature',
	},
	{
		id: 'TASK-9013',
		title: 'Optimize WASM compilation for metaverse sharding',
		status: 'Backlog',
		priority: 'High',
		type: 'Documentation',
	},
	{
		id: 'TASK-9014',
		title: 'Implement reactive blockchain state management',
		status: 'Done',
		priority: 'Medium',
		type: 'Bug',
	},
	{
		id: 'TASK-9015',
		title: 'Debug quantum decoherence in ML training pipeline',
		status: 'In Progress',
		priority: 'Critical',
		type: 'Feature',
	},
	{
		id: 'TASK-9016',
		title: 'Optimize GPU raytracing for NFT rendering',
		status: 'Todo',
		priority: 'Low',
		type: 'Documentation',
	},
	{
		id: 'TASK-9017',
		title: 'Implement zero-knowledge proofs for AI models',
		status: 'Backlog',
		priority: 'High',
		type: 'Bug',
	},
	{
		id: 'TASK-9018',
		title: 'Debug smart contract recursive overflow',
		status: 'In Progress',
		priority: 'Medium',
		type: 'Feature',
	},
	{
		id: 'TASK-9019',
		title: 'Optimize neural network for quantum supremacy',
		status: 'Done',
		priority: 'High',
		type: 'Documentation',
	},
	{
		id: 'TASK-9020',
		title: 'Implement distributed consensus for VR nodes',
		status: 'Todo',
		priority: 'Medium',
		type: 'Bug',
	},
	{
		id: 'TASK-9021',
		title: 'Debug quantum entanglement in cache layer',
		status: 'In Progress',
		priority: 'High',
		type: 'Feature',
	},
	{
		id: 'TASK-9022',
		title: 'Optimize CUDA cores for blockchain mining',
		status: 'Backlog',
		priority: 'Low',
		type: 'Documentation',
	},
	{
		id: 'TASK-9023',
		title: 'Implement neural cryptography for Web3',
		status: 'Done',
		priority: 'Medium',
		type: 'Bug',
	},
	{
		id: 'TASK-9024',
		title: 'Debug recursive smart contract calls',
		status: 'In Progress',
		priority: 'High',
		type: 'Feature',
	},
	{
		id: 'TASK-9025',
		title: 'Optimize quantum compiler for WASM',
		status: 'Todo',
		priority: 'Critical',
		type: 'Documentation',
	},
	{
		id: 'TASK-9026',
		title: 'Implement sharding for NFT marketplace',
		status: 'Backlog',
		priority: 'Medium',
		type: 'Bug',
	},
	{
		id: 'TASK-9027',
		title: 'Debug neural network race conditions',
		status: 'In Progress',
		priority: 'High',
		type: 'Feature',
	},
	{
		id: 'TASK-9028',
		title: 'Optimize GPU pipeline for metaverse rendering',
		status: 'Done',
		priority: 'Low',
		type: 'Documentation',
	},
	{
		id: 'TASK-9029',
		title: 'Implement quantum-safe cryptography',
		status: 'Todo',
		priority: 'High',
		type: 'Bug',
	},
	{
		id: 'TASK-9030',
		title: 'Debug distributed ledger consensus',
		status: 'In Progress',
		priority: 'Medium',
		type: 'Feature',
	},
	{
		id: 'TASK-9031',
		title: 'Optimize AI models for edge computing',
		status: 'Backlog',
		priority: 'High',
		type: 'Documentation',
	},
	{
		id: 'TASK-9032',
		title: 'Implement zero-day exploit detection',
		status: 'Done',
		priority: 'Critical',
		type: 'Bug',
	},
	{
		id: 'TASK-9033',
		title: 'Debug quantum teleportation protocol',
		status: 'In Progress',
		priority: 'Medium',
		type: 'Feature',
	},
	{
		id: 'TASK-9034',
		title: 'Optimize blockchain for IoT devices',
		status: 'Todo',
		priority: 'Low',
		type: 'Documentation',
	},
	{
		id: 'TASK-9035',
		title: 'Implement neural feedback loops',
		status: 'Backlog',
		priority: 'High',
		type: 'Bug',
	},
	{
		id: 'TASK-9036',
		title: 'Debug smart contract gas optimization',
		status: 'In Progress',
		priority: 'Medium',
		type: 'Feature',
	},
	{
		id: 'TASK-9037',
		title: 'Optimize quantum circuits for ML',
		status: 'Done',
		priority: 'High',
		type: 'Documentation',
	},
	{
		id: 'TASK-9038',
		title: 'Implement distributed VR rendering',
		status: 'Todo',
		priority: 'Low',
		type: 'Bug',
	},
	{
		id: 'TASK-9039',
		title: 'Debug neural network backpropagation',
		status: 'In Progress',
		priority: 'Critical',
		type: 'Feature',
	},
	{
		id: 'TASK-9040',
		title: 'Optimize WASM for blockchain validation',
		status: 'Backlog',
		priority: 'Medium',
		type: 'Documentation',
	},
	{
		id: 'TASK-9041',
		title: 'Implement quantum error correction',
		status: 'Done',
		priority: 'High',
		type: 'Bug',
	},
	{
		id: 'TASK-9042',
		title: 'Debug distributed cache coherency',
		status: 'In Progress',
		priority: 'Low',
		type: 'Feature',
	},
	{
		id: 'TASK-9043',
		title: 'Optimize neural network pruning',
		status: 'Todo',
		priority: 'Medium',
		type: 'Documentation',
	},
	{
		id: 'TASK-9044',
		title: 'Implement zero-trust blockchain',
		status: 'Backlog',
		priority: 'High',
		type: 'Bug',
	},
	{
		id: 'TASK-9045',
		title: 'Debug quantum state preparation',
		status: 'In Progress',
		priority: 'Critical',
		type: 'Feature',
	},
	{
		id: 'TASK-9046',
		title: 'Optimize GPU kernels for NFTs',
		status: 'Done',
		priority: 'Medium',
		type: 'Documentation',
	},
	{
		id: 'TASK-9047',
		title: 'Implement neural hardware acceleration',
		status: 'Todo',
		priority: 'Low',
		type: 'Bug',
	},
	{
		id: 'TASK-9048',
		title: 'Debug smart contract memory leaks',
		status: 'In Progress',
		priority: 'High',
		type: 'Feature',
	},
	{
		id: 'TASK-9049',
		title: 'Optimize quantum gate operations',
		status: 'Backlog',
		priority: 'Medium',
		type: 'Documentation',
	},
	{
		id: 'TASK-9050',
		title: 'Implement distributed ML training',
		status: 'Done',
		priority: 'Critical',
		type: 'Bug',
	},
];
