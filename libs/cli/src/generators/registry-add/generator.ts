import { readJson, type Tree, updateJson } from '@nx/devkit';
import { prompt } from 'enquirer';
import { BUILTIN_REGISTRIES } from '../../registry';
import type { SpartanRegistryAddSchema } from './schema';

function parseRegistrySpec(spec: string) {
	const [namespace, ...rest] = spec.split('=');
	const url = rest.join('=');
	if (!namespace.startsWith('@')) {
		throw new Error(`Invalid registry namespace: ${namespace}. Registry names must start with @.`);
	}
	if (!url.includes('{name}')) {
		throw new Error(`Invalid registry URL for ${namespace}. URL must include {name}.`);
	}
	if (namespace in BUILTIN_REGISTRIES) {
		throw new Error(`${namespace} is a built-in registry and cannot be overridden.`);
	}
	return { namespace, url };
}

export default async function registryAddGenerator(tree: Tree, options: SpartanRegistryAddSchema) {
	const registries =
		options.registries
			?.split(',')
			.map((value) => value.trim())
			.filter(Boolean) ??
		(
			await prompt<{ registries: string }>({
				type: 'input',
				name: 'registries',
				required: true,
				message: 'Registries to add, e.g. @acme=https://example.com/r/{name}.json',
			})
		).registries
			.split(',')
			.map((value) => value.trim())
			.filter(Boolean);

	if (!tree.exists('components.json')) {
		tree.write('components.json', JSON.stringify({ registries: {} }, null, 2));
	}

	const current = readJson(tree, 'components.json');
	const additions = Object.fromEntries(registries.map(parseRegistrySpec).map(({ namespace, url }) => [namespace, url]));

	updateJson(tree, 'components.json', (json) => ({
		...json,
		registries: {
			...(current.registries ?? {}),
			...additions,
		},
	}));
}
