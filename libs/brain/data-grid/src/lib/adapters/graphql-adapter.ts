import type { BrnDataAdapter, BrnGridState } from '../brn-data-source';

export type GraphQLVariables = {
	offset?: number;
	limit?: number;
	first?: number;
	after?: string;
	orderBy?: unknown;
	where?: unknown;
	search?: string;
};

export function createGraphQLAdapter<TData>(opts: {
	endpoint: string;
	query: string;
	mode?: 'offset' | 'cursor';
	mapSort?: (s: { id: string; desc: boolean }) => unknown;
	mapFilter?: (f: { id: string; value: unknown }) => Record<string, unknown>;
	fetchFn: (vars: GraphQLVariables, signal: AbortSignal) => Promise<{ rows: TData[]; total: number }>;
}): BrnDataAdapter<TData, GraphQLVariables> {
	return {
		buildQuery: (s: BrnGridState) => {
			const orderBy = s.sorting.map((x) => (opts.mapSort ? opts.mapSort(x) : { [x.id]: x.desc ? 'DESC' : 'ASC' }));
			const where: Record<string, unknown> = {};
			for (const f of s.filters)
				Object.assign(where, opts.mapFilter ? opts.mapFilter(f) : { [f.id]: { contains: f.value } });
			if (opts.mode === 'cursor')
				return {
					first: s.pageSize,
					after: s.page > 0 ? String(s.page * s.pageSize) : undefined,
					orderBy,
					where,
					search: s.globalFilter,
				};
			return { offset: s.page * s.pageSize, limit: s.pageSize, orderBy, where, search: s.globalFilter };
		},
		fetch: (vars, signal) => opts.fetchFn(vars, signal),
	};
}
