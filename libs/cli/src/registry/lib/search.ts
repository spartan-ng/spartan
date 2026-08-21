import type { SearchResultItem } from '../schema/schema';
import { registrySchema, searchResultItemSchema } from '../schema/schema';
import { buildUrlAndHeadersForRegistryItem, registryConfigWithDefaults, type RegistryConsumerConfig } from './config';
import { fetchRegistryJson } from './fetcher';

export async function searchRegistry(
	registryName: string,
	config: RegistryConsumerConfig = {},
	options: { query?: string; types?: string[]; limit?: number; offset?: number; useCache?: boolean } = {},
): Promise<SearchResultItem[]> {
	const registryAddress = registryName.endsWith('/registry') ? registryName : `${registryName}/registry`;
	const built = buildUrlAndHeadersForRegistryItem(registryAddress, registryConfigWithDefaults(config));
	if (!built) {
		return [];
	}

	const registry = registrySchema.parse(
		await fetchRegistryJson(built.url, { headers: built.headers, useCache: options.useCache }),
	);
	const query = options.query?.toLowerCase();
	const types = options.types?.map((type) => (type.startsWith('registry:') ? type : `registry:${type}`));

	const filtered = registry.items.filter((item) => {
		const matchesQuery =
			!query ||
			item.name.toLowerCase().includes(query) ||
			item.title?.toLowerCase().includes(query) ||
			item.description?.toLowerCase().includes(query);
		const matchesType = !types?.length || types.includes(item.type);
		return matchesQuery && matchesType;
	});

	return filtered.slice(options.offset ?? 0, (options.offset ?? 0) + (options.limit ?? filtered.length)).map((item) =>
		searchResultItemSchema.parse({
			name: item.name,
			type: item.type,
			description: item.description,
			registry: registryName,
			addCommandArgument: `${registryName}/${item.name}`,
		}),
	);
}
