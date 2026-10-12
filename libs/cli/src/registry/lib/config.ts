import type { z } from 'zod';
import type { registryConfigItemSchema } from '../schema/schema';
import { BUILTIN_REGISTRIES } from './constants';
import { parseRegistryAndItemFromString } from './parser';
import { isLocalFile, isUrl } from './utils';

export type RegistryConfigItem = z.infer<typeof registryConfigItemSchema>;
export type RegistryConfig = Record<string, RegistryConfigItem>;

export interface RegistryConsumerConfig {
	style?: string;
	registries?: RegistryConfig;
}

export function registryConfigWithDefaults(config: RegistryConsumerConfig = {}): Required<RegistryConsumerConfig> {
	return {
		style: config.style ?? 'vega',
		registries: {
			...BUILTIN_REGISTRIES,
			...(config.registries ?? {}),
		},
	};
}

export function buildUrlFromRegistryConfig(
	item: string,
	registryConfig: RegistryConfigItem,
	config?: RegistryConsumerConfig,
) {
	const replacePlaceholders = (value: string) =>
		value.replaceAll('{name}', item).replaceAll('{style}', config?.style ?? 'vega');

	if (typeof registryConfig === 'string') {
		return replacePlaceholders(registryConfig);
	}

	const url = new URL(replacePlaceholders(registryConfig.url));
	for (const [key, value] of Object.entries(registryConfig.params ?? {})) {
		if (value) {
			url.searchParams.set(key, value);
		}
	}
	return url.toString();
}

export function buildHeadersFromRegistryConfig(registryConfig: RegistryConfigItem): Record<string, string> {
	if (typeof registryConfig === 'string') {
		return {};
	}

	const headers: Record<string, string> = {};
	for (const [key, value] of Object.entries(registryConfig.headers ?? {})) {
		if (value.trim()) {
			headers[key] = value;
		}
	}
	return headers;
}

export function buildUrlAndHeadersForRegistryItem(name: string, config: RegistryConsumerConfig = {}) {
	const resolvedConfig = registryConfigWithDefaults(config);
	let { registry, item } = parseRegistryAndItemFromString(name);

	if (!registry) {
		if (isUrl(name) || isLocalFile(name)) {
			return null;
		}
		registry = '@spartan';
		item = name;
	}

	const registryConfig = resolvedConfig.registries[registry];
	if (!registryConfig) {
		throw new Error(`Registry ${registry} is not configured.`);
	}

	return {
		url: buildUrlFromRegistryConfig(item, registryConfig, resolvedConfig),
		headers: buildHeadersFromRegistryConfig(registryConfig),
		registry,
		item,
	};
}
