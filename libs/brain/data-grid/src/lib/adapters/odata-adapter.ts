import type { BrnDataAdapter, BrnGridState } from '../brn-data-source';

const esc = (v: unknown) => String(v ?? '').replace(/'/g, "''");

export function buildODataQueryString(s: BrnGridState): string {
	const parts = [`$top=${s.pageSize}`, `$skip=${s.page * s.pageSize}`];
	const sort = s.sorting[0];
	if (sort) parts.push(`$orderby=${sort.id} ${sort.desc ? 'desc' : 'asc'}`);
	const filters = s.filters
		.filter((f) => f.value !== '' && f.value != null)
		.map((f) => `contains(${f.id},'${esc(f.value)}')`);
	if (s.globalFilter) filters.push(`contains(email,'${esc(s.globalFilter)}')`);
	if (filters.length) parts.push(`$filter=${filters.join(' and ')}`);
	parts.push('$count=true');
	return parts.join('&');
}

export function createODataAdapter<TData>(opts: {
	baseUrl: string;
	fetchFn?: (url: string, signal: AbortSignal) => Promise<{ rows: TData[]; total: number }>;
}): BrnDataAdapter<TData, string> {
	return {
		buildQuery: (s) => buildODataQueryString(s),
		fetch: async (query, signal) => {
			const url = `${opts.baseUrl}?${query}`;
			if (opts.fetchFn) return opts.fetchFn(url, signal);
			const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
			if (!res.ok) throw new Error(`OData fetch failed: ${res.status}`);
			const json = await res.json();
			return { rows: json.value ?? [], total: json['@odata.count'] ?? json.value?.length ?? 0 };
		},
	};
}
