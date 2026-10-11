import type { BrnDataAdapter, BrnGridState } from '../brn-data-source';

export function createRestAdapter<TData>(opts: {
	baseUrl: string;
	fetchFn?: (url: string, signal: AbortSignal) => Promise<{ rows: TData[]; total: number }>;
	mapSort?: (s: { id: string; desc: boolean }) => Record<string, string>;
	mapFilter?: (f: { id: string; value: unknown }) => Record<string, string>;
}): BrnDataAdapter<TData, Record<string, string>> {
	return {
		buildQuery: (s: BrnGridState) => {
			const q: Record<string, string> = { page: String(s.page + 1), pageSize: String(s.pageSize) };
			const sort = s.sorting[0];
			if (sort)
				Object.assign(q, opts.mapSort ? opts.mapSort(sort) : { sortBy: sort.id, sortDir: sort.desc ? 'desc' : 'asc' });
			for (const f of s.filters) {
				if (f.value === '' || f.value == null) continue;
				Object.assign(q, opts.mapFilter ? opts.mapFilter(f) : { [`filter[${f.id}]`]: String(f.value ?? '') });
			}
			if (s.globalFilter) q['q'] = s.globalFilter;
			return q;
		},
		fetch: async (query, signal) => {
			if (opts.fetchFn) return opts.fetchFn(`${opts.baseUrl}?${new URLSearchParams(query).toString()}`, signal);
			const res = await fetch(`${opts.baseUrl}?${new URLSearchParams(query).toString()}`, { signal });
			if (!res.ok) throw new Error(`REST fetch failed: ${res.status}`);
			const json = await res.json();
			return { rows: json.data ?? json.rows ?? [], total: json.total ?? json.count ?? 0 };
		},
	};
}
