import { formatFiles, logger, Tree, updateJson } from '@nx/devkit';
import { getRootTsConfigPathInTree } from '@nx/js';
import { removeGenerator } from '@nx/workspace';
import { prompt } from 'enquirer';
import { dirname } from 'path';
import { getOrCreateConfig } from '../../utils/config';
import { readTsConfigPathsFromTree } from '../../utils/tsconfig';
import { deleteFiles } from '../base/lib/deleteFiles';
import { createPrimitiveLibraries } from '../ui/generator';
import { Primitive } from '../ui/primitives';
import { MigrateHelmLibrariesGeneratorSchema } from './schema';

export async function migrateHelmLibrariesGenerator(tree: Tree, options: MigrateHelmLibrariesGeneratorSchema) {
	// Detect the libraries that are already installed
	const existingLibraries = await detectLibraries(tree);

	if (existingLibraries.length === 0) {
		logger.info('No libraries to migrate');
		return;
	}

	// if we are running in Jest we can't use the enquirer prompt
	if (process.env.JEST_WORKER_ID) {
		return;
	}

	// allow the user to select which libraries to migrate
	const selectedLibraries = await prompt({
		type: 'multiselect',
		name: 'libraries',
		message: 'The following libraries are installed. Select the ones you want to replace with the latest version:',
		choices: ['all', ...existingLibraries],
	});

	// prompt the user to confirm their actions as this will overwrite the existing libraries and remove any customizations
	const confirmation = (await prompt({
		type: 'confirm',
		name: 'confirm',
		message:
			'Are you sure you want to update the selected libraries? This will overwrite the existing libraries and remove any customizations.',
	})) as { confirm: boolean };

	if (!confirmation.confirm) {
		logger.info('Aborting migration.');
		return;
	}

	let { libraries } = selectedLibraries as { libraries: (Primitive | 'all')[] };

	if (libraries.length === 0) {
		logger.info('No libraries will be updated.');
		return;
	}

	// if the user selected all libraries then we will update all libraries
	if (libraries.includes('all')) {
		libraries = existingLibraries;
	}

	await removeExistingLibraries(tree, options, libraries as Primitive[]);
	await regenerateLibraries(tree, options, libraries as Primitive[]);

	await formatFiles(tree);
}

export default migrateHelmLibrariesGenerator;

async function detectLibraries(tree: Tree): Promise<Primitive[]> {
	const supportedLibraries = (await import('../ui/supported-ui-libraries.json').then(
		(m) => m.default,
	)) as SupportedLibraries;
	const tsconfigPaths = readTsConfigPathsFromTree(tree);

	// store the list of libraries in the tsconfig
	const existingLibraries: Primitive[] = [];

	for (const libraryName in supportedLibraries) {
		if (tsconfigPaths[`@spartan-ng/ui-${libraryName}-helm`]) {
			existingLibraries.push(libraryName as Primitive);
		} else if (tsconfigPaths[`@spartan-ng/ui-${libraryName.replaceAll('-', '')}-helm`]) {
			existingLibraries.push(libraryName as Primitive);
		} else if (tsconfigPaths[`@spartan-ng/helm/${libraryName}`]) {
			existingLibraries.push(libraryName as Primitive);
		}
	}

	return existingLibraries;
}

async function removeExistingLibraries(
	tree: Tree,
	options: MigrateHelmLibrariesGeneratorSchema,
	libraries: Primitive[],
) {
	const tsconfigPaths = readTsConfigPathsFromTree(tree);

	for (const library of libraries) {
		// determine the library path
		let importPath: string;
		let libraryName = library.toString();
		const compatLibrary = library.toString().replaceAll('-', '');

		if (`@spartan-ng/helm/${library}` in tsconfigPaths) {
			importPath = `@spartan-ng/helm/${library}`;
		} else if (`@spartan-ng/ui-${library}-helm` in tsconfigPaths) {
			importPath = `@spartan-ng/ui-${library}-helm`;
		} // there is also a case where the library previous was added without hypens e.g. ui-aspectratio-helm
		else if (`@spartan-ng/ui-${compatLibrary}-helm` in tsconfigPaths) {
			importPath = `@spartan-ng/ui-${compatLibrary}-helm`;
			libraryName = compatLibrary;
		}

		// get the tsconfig path for the library
		const tsconfigPath = tsconfigPaths[importPath];
		if (!tsconfigPath || !importPath) {
			throw new Error(`Could not find tsconfig path for library ${library}`);
		}

		// if there is more than one path then we assume we should use the first one
		const path = tsconfigPath[0];

		// if we are in the Nx CLI we can use the nx generator to remove a library
		if (!options.angularCli) {
			await removeGenerator(tree, {
				projectName: `ui-${libraryName}-helm`,
				forceRemove: true,
				skipFormat: true,
				importPath,
			});
		} else {
			// get the directory of the path e.g. ./libs/ui/ui-aspectratio-helm/src/index.ts
			// we want to remove the directory ./libs/ui/ui-aspectratio-helm so we need to remove the last part of the path
			// and the src directory
			const directory = dirname(path).replace(/\/src$/, '');

			// recursively remove all files in the directory
			deleteFiles(tree, directory);

			// remove the path from the tsconfig
			updateJson(tree, getRootTsConfigPathInTree(tree), (json) => {
				delete json.compilerOptions.paths[importPath];
				return json;
			});
		}
	}
}

async function regenerateLibraries(tree: Tree, options: MigrateHelmLibrariesGeneratorSchema, libraries: Primitive[]) {
	const supportedLibraries = (await import('../ui/supported-ui-libraries.json').then(
		(m) => m.default,
	)) as SupportedLibraries;
	const config = await getOrCreateConfig(tree);

	await createPrimitiveLibraries(
		{
			primitives: libraries,
		},
		Object.keys(supportedLibraries) as Primitive[],
		supportedLibraries,
		tree,
		{ ...options, installPeerDependencies: false },
		config,
	);
}

type SupportedLibraries = Record<string, SupportedLibrary>;

interface SupportedLibrary {
	internalName: string;
	peerDependencies: Record<string, string>;
}
