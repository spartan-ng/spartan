export type BrnSort = { id: string; desc: boolean };
export type BrnFilter = { id: string; value: unknown };
export type BrnGridState = {
	page: number;
	pageSize: number;
	sorting: BrnSort[];
	filters: BrnFilter[];
	globalFilter?: string;
};
export interface BrnDataAdapter<TData, TQuery> {
	buildQuery(state: BrnGridState): TQuery;
	fetch(query: TQuery, signal: AbortSignal): Promise<{ rows: TData[]; total: number }>;
}
