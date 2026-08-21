import { readJson, type Tree } from '@nx/devkit';
import { BUILTIN_REGISTRIES, searchRegistry } from '../../registry';
import type { SpartanRegistrySearchSchema } from './schema';

export default async function registrySearchGenerator(tree: Tree, options: SpartanRegistrySearchSchema) {
	const config = tree.exists('components.json') ? readJson(tree, 'components.json') : {};
	const registries =
		options.registries
			?.split(',')
			.map((item) => item.trim())
			.filter(Boolean) ?? Object.keys({ ...BUILTIN_REGISTRIES, ...(config.registries ?? {}) });
	const results = (
		await Promise.all(
			registries.map((registry) =>
				searchRegistry(registry, config, {
					query: options.query,
					types: options.type
						?.split(',')
						.map((type) => type.trim())
						.filter(Boolean),
					limit: options.limit ?? 100,
					offset: options.offset ?? 0,
				}).catch((error) => [{ registry, error: error instanceof Error ? error.message : String(error) }]),
			),
		)
	).flat();

	if (options.json) {
		console.log(JSON.stringify(results, null, 2));
		return;
	}

	for (const result of results) {
		if ('error' in result) {
			console.log(`${result.registry}: ${result.error}`);
		} else {
			console.log(`${result.addCommandArgument}\t${result.type ?? ''}\t${result.description ?? ''}`);
		}
	}
}
