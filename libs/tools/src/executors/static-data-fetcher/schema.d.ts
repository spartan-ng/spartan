export interface StaticDataFetcherExecutorSchema {
	apiUrl?: string;
	outputFile?: string;
	headers?: Record<string, string>;
	critical?: boolean;
}
