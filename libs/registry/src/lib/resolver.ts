import type { RegistryItem, RegistryResolvedItemsTree } from '../schema/schema';
import { registryItemSchema, registryResolvedItemsTreeSchema } from '../schema/schema';
import { resolveItemAddress } from './address';
import { buildUrlAndHeadersForRegistryItem, type RegistryConsumerConfig } from './config';
import { fetchRegistryItemFromFile, fetchRegistryItemFromUrl } from './fetcher';
import { dedupe } from './utils';

function mergeObjects(items: Array<Record<string, unknown> | undefined>): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	for (const item of items) {
		if (!item) continue;
		for (const [key, value] of Object.entries(item)) {
			if (
				value &&
				typeof value === 'object' &&
				!Array.isArray(value) &&
				result[key] &&
				typeof result[key] === 'object' &&
				!Array.isArray(result[key])
			) {
				result[key] = mergeObjects([result[key] as Record<string, unknown>, value as Record<string, unknown>]);
			} else {
				result[key] = value;
			}
		}
	}
	return result;
}

export type BuiltinRegistryItemFactory = (name: string) => Promise<RegistryItem | null>;

export interface ResolveRegistryOptions {
	useCache?: boolean;
	builtinItemFactory?: BuiltinRegistryItemFactory;
}

export async function fetchRegistryItem(
	address: string,
	config: RegistryConsumerConfig,
	options: ResolveRegistryOptions,
): Promise<RegistryItem> {
	const resolvedAddress = resolveItemAddress(address);

	if (resolvedAddress.scheme === 'file') {
		return fetchRegistryItemFromFile(resolvedAddress.path);
	}

	if (resolvedAddress.scheme === 'url') {
		return fetchRegistryItemFromUrl(resolvedAddress.url, { useCache: options.useCache });
	}

	if (resolvedAddress.scheme === 'spartan' && options.builtinItemFactory) {
		const local = await options.builtinItemFactory(resolvedAddress.item);
		if (local) {
			return local;
		}
	}

	const built = buildUrlAndHeadersForRegistryItem(address, config);
	if (!built) {
		throw new Error(`Unable to resolve registry item ${address}.`);
	}

	try {
		return await fetchRegistryItemFromUrl(built.url, { headers: built.headers, useCache: options.useCache });
	} catch (error) {
		if (built.registry === '@spartan' && options.builtinItemFactory) {
			const local = await options.builtinItemFactory(built.item);
			if (local) {
				return local;
			}
		}
		throw error;
	}
}

export async function resolveRegistryItems(
	items: string[],
	config: RegistryConsumerConfig = {},
	options: ResolveRegistryOptions = {},
): Promise<RegistryResolvedItemsTree> {
	const payload: RegistryItem[] = [];
	const visited = new Set<string>();

	const visit = async (address: string) => {
		if (visited.has(address)) {
			return;
		}
		visited.add(address);

		const item = registryItemSchema.parse(await fetchRegistryItem(address, config, options));

		for (const dependency of item.registryDependencies ?? []) {
			await visit(dependency);
		}

		payload.push(item);
	};

	for (const item of items) {
		await visit(item);
	}

	const filesByTarget = new Map<string, NonNullable<RegistryItem['files']>[number]>();
	for (const item of payload) {
		for (const file of item.files ?? []) {
			filesByTarget.set(file.target ?? file.path, file);
		}
	}

	const docs = payload
		.map((item) => item.docs)
		.filter((doc): doc is string => !!doc)
		.join('\n');

	const tree = registryResolvedItemsTreeSchema.parse({
		dependencies: dedupe(payload.flatMap((item) => item.dependencies ?? [])),
		devDependencies: dedupe(payload.flatMap((item) => item.devDependencies ?? [])),
		files: [...filesByTarget.values()],
		tailwind: mergeObjects(payload.map((item) => item.tailwind)),
		cssVars: mergeObjects(payload.map((item) => item.cssVars)),
		css: mergeObjects(payload.map((item) => item.css)),
		docs: docs || undefined,
	});

	return tree;
}

export async function resolveRegistryItemList(
	items: string[],
	config: RegistryConsumerConfig = {},
	options: ResolveRegistryOptions = {},
): Promise<RegistryItem[]> {
	const payload: RegistryItem[] = [];
	const visited = new Set<string>();

	const visit = async (address: string) => {
		if (visited.has(address)) {
			return;
		}
		visited.add(address);
		const item = registryItemSchema.parse(await fetchRegistryItem(address, config, options));
		for (const dependency of item.registryDependencies ?? []) {
			await visit(dependency);
		}
		payload.push(item);
	};

	for (const item of items) {
		await visit(item);
	}

	return payload;
}
