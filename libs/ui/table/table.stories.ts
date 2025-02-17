import { NgForOf, TitleCasePipe } from '@angular/common';
import { Component, type TrackByFunction, computed, effect, signal, untracked } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { faker } from '@faker-js/faker';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnMenuModule } from '@spartan-ng/brain/menu';
import { BrnTableModule, type PaginatorState, useBrnColumnManager } from '@spartan-ng/brain/table';
import { BrnToggleGroupModule } from '@spartan-ng/brain/toggle';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { debounceTime } from 'rxjs';
import { HlmButtonDirective, HlmButtonModule } from '../button/helm/src';
import { HlmIconDirective } from '../icon/helm/src';
import { HlmInputDirective } from '../input/helm/src';
import { HlmMenuModule } from '../menu/helm/src';
import { HlmToggleGroupModule } from '../toggle/helm/src';
import { HlmTableComponent, HlmTableModule } from './helm/src';

const createUsers = (numUsers = 5) => {
	return Array.from({ length: numUsers }, () => ({
		name: faker.person.fullName(),
		age: faker.number.int({ min: 10, max: 100 }),
		height: faker.number.int({ min: 140, max: 210 }),
	}));
};

@Component({
	selector: 'table-story',
	standalone: true,
	imports: [
		FormsModule,
		NgForOf,
		BrnTableModule,
		HlmTableModule,
		BrnMenuModule,
		HlmMenuModule,
		HlmInputDirective,
		HlmButtonDirective,
		NgIcon,
		HlmIconDirective,
		TitleCasePipe,
	],
	providers: [provideIcons({ lucideChevronDown })],
	template: `
		<div class="flex justify-between">
			<input
				hlmInput
				placeholder="Filter by name"
				[ngModel]="_nameFilter()"
				(ngModelChange)="_rawFilterInput.set($event)"
			/>

			<button hlmBtn variant="outline" align="end" [brnMenuTriggerFor]="menu">
				Columns
				<ng-icon hlm name="lucideChevronDown" class="ml-2" size="sm" />
			</button>
			<ng-template #menu>
				<hlm-menu class="w-40">
					<button
						*ngFor="let column of _brnColumnManager.allColumns"
						hlmMenuItemCheckbox
						[disabled]="_brnColumnManager.isColumnDisabled(column.name)"
						[checked]="_brnColumnManager.isColumnVisible(column.name)"
						(triggered)="_brnColumnManager.toggleVisibility(column.name)"
					>
						<hlm-menu-item-check />
						<span>{{ column.label }}</span>
					</button>
				</hlm-menu>
			</ng-template>
		</div>

		<brn-table
			hlm
			stickyHeader
			class="border-border mt-4 block h-[337px] overflow-scroll rounded-md border"
			[dataSource]="_data()"
			[displayedColumns]="_brnColumnManager.displayedColumns()"
			[trackBy]="_trackBy"
		>
			<brn-column-def name="name" class="w-40">
				<hlm-th truncate *brnHeaderDef>Name</hlm-th>
				<hlm-td truncate *brnCellDef="let element">
					{{ element.name }}
				</hlm-td>
			</brn-column-def>
			<brn-column-def name="age" class="w-40 justify-end">
				<hlm-th *brnHeaderDef>Age</hlm-th>
				<hlm-td class="tabular-nums" *brnCellDef="let element">
					{{ element.age }}
				</hlm-td>
			</brn-column-def>
			<brn-column-def name="height" class="w-40 justify-end tabular-nums">
				<hlm-th *brnHeaderDef>Height</hlm-th>
				<hlm-td *brnCellDef="let element">
					{{ element.height }}
				</hlm-td>
			</brn-column-def>
		</brn-table>
		<div
			class="mt-2 flex items-center justify-between"
			*brnPaginator="let ctx; totalElements: _totalElements(); pageSize: _pageSize(); onStateChange: _onStateChange"
		>
			<span class="text-sm tabular-nums">
				Showing entries {{ ctx.state().startIndex + 1 }} - {{ ctx.state().endIndex + 1 }} of {{ _totalElements() }}
			</span>
			<div class="flex">
				<select
					[ngModel]="_pageSize()"
					(ngModelChange)="_pageSize.set($event)"
					hlmInput
					size="sm"
					class="mr-1 inline-flex pr-8"
				>
					<option [value]="size" *ngFor="let size of _availablePageSizes">{{ size === 10000 ? 'All' : size }}</option>
				</select>

				<div class="flex space-x-1">
					<button size="sm" variant="outline" hlmBtn [disabled]="!ctx.decrementable()" (click)="ctx.decrement()">
						Previous
					</button>
					<button size="sm" variant="outline" hlmBtn [disabled]="!ctx.incrementable()" (click)="ctx.increment()">
						Next
					</button>
				</div>
			</div>
		</div>
		<button size="sm" variant="outline" hlmBtn (click)="_loadNewUsers()">Mix it up</button>
	`,
})
class TableStory {
	private readonly _startEndIndex = signal({ start: 0, end: 0 });
	protected readonly _availablePageSizes = [10, 20, 50, 100, 10000];
	protected readonly _pageSize = signal(this._availablePageSizes[0]);

	protected readonly _brnColumnManager = useBrnColumnManager({
		name: { visible: true, label: 'Name' },
		age: { visible: false, label: 'Alter' },
		height: { visible: false, label: 'Größe' },
	});

	protected readonly _rawFilterInput = signal('');
	protected readonly _nameFilter = signal('');
	private readonly _debouncedFilter = toSignal(toObservable(this._rawFilterInput).pipe(debounceTime(300)));

	private readonly _users = signal(createUsers(20));
	private readonly _filteredUsers = computed(() =>
		this._users().filter((user) => {
			const nameFilter = this._nameFilter();
			return !nameFilter || user.name.toLowerCase().includes(nameFilter.toLowerCase());
		}),
	);
	protected readonly _data = computed(() =>
		this._filteredUsers().slice(this._startEndIndex().start, this._startEndIndex().end + 1),
	);
	protected readonly _trackBy: TrackByFunction<{ name: string }> = (_index: number, user: { name: string }) =>
		user.name;
	protected readonly _totalElements = computed(() => this._filteredUsers().length);
	protected readonly _onStateChange = (state: PaginatorState) => {
		this._startEndIndex.set({ start: state.startIndex, end: state.endIndex });
	};

	constructor() {
		// needed to sync the debounced filter to the name filter, but being able to override the
		// filter when loading new users without debounce
		effect(() => {
			const debouncedFilter = this._debouncedFilter();
			untracked(() => {
				this._nameFilter.set(debouncedFilter ?? '');
			});
		});
	}

	protected _loadNewUsers() {
		this._nameFilter.set('');
		this._users.set(createUsers(Math.random() * 200));
	}
}

@Component({
	selector: 'table-toggle-story',
	standalone: true,
	imports: [
		FormsModule,
		NgForOf,
		BrnTableModule,
		HlmTableModule,
		HlmButtonModule,
		BrnToggleGroupModule,
		HlmToggleGroupModule,
	],
	template: `
		<brn-toggle-group
			aria-label="Show selected or all "
			hlm
			class="mb-2.5 w-full sm:w-fit"
			[ngModel]="_onlyAbove180()"
			(ngModelChange)="_setOnlyAbove180($event)"
		>
			<button class="w-full sm:w-40" variant="outline" [value]="false" hlm brnToggle>All</button>
			<button class="w-full tabular-nums sm:w-40" variant="outline" [value]="true" hlm brnToggle>Above 150</button>
		</brn-toggle-group>
		<brn-table
			hlm
			stickyHeader
			class="border-border mt-4 block h-[337px] overflow-scroll rounded-md border"
			[dataSource]="_data()"
			[displayedColumns]="_brnColumnManager.displayedColumns()"
			[trackBy]="_trackBy"
		>
			<brn-column-def name="name">
				<hlm-th truncate class="w-40" *brnHeaderDef>Name</hlm-th>
				<hlm-td truncate class="w-40" *brnCellDef="let element">
					{{ element.name }}
				</hlm-td>
			</brn-column-def>
			<brn-column-def name="age">
				<hlm-th class="w-40 justify-end" *brnHeaderDef>Age</hlm-th>
				<hlm-td class="w-40 justify-end tabular-nums" *brnCellDef="let element">
					{{ element.age }}
				</hlm-td>
			</brn-column-def>
			<brn-column-def name="height">
				<hlm-th class="w-40 justify-end" *brnHeaderDef>Height</hlm-th>
				<hlm-td class="w-40 justify-end tabular-nums" *brnCellDef="let element">
					{{ element.height }}
				</hlm-td>
			</brn-column-def>
		</brn-table>
		<div
			class="mt-2 flex items-center justify-between"
			*brnPaginator="let ctx; totalElements: _totalElements(); pageSize: _pageSize(); onStateChange: _onStateChange"
		>
			<span class="text-sm tabular-nums">
				Showing entries {{ ctx.state().startIndex + 1 }} - {{ ctx.state().endIndex + 1 }} of {{ _totalElements() }}
			</span>
			<div class="flex">
				<select
					[ngModel]="_pageSize()"
					(ngModelChange)="_pageSize.set($event)"
					hlmInput
					size="sm"
					class="mr-1 inline-flex pr-8"
				>
					<option [value]="size" *ngFor="let size of _availablePageSizes">{{ size === 10000 ? 'All' : size }}</option>
				</select>

				<div class="flex space-x-1">
					<button size="sm" variant="outline" hlmBtn [disabled]="!ctx.decrementable()" (click)="ctx.decrement()">
						Previous
					</button>
					<button size="sm" variant="outline" hlmBtn [disabled]="!ctx.incrementable()" (click)="ctx.increment()">
						Next
					</button>
				</div>
			</div>
		</div>
		<button size="sm" variant="outline" hlmBtn (click)="_loadNewUsers()">Mix it up</button>
	`,
})
class TableToggleStory {
	private readonly _startEndIndex = signal({ start: 0, end: 0 });
	protected readonly _availablePageSizes = [10, 20, 50, 100, 10000];
	protected readonly _pageSize = signal(this._availablePageSizes[0]);

	protected readonly _onlyAbove180 = signal<boolean>(false);
	protected readonly _brnColumnManager = useBrnColumnManager({
		name: true,
		age: false,
		height: true,
	});

	private readonly _users = signal(createUsers(20));
	private readonly _filteredUsers = computed(() => {
		if (this._onlyAbove180()) return this._users().filter((u) => u.height > 180);
		return this._users();
	});
	protected readonly _data = computed(() =>
		this._filteredUsers().slice(this._startEndIndex().start, this._startEndIndex().end + 1),
	);
	protected readonly _trackBy: TrackByFunction<{ name: string }> = (_index: number, user: { name: string }) =>
		user.name;
	protected readonly _totalElements = computed(() => this._filteredUsers().length);
	protected readonly _onStateChange = (state: PaginatorState) => {
		this._startEndIndex.set({ start: state.startIndex, end: state.endIndex });
	};

	protected _loadNewUsers() {
		this._users.set(createUsers(Math.random() * 200));
	}

	protected _setOnlyAbove180(newVal: boolean) {
		if (newVal) {
			this._brnColumnManager.setInvisible('age');
		} else {
			this._brnColumnManager.setVisible('age');
		}
		this._onlyAbove180.set(newVal);
	}
}

@Component({
	selector: 'table-presentation-only-story',
	standalone: true,
	imports: [HlmTableModule, NgForOf],
	template: `
		<hlm-table>
			<hlm-trow>
				<hlm-th truncate class="w-40">Name</hlm-th>
				<hlm-th class="w-24 justify-end">Age</hlm-th>
				<hlm-th class="w-40 justify-center">Height</hlm-th>
			</hlm-trow>
			<hlm-trow *ngFor="let row of _data()">
				<hlm-td truncate class="w-40">{{ row.name }}</hlm-td>
				<hlm-td class="w-24 justify-end">{{ row.age }}</hlm-td>
				<hlm-td class="w-40 justify-center">{{ row.height }}</hlm-td>
			</hlm-trow>
		</hlm-table>
	`,
})
class TablePresentationOnlyStory {
	protected readonly _data = signal(createUsers(20));
}

const meta: Meta<HlmTableComponent> = {
	title: 'Table',
	component: HlmTableComponent,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [TableStory, TableToggleStory],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmTableComponent>;

export const Default: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [TableStory],
		},
		template: '<table-story/>',
	}),
};

export const PresentationOnly: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [TablePresentationOnlyStory],
		},
		template: '<table-presentation-only-story/>',
	}),
};

export const Toggle: Story = {
	render: () => ({
		template: '<table-toggle-story/>',
	}),
};
