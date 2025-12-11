import { type GeneratorCallback, getProjects, runTasksInSerial, type Tree } from '@nx/devkit';
import { prompt } from 'enquirer';
import { type Config, getOrCreateConfig } from '../../utils/config';
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

	return tasks;
}

const removeHelmKeys = (obj: Record<string, string>) =>
	Object.fromEntries(Object.entries(obj).filter(([key]) => !key.toLowerCase().includes('helm')));

interface PrimitiveDefinitions {
	[componentName: string]: {
		name: string;
		peerDependencies: Record<string, string>;
	};
}
