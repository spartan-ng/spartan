import { formatFiles, logger, readJson, type Tree, updateJson } from '@nx/devkit';
import { getRootTsConfigPathInTree } from '@nx/js';
import { prompt } from 'enquirer';
import { existsSync } from 'node:fs';
import { dirname, join } from 'path';
import { getOrCreateConfig } from '../../utils/config';
import { readTsConfigPathsFromTree } from '../../utils/tsconfig';
import { deleteFiles } from '../base/lib/deleteFiles';
import type { SupportedLibraries } from '../base/lib/supported-libs';
import { createPrimitiveLibraries } from '../ui/generator';
import type { Primitive } from '../ui/primitives';
import type { MigrateHelmLibrariesGeneratorSchema } from './schema';

type RemoveGenerator = (
	tree: Tree,
	schema: { projectName: string; forceRemove: boolean; skipFormat: boolean; importPath: string },
) => Promise<unknown>;

// `@nx/workspace`'s `removeGenerator` is reachable two ways, each broken on a different nx version:
// importing the package entry eagerly evaluates `convert-to-nx-project`, whose `output.js` crashes
// ("Cannot read properties of undefined (reading 'inverse')") due to a chalk/tslib interop issue
// (see https://github.com/nrwl/nx/issues/35521), while the deep `@nx/workspace/src/...` specifier is
// blocked by the package's `exports` map on nx 23+ (where the compiled file also moved to `dist/`).
// Resolve the compiled generator by absolute path instead: that bypasses the `exports` gate and never
// loads the crashing barrel. Lazy, so it only runs when a library actually has to be removed.
async function loadRemoveGenerator(): Promise<RemoveGenerator> {
	const workspaceRoot = dirname(require.resolve('@nx/workspace/package.json'));
	const candidates = [
		join(workspaceRoot, 'dist', 'src', 'generators', 'remove', 'remove.js'), // nx 23+
		join(workspaceRoot, 'src', 'generators', 'remove', 'remove.js'), // nx <= 22
	];
	for (const candidate of candidates) {
		if (existsSync(candidate)) {
			const mod = await import(candidate);
			return mod.removeGenerator as RemoveGenerator;
		}
	}
	throw new Error(
		`Could not locate the @nx/workspace remove generator (looked in: ${candidates.join(', ')}). Please report this with your nx version.`,
	);
}

export async function migrateHelmLibrariesGenerator(tree: Tree, options: MigrateHelmLibrariesGeneratorSchema) {
	// Detect the libraries that are already installed

	const config = await getOrCreateConfig(tree, { angularCli: options.angularCli });

	const existingLibraries = await detectLibraries(tree, config.importAlias);

	if (existingLibraries.length === 0) {
		logger.info('No libraries to migrate');
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

			const removeGenerator = await loadRemoveGenerator();
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
