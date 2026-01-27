import { formatFiles, logger, readJson, type Tree, updateJson } from '@nx/devkit';
import { getRootTsConfigPathInTree } from '@nx/js';
import { removeGenerator } from '@nx/workspace';
import { prompt } from 'enquirer';
import { dirname, join } from 'path';
import { getOrCreateConfig } from '../../utils/config';
import { readTsConfigPathsFromTree } from '../../utils/tsconfig';
import { deleteFiles } from '../base/lib/deleteFiles';
import type { SupportedLibraries } from '../base/lib/supported-libs';
import { createPrimitiveLibraries } from '../ui/generator';
import type { Primitive } from '../ui/primitives';
import type { MigrateHelmLibrariesGeneratorSchema } from './schema';

export async function migrateHelmLibrariesGenerator(tree: Tree, options: MigrateHelmLibrariesGeneratorSchema) {
	// Detect the libraries that are already installed

	const config = await getOrCreateConfig(tree, { angularCli: options.angularCli });

	const existingLibraries = await detectLibraries(tree, config.importAlias);

	if (existingLibraries.length === 0) {
		logger.info('No libraries to migrate');
		return;
	}

	const { unchanged, customized } = categorizeLibraries(tree, existingLibraries, (primitive) =>
		getLibraryPathFromPrimitive(tree, primitive, config.importAlias),
	);

	logger.info(`\n\r📋  Migration Overview:`);
	logger.info(`   ✓ ${unchanged.length} unchanged libraries (can be safely migrated)`);
	logger.info(`   ⚠ ${customized.length} customized libraries (contains modifications)\n`);

	// Show information about customized libraries
	if (customized.length > 0) {
		logger.warn('⚠️  Customized libraries detected:\n');
		for (const { primitive, details } of customized) {
			logger.warn(`   📦 ${primitive}:`);
			if (details.modifiedFiles.length > 0) {
				logger.warn(`      - Modified: ${details.modifiedFiles.join(', ')}`);
			}
			if (details.addedFiles.length > 0) {
				logger.log(`\x1b[1;32m      - Added: ${details.addedFiles.join(', ')}\x1b[0m`);
			}
			if (details.deletedFiles.length > 0) {
				logger.error(`      - Deleted: ${details.deletedFiles.join(', ')}`);
			}
		}
		logger.warn('');
	}

	const choices: Array<{ name: string; message: string }> = [];

	// Add "all" as first option
	choices.push({ name: 'all', message: 'all' });

	// Add category options if there are both types
	if (unchanged.length > 0 && customized.length > 0) {
		choices.push({ name: 'all-unchanged', message: 'all-unchanged' });
		choices.push({ name: 'all-customized', message: 'all-customized ⚠️' });
	}

	if (unchanged.length > 0) {
		for (const lib of unchanged) {
			choices.push({ name: lib, message: lib });
		}
	}

	if (customized.length > 0) {
		for (const { primitive } of customized) {
			choices.push({ name: primitive, message: `${primitive} ⚠️` });
		}
	}

	if (choices.length === 0) {
		logger.info('No libraries available to migrate.');
		return;
	}

	const selectedLibraries = await prompt({
		type: 'multiselect',
		name: 'libraries',
		message: 'The following libraries are installed. Select the ones you want to replace with the latest version:',
		choices: ['all', ...existingLibraries],
	});

	const { libraries } = selectedLibraries;

	if (libraries.length === 0) {
		logger.info('No libraries selected for migration.');
		return;
	}

	const librariesToMigrate: Primitive[] = [];

	if (libraries.includes('all')) {
		librariesToMigrate.push(...unchanged);
		librariesToMigrate.push(...customized.map((c) => c.primitive));
	} else {
		if (libraries.includes('all-unchanged')) {
			librariesToMigrate.push(...unchanged);
		}

		if (libraries.includes('all-customized')) {
			librariesToMigrate.push(...customized.map((c) => c.primitive));
		}
	}

	for (const lib of libraries) {
		if (lib !== 'all' && lib !== 'all-unchanged' && lib !== 'all-customized') {
			librariesToMigrate.push(lib as Primitive);
		}
	}

	const uniqueLibraries = [...new Set(librariesToMigrate)];
	const customizedSelected = uniqueLibraries.filter((lib) => customized.some((c) => c.primitive === lib));

	if (customizedSelected.length > 0) {
		logger.warn('\n⚠️  WARNING: The following customized libraries will be overwritten:');
		for (const lib of customizedSelected) {
			logger.warn(`   - ${lib}`);
		}
		logger.warn('\n   All customizations will be LOST!\n');

		const confirmation = await prompt<{ confirm: boolean }>({
			type: 'confirm',
			name: 'confirm',
			message: 'Are you sure you want to overwrite these customized libraries?',
			initial: false,
		});

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

	await removeExistingLibraries(
		tree,
		{ ...options, generateAs: config.generateAs, importAlias: config.importAlias },
		libraries as Primitive[],
	);
	await regenerateLibraries(
		tree,
		{ ...options, generateAs: config.generateAs, buildable: config.buildable },
		libraries as Primitive[],
	);

	await formatFiles(tree);
}

export default migrateHelmLibrariesGenerator;

async function detectLibraries(tree: Tree, importAlias: string): Promise<Primitive[]> {
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
		} else if (tsconfigPaths[`${importAlias}/${libraryName}`]) {
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
		const compatLibrary = library.toString().replaceAll('-', '');

		if (`${options.importAlias}/${library}` in tsconfigPaths) {
			importPath = `${options.importAlias}/${library}`;
		} else if (`@spartan-ng/helm/${library}` in tsconfigPaths) {
			importPath = `@spartan-ng/helm/${library}`;
		} else if (`@spartan-ng/ui-${library}-helm` in tsconfigPaths) {
			importPath = `@spartan-ng/ui-${library}-helm`;
		} // there is also a case where the library previous was added without hypens e.g. ui-aspectratio-helm
		else if (`@spartan-ng/ui-${compatLibrary}-helm` in tsconfigPaths) {
			importPath = `@spartan-ng/ui-${compatLibrary}-helm`;
		}

		// get the tsconfig path for the library

		const tsconfigPath = tsconfigPaths[importPath];

		if (!tsconfigPath || !importPath) {
			throw new Error(`Could not find tsconfig path for library ${library}`);
		}

		// if there is more than one path then we assume we should use the first one
		const path = tsconfigPath[0];

		// if we are in the Nx CLI we can use the nx generator to remove a library
		if (!options.angularCli && options.generateAs === 'library') {
			// We get the projectName from the project.json in the path of the library
			const projectRoot = dirname(path).replace(/\/src$/, '');
			const packageJsonPath = join(projectRoot, 'project.json');
			let projectName: string | undefined;

			if (tree.exists(packageJsonPath)) {
				const packageJson = readJson(tree, packageJsonPath);
				projectName = packageJson.name;
			}

			if (!projectName) {
				throw new Error(`Could not find the project name for library: ${library} in project root path ${projectRoot}`);
			}

			await removeGenerator(tree, {
				projectName,
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
	const config = await getOrCreateConfig(tree, { angularCli: options.angularCli });

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
