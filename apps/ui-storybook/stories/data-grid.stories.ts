import { Component, computed } from '@angular/core';
import { faker } from '@faker-js/faker';
import {
	createGraphQLAdapter,
	createODataAdapter,
	createRestAdapter,
	injectBrnDataGrid,
	type GraphQLVariables,
} from '@spartan-ng/brain/data-grid';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDataGridImports } from '@spartan-ng/helm/data-grid';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTableImports } from '@spartan-ng/helm/table';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
	columnFilteringFeature,
	columnVisibilityFeature,
	createColumnHelper,
	FlexRender,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	tableFeatures,
} from '@tanstack/angular-table';

export type DataGridStoryUser = {
	id: string;
	name: string;
	email: string;
};

// Seeded so every load (and Cypress run) sees the same rows.
faker.seed(4242);

const makeUsers = (count: number): DataGridStoryUser[] =>
	Array.from({ length: count }, () => ({
		id: faker.string.uuid(),
		name: faker.person.fullName(),
		email: faker.internet.email(),
	}));

const REST_USERS = makeUsers(42);
const ODATA_USERS = makeUsers(42);
const GRAPHQL_USERS = makeUsers(42);
const SLOW_USERS = makeUsers(12);

const features = tableFeatures({
	columnFilteringFeature,
	columnVisibilityFeature,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
});

const columnHelper = createColumnHelper<typeof features, DataGridStoryUser>();

const columns = [
	columnHelper.accessor('name', {
		id: 'name',
		header: 'Name',
		cell: (info) => info.getValue<string>(),
	}),
	columnHelper.accessor('email', {
		id: 'email',
		header: 'Email',
		cell: (info) => `<div class="lowercase">${info.getValue<string>()}</div>`,
	}),
];

const filterUsers = (rows: DataGridStoryUser[], term: string): DataGridStoryUser[] => {
	const q = term.trim().toLowerCase();
	if (!q) return rows;
	return rows.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
};

const sortUsers = (rows: DataGridStoryUser[], id: string, dir: 'asc' | 'desc'): DataGridStoryUser[] => {
	if (!id) return rows;
	return [...rows].sort((a, b) => {
		const left = String(a[id as keyof DataGridStoryUser]);
		const right = String(b[id as keyof DataGridStoryUser]);
		return dir === 'desc' ? right.localeCompare(left) : left.localeCompare(right);
	});
};

const pageOf = (rows: DataGridStoryUser[], page: number, pageSize: number): DataGridStoryUser[] =>
	rows.slice(page * pageSize, page * pageSize + pageSize);

const readRestParams = (url: string) => {
	const params = new URLSearchParams(url.split('?')[1] ?? '');
	return {
		page: Number(params.get('page') ?? '1') - 1,
		pageSize: Number(params.get('pageSize') ?? '5'),
		term: params.get('q') ?? params.get('filter[email]') ?? '',
		sortBy: params.get('sortBy') ?? '',
		sortDir: (params.get('sortDir') ?? 'asc') as 'asc' | 'desc',
	};
};

const restAdapter = createRestAdapter<DataGridStoryUser>({
	baseUrl: '/api/users',
	fetchFn: async (url, signal) => {
		signal.throwIfAborted();
		const { page, pageSize, term, sortBy, sortDir } = readRestParams(url);
		const rows = sortUsers(filterUsers(REST_USERS, term), sortBy, sortDir);
		return { rows: pageOf(rows, page, pageSize), total: rows.length };
	},
});

const odataAdapter = createODataAdapter<DataGridStoryUser>({
	baseUrl: '/odata/Users',
	fetchFn: async (url, signal) => {
		signal.throwIfAborted();
		const params = new URLSearchParams(url.split('?')[1] ?? '');
		const top = Number(params.get('$top') ?? '5');
		const skip = Number(params.get('$skip') ?? '0');
		const orderby = params.get('$orderby') ?? '';
		const filter = (params.get('$filter') ?? '').toLowerCase();
		const term = filter.match(/contains\(email,'((?:[^']|'')*)'\)/)?.[1].replace(/''/g, "'") ?? '';
		const [sortId, sortDir] = orderby.split(' ');
		const rows = sortUsers(filterUsers(ODATA_USERS, term), sortId ?? '', sortDir === 'desc' ? 'desc' : 'asc');
		// Mock the OData JSON envelope, then map it onto the adapter result.
		const envelope = { value: rows.slice(skip, skip + top), '@odata.count': rows.length };
		return { rows: envelope.value, total: envelope['@odata.count'] };
	},
});

const graphqlAdapter = createGraphQLAdapter<DataGridStoryUser>({
	endpoint: '/graphql',
	query:
		'query Users($offset: Int, $limit: Int, $orderBy: [UserOrder!], $where: UserFilter, $search: String) { users { rows total } }',
	fetchFn: async (vars: GraphQLVariables, signal) => {
		signal.throwIfAborted();
		const offset = vars.offset ?? 0;
		const limit = vars.limit ?? vars.first ?? 5;
		const where = (vars.where ?? {}) as Record<string, { contains?: unknown }>;
		const term = String(where['email']?.contains ?? vars.search ?? '');
		const sortEntry = Object.entries((vars.orderBy as Record<string, string>[] | undefined)?.[0] ?? {})[0];
		const rows = sortUsers(
			filterUsers(GRAPHQL_USERS, term),
			sortEntry?.[0] ?? '',
			sortEntry?.[1] === 'DESC' ? 'desc' : 'asc',
		);
		return { rows: rows.slice(offset, offset + limit), total: rows.length };
	},
});

const loadingAdapter = createRestAdapter<DataGridStoryUser>({
	baseUrl: '/api/users',
	fetchFn: (): Promise<{ rows: DataGridStoryUser[]; total: number }> => new Promise(() => {}),
});

const emptyAdapter = createRestAdapter<DataGridStoryUser>({
	baseUrl: '/api/users',
	fetchFn: async (url, signal) => {
		signal.throwIfAborted();
		return { rows: [], total: 0 };
	},
});

const errorAdapter = createRestAdapter<DataGridStoryUser>({
	baseUrl: '/api/users',
	fetchFn: async () => {
		throw new Error('boom');
	},
});

const slowAdapter = createRestAdapter<DataGridStoryUser>({
	baseUrl: '/api/users',
	fetchFn: async (url, signal) => {
		signal.throwIfAborted();
		await new Promise((resolve) => setTimeout(resolve, 2000));
		signal.throwIfAborted();
		const { page, pageSize, term, sortBy, sortDir } = readRestParams(url);
		const rows = sortUsers(filterUsers(SLOW_USERS, term), sortBy, sortDir);
		return { rows: pageOf(rows, page, pageSize), total: rows.length };
	},
});

const gridMarkup = `
		<hlm-data-grid [loading]="_grid.loading()" [error]="_grid.error()" [total]="_grid.total()" [retry]="_grid.reload">
			<thead>
				@for (headerGroup of _grid.table.getHeaderGroups(); track headerGroup.id) {
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
			@for (row of _grid.table.getRowModel().rows; track row.id) {
				<tr hlmTr>
					@for (cell of row.getVisibleCells(); track cell.id) {
						<td hlmTd>
							<ng-container *flexRender="cell.column.columnDef.cell; props: cell.getContext(); let cellText">
								<div [innerHTML]="cellText"></div>
							</ng-container>
						</td>
					}
				</tr>
			}
		</hlm-data-grid>
		<hlm-data-grid-pagination [table]="_grid.table" />
	`;

const filterChrome = `
		<div class="flex flex-col gap-2 py-4 sm:flex-row sm:items-center">
			<input hlmInput class="w-full md:max-w-sm" placeholder="Filter emails..." (input)="_filterChanged($event)" />
			<button hlmBtn variant="outline" size="sm" (click)="_toggleEmailSort()">Sort by email {{ _sortLabel() }}</button>
		</div>
		<p class="text-muted-foreground font-mono text-xs break-all">{{ _queryDisplay() }}</p>
	`;

const interactiveTemplate = filterChrome + gridMarkup;

@Component({
	selector: 'data-grid-rest-story',
	standalone: true,
	imports: [FlexRender, HlmDataGridImports, HlmTableImports, HlmInputImports, HlmButtonImports],
	host: { class: 'w-full' },
	template: interactiveTemplate,
})
class RestStory {
	protected readonly _grid = injectBrnDataGrid<DataGridStoryUser>({
		adapter: restAdapter,
		initial: { pageSize: 5 },
		features,
		columns,
	});
	protected readonly _queryDisplay = computed(
		() => `GET /api/users?${new URLSearchParams(this._grid.query()).toString()}`,
	);
	protected readonly _sortLabel = computed(() => {
		const sort = this._grid.table.getColumn('email')?.getIsSorted();
		return sort === 'desc' ? '↓' : sort === 'asc' ? '↑' : '↕';
	});
	protected _filterChanged(event: Event) {
		this._grid.table.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value);
	}
	protected _toggleEmailSort() {
		this._grid.table.getColumn('email')?.toggleSorting();
	}
}

@Component({
	selector: 'data-grid-odata-story',
	standalone: true,
	imports: [FlexRender, HlmDataGridImports, HlmTableImports, HlmInputImports, HlmButtonImports],
	host: { class: 'w-full' },
	template: interactiveTemplate,
})
class ODataStory {
	protected readonly _grid = injectBrnDataGrid<DataGridStoryUser>({
		adapter: odataAdapter,
		initial: { pageSize: 5 },
		features,
		columns,
	});
	protected readonly _queryDisplay = computed(() => `GET /odata/Users?${this._grid.query()}`);
	protected readonly _sortLabel = computed(() => {
		const sort = this._grid.table.getColumn('email')?.getIsSorted();
		return sort === 'desc' ? '↓' : sort === 'asc' ? '↑' : '↕';
	});
	protected _filterChanged(event: Event) {
		this._grid.table.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value);
	}
	protected _toggleEmailSort() {
		this._grid.table.getColumn('email')?.toggleSorting();
	}
}

@Component({
	selector: 'data-grid-graphql-story',
	standalone: true,
	imports: [FlexRender, HlmDataGridImports, HlmTableImports, HlmInputImports, HlmButtonImports],
	host: { class: 'w-full' },
	template: interactiveTemplate,
})
class GraphQLStory {
	protected readonly _grid = injectBrnDataGrid<DataGridStoryUser>({
		adapter: graphqlAdapter,
		initial: { pageSize: 5 },
		features,
		columns,
	});
	protected readonly _queryDisplay = computed(() => `vars ${JSON.stringify(this._grid.query())}`);
	protected readonly _sortLabel = computed(() => {
		const sort = this._grid.table.getColumn('email')?.getIsSorted();
		return sort === 'desc' ? '↓' : sort === 'asc' ? '↑' : '↕';
	});
	protected _filterChanged(event: Event) {
		this._grid.table.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value);
	}
	protected _toggleEmailSort() {
		this._grid.table.getColumn('email')?.toggleSorting();
	}
}

@Component({
	selector: 'data-grid-loading-story',
	standalone: true,
	imports: [FlexRender, HlmDataGridImports, HlmTableImports, HlmButtonImports],
	host: { class: 'w-full' },
	template: gridMarkup,
})
class LoadingStory {
	protected readonly _grid = injectBrnDataGrid<DataGridStoryUser>({
		adapter: loadingAdapter,
		initial: { pageSize: 5 },
		features,
		columns,
	});
}

@Component({
	selector: 'data-grid-empty-story',
	standalone: true,
	imports: [FlexRender, HlmDataGridImports, HlmTableImports, HlmButtonImports],
	host: { class: 'w-full' },
	template: gridMarkup,
})
class EmptyStory {
	protected readonly _grid = injectBrnDataGrid<DataGridStoryUser>({
		adapter: emptyAdapter,
		initial: { pageSize: 5 },
		features,
		columns,
	});
}

@Component({
	selector: 'data-grid-error-story',
	standalone: true,
	imports: [FlexRender, HlmDataGridImports, HlmTableImports, HlmButtonImports],
	host: { class: 'w-full' },
	template: gridMarkup,
})
class ErrorStory {
	protected readonly _grid = injectBrnDataGrid<DataGridStoryUser>({
		adapter: errorAdapter,
		initial: { pageSize: 5 },
		features,
		columns,
	});
}

@Component({
	selector: 'data-grid-slow-story',
	standalone: true,
	imports: [FlexRender, HlmDataGridImports, HlmTableImports, HlmButtonImports],
	host: { class: 'w-full' },
	template: gridMarkup,
})
class Slow3GStory {
	protected readonly _grid = injectBrnDataGrid<DataGridStoryUser>({
		adapter: slowAdapter,
		initial: { pageSize: 5 },
		features,
		columns,
	});
}

const meta: Meta = {
	title: 'Data Grid',
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [RestStory, ODataStory, GraphQLStory, LoadingStory, EmptyStory, ErrorStory, Slow3GStory],
		}),
	],
};

export default meta;

export const Rest: StoryObj = {
	render: () => ({
		moduleMetadata: { imports: [RestStory] },
		template: '<data-grid-rest-story/>',
	}),
};

export const OData: StoryObj = {
	render: () => ({
		moduleMetadata: { imports: [ODataStory] },
		template: '<data-grid-odata-story/>',
	}),
};

export const GraphQL: StoryObj = {
	render: () => ({
		moduleMetadata: { imports: [GraphQLStory] },
		template: '<data-grid-graphql-story/>',
	}),
};

export const Loading: StoryObj = {
	render: () => ({
		moduleMetadata: { imports: [LoadingStory] },
		template: '<data-grid-loading-story/>',
	}),
};

export const Empty: StoryObj = {
	render: () => ({
		moduleMetadata: { imports: [EmptyStory] },
		template: '<data-grid-empty-story/>',
	}),
};

export const ErrorState: StoryObj = {
	render: () => ({
		moduleMetadata: { imports: [ErrorStory] },
		template: '<data-grid-error-story/>',
	}),
};

export const Slow3G: StoryObj = {
	render: () => ({
		moduleMetadata: { imports: [Slow3GStory] },
		template: '<data-grid-slow-story/>',
	}),
};
