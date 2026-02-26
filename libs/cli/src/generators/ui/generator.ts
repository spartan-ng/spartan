import { type GeneratorCallback, getProjects, readJson, runTasksInSerial, type Tree } from '@nx/devkit';
import { prompt } from 'enquirer';
import { dirname } from 'path';
import { type Config, getOrCreateConfig } from '../../utils/config';
import { readTsConfigPathsFromTree } from '../../utils/tsconfig';
import type { GenerateAs } from '../base/lib/generate-as';
import { initializeAngularEntrypoint } from '../base/lib/initialize-angular-library';
import { singleLibName } from '../base/lib/single-lib-name';
import type { HlmBaseGeneratorSchema } from '../base/schema';
import { addDependentPrimitives } from './add-dependent-primitive';
import type { Primitive } from './primitives';
import type { HlmUIGeneratorSchema } from './schema';

type PrimitiveResponse = Primitive | 'all';

export default async function hlmUIGenerator(tree: Tree, options: HlmUIGeneratorSchema & { angularCli?: boolean }) {
	const tasks: GeneratorCallback[] = [];
	const config = await getOrCreateConfig(tree, {
		componentsPath: options.directory,
		angularCli: options.angularCli,
	});

	const availablePrimitives: PrimitiveDefinitions = await import('./supported-ui-libraries.json').then(
		(m) => m.default,
	);
	const availablePrimitiveNames: Primitive[] = Object.keys(availablePrimitives) as Primitive[];

	let response: { primitives: PrimitiveResponse[] } = { primitives: [] };
	if (options.name && availablePrimitiveNames.includes(options.name)) {
		response.primitives.push(options.name);
	} else {
		if (options.name) {
			console.log('Cannot resolve primitive with name:', options.name);
		}
		response = await prompt({
			type: 'multiselect',
			required: true,
			name: 'primitives',
			message: 'Choose which primitives you want to copy',
			choices: ['all', ...availablePrimitiveNames.sort()],
		});
	}
	tasks.push(
		...(await createPrimitiveLibraries(response, availablePrimitiveNames, availablePrimitives, tree, options, config)),
	);

	return runTasksInSerial(...tasks);
}

export async function createPrimitiveLibraries(
	response: {
		primitives: PrimitiveResponse[];
	},
	availablePrimitiveNames: Primitive[],
	availablePrimitives: PrimitiveDefinitions,
	tree: Tree,
	options: HlmUIGeneratorSchema & {
		angularCli?: boolean;
		installPeerDependencies?: boolean | string | undefined;
		buildable?: boolean;
		generateAs?: GenerateAs;
		importAlias?: string;
	},
	config: Config,
) {
	const allPrimitivesSelected = response.primitives.includes('all');
	const primitivesToCreate = allPrimitivesSelected ? availablePrimitiveNames : response.primitives;
	const tasks: GeneratorCallback[] = [];
	const installPeerDependencies =
		options.installPeerDependencies === undefined
			? true
			: typeof options.installPeerDependencies === 'string'
				? options.installPeerDependencies === 'true'
				: options.installPeerDependencies;

	if (!response.primitives.includes('all') && installPeerDependencies) {
		await addDependentPrimitives(primitivesToCreate, false);
	}

	const projects = getProjects(tree);

	if (
		typeof config.generateAs === 'string' &&
		config.generateAs === 'entrypoint' &&
		!options.angularCli &&
		!projects.has(singleLibName)
	) {
		const task = await initializeAngularEntrypoint(tree, {
			tags: options.tags,
			directory: options.directory ?? config.componentsPath,
			buildable: config.buildable,
			importAlias: config.importAlias,
		});
		tasks.push(task);
	}

	// Use Promise.all() to handle parallel execution of primitive library creation tasks
	const installTasks = await Promise.all(
		primitivesToCreate.map(async (primitiveName) => {
			const name = availablePrimitives[primitiveName].name;
			const peerDependencies = removeHelmKeys(availablePrimitives[primitiveName].peerDependencies);
			const { generator } = await import(`./libs/${name}/generator`);

			return generator(tree, {
				name: '',
				peerDependencies,
				directory: options.directory ?? config.componentsPath,
				tags: options.tags,
				rootProject: options.rootProject,
				angularCli: options.angularCli,
				buildable: options.buildable ?? config.buildable,
				generateAs: options.generateAs ?? config.generateAs ?? 'library',
				importAlias: options.importAlias ?? config.importAlias ?? `@spartan-ng/helm`,
			} satisfies HlmBaseGeneratorSchema);
		}),
	);

	tasks.push(...installTasks.filter(Boolean));

	await saveLibrariesMetadata(
		tree,
		primitivesToCreate,
		options.importAlias ?? config.importAlias ?? '@spartan-ng/helm',
	);

	return tasks;
}

/**
 * Save metadata for newly created libraries to enable future customization detection
 */
async function saveLibrariesMetadata(tree: Tree, primitives: PrimitiveResponse[], importAlias: string): Promise<void> {
	// Dynamically import to avoid circular dependencies
	const { updateLibraryMetadata } = await import('../migrate-helm-libraries/detect-customizations');

	// Get current package version
	const packageJsonPath = 'package.json';
	let version = '1.0.0';

	if (tree.exists(packageJsonPath)) {
		const packageJson = readJson(tree, packageJsonPath);
		version = packageJson.dependencies?.['@spartan-ng/cli'] || packageJson.version || '1.0.0';
	}

	for (const primitive of primitives) {
		// skip certain primitives that are not libraries
		if (primitive === 'all' || primitive === 'sonner') {
			continue;
		}

		try {
			const libraryPath = getLibraryPathFromPrimitive(tree, primitive, importAlias);
			if (libraryPath) {
				updateLibraryMetadata(tree, primitive, libraryPath, version);
			}
		} catch (error) {
			// If library path can't be found, it might not have been created yet
			// we'll just skip saving metadata for it
		}
	}
}

/**
 * Helper to get library path from primitive name
 */
function getLibraryPathFromPrimitive(tree: Tree, primitive: Primitive, importAlias: string): string | null {
	try {
		const tsconfigPaths = readTsConfigPathsFromTree(tree);
		const compatLibrary = primitive.toString().replaceAll('-', '');

		let importPath: string | undefined;

		if (`${importAlias}/${primitive}` in tsconfigPaths) {
			importPath = `${importAlias}/${primitive}`;
		} else if (`@spartan-ng/helm/${primitive}` in tsconfigPaths) {
			importPath = `@spartan-ng/helm/${primitive}`;
		} else if (`@spartan-ng/ui-${primitive}-helm` in tsconfigPaths) {
			importPath = `@spartan-ng/ui-${primitive}-helm`;
		} else if (`@spartan-ng/ui-${compatLibrary}-helm` in tsconfigPaths) {
			importPath = `@spartan-ng/ui-${compatLibrary}-helm`;
		}

		if (!importPath) {
			return null;
		}

		const tsconfigPath = tsconfigPaths[importPath];
		if (!tsconfigPath) {
			return null;
		}

		const path = tsconfigPath[0];
		return dirname(path).replace(/\/src$/, '');
	} catch {
		return null;
	}
}

const removeHelmKeys = (obj: Record<string, string>) =>
	Object.fromEntries(Object.entries(obj).filter(([key]) => !key.toLowerCase().includes('helm')));

interface PrimitiveDefinitions {
	[componentName: string]: {
		name: string;
		peerDependencies: Record<string, string>;
	};
}
