import { formatFiles, GeneratorCallback, runTasksInSerial, Tree } from '@nx/devkit';
import { getRootTsConfigPathInTree, readTsConfigPaths } from '@nx/js';
import { prompt } from 'enquirer';
import { default as hlmUIGenerator } from '../../generators/ui/generator';
import { HlmUIGeneratorSchema } from '../ui/schema';

export async function spartanUpdaterGenerator(
	tree: Tree,
	options: HlmUIGeneratorSchema & { angularCli?: boolean; skipFormat?: boolean },
) {
	const existingPathsByAlias = readTsConfigPaths(getRootTsConfigPathInTree(tree)) ?? {};

	/** get all spartan packages from tsconfigPaths, to only prompt for the ones that are installed */
	const spartanPackages = Object.keys(existingPathsByAlias).filter((path) => path.startsWith('@spartan-ng/ui-'));
	const primitiveNames = spartanPackages.map((pkg) => pkg.replace('@spartan-ng/ui-', '').replace('-helm', ''));

	/** prompt which packages to update */
	const packagesToUpdate: { primitives: string[] } = await prompt({
		type: 'multiselect',
		required: true,
		name: 'primitives',
		message: 'Choose which packages you want to update',
		choices: ['all', ...primitiveNames.sort()],
	});
	let primitivesToUpdate = packagesToUpdate.primitives;
	if (primitivesToUpdate.includes('all')) {
		primitivesToUpdate = primitiveNames;
	}

	const tasks: GeneratorCallback[] = [];

	for (const packageName of primitivesToUpdate) {
		tasks.push(
			await hlmUIGenerator(tree, {
				...options,
				name: packageName,
				update: true,
			}),
		);
	}
	await runTasksInSerial(...tasks)();

	if (!options.skipFormat) {
		await formatFiles(tree);
	}
}

export default spartanUpdaterGenerator;
