import { type Tree, readJson } from '@nx/devkit';
import { prompt } from 'enquirer';

const configPath = 'components.json';

export type Config = {
	componentsPath: string;
	buildable: boolean;
};

export async function getOrCreateConfig(tree: Tree, defaults?: Partial<Config>): Promise<Config> {
	if (tree.exists(configPath)) {
		return readJson(tree, configPath) as Promise<Config>; // TODO: Parse with zod and handle errors
	}

	console.log('Configuration file not found, creating a new one...');

	const { componentsPath, buildable } = (await prompt([
		{
			type: 'input',
			required: true,
			name: 'componentsPath',
			message: 'Choose a directory to place your spartan libraries, e.g. libs/ui',
			initial: defaults?.componentsPath ?? 'libs/ui',
			skip: !!defaults?.componentsPath,
		},
		{
			type: 'confirm',
			name: 'buildable',
			message: 'Should the libraries be buildable?',
			initial: defaults?.buildable ?? true,
			skip: typeof defaults?.buildable === 'boolean',
		},
	])) as { componentsPath: string; buildable: boolean };

	const config = { componentsPath, buildable };

	tree.write(configPath, JSON.stringify(config, null, 2));

	return config;
}
