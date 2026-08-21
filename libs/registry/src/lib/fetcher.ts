import { promises as fs } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import type { RegistryItem } from '../schema/schema';
import { registryItemSchema } from '../schema/schema';

const cache = new Map<string, Promise<unknown>>();

export function clearRegistryCache() {
	cache.clear();
}

export async function fetchRegistryJson(
	url: string,
	options: { headers?: Record<string, string>; useCache?: boolean } = {},
) {
	const useCache = options.useCache ?? true;
	if (useCache && cache.has(url)) {
		return cache.get(url)!;
	}

	const promise = (async () => {
		const response = await fetch(url, {
			headers: {
				Accept: 'application/vnd.spartan.v1+json, application/json;q=0.9',
				'User-Agent': '@spartan-ng/cli',
				...(options.headers ?? {}),
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch registry item at ${url}: ${response.status} ${response.statusText}`);
		}

		return response.json();
	})();

	if (useCache) {
		cache.set(url, promise);
	}
	return promise;
}

export async function fetchRegistryItemFromUrl(
	url: string,
	options: { headers?: Record<string, string>; useCache?: boolean } = {},
): Promise<RegistryItem> {
	return registryItemSchema.parse(await fetchRegistryJson(url, options));
}

export async function fetchRegistryItemFromFile(filePath: string): Promise<RegistryItem> {
	const expandedPath = filePath.startsWith('~/') ? path.join(homedir(), filePath.slice(2)) : filePath;
	const content = await fs.readFile(path.resolve(expandedPath), 'utf-8');
	return registryItemSchema.parse(JSON.parse(content));
}
