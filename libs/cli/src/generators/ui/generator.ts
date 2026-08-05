import { type GeneratorCallback, getProjects, runTasksInSerial, type Tree } from '@nx/devkit';

import { prompt } from 'enquirer';
import { resolveRegistryItemList } from '../../registry';
import { backfillStyleInComponentsJson, type Config, loadOrInitConfig } from '../../utils/config';
import type { Style } from '../../utils/supported-styles';
import { hlmRegistryItemGenerator } from '../base/generator';
import type { GenerateAs } from '../base/lib/generate-as';
import { initializeAngularEntrypoint } from '../base/lib/initialize-angular-library';
import { singleLibName } from '../base/lib/single-lib-name';
import type { HlmBaseGeneratorSchema } from '../base/schema';
import type { Primitive } from './primitives';
import { createFirstPartyRegistryItem } from './registry/first-party';
import type { HlmUIGeneratorSchema } from './schema';

type PrimitiveResponse = string | 'all';

export default async function hlmUIGenerator(tree: Tree, options: HlmUIGeneratorSchema & { angularCli?: boolean }) {
	const tasks: GeneratorCallback[] = [];
	await backfillStyleInComponentsJson(tree);
	const config = await loadOrInitConfig(tree, {
		componentsPath: options.directory,
		angularCli: options.angularCli ?? true,
	});

	const availablePrimitives: PrimitiveDefinitions = await import('./supported-ui-libraries.json').then(
		(m) => m.default,
	);
	const availablePrimitiveNames: Primitive[] = Object.keys(availablePrimitives) as Primitive[];

	let response: { primitives: PrimitiveResponse[] } = { primitives: [] };
	if (options.name) {
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
		style?: Style;
	},
	config: Config,
) {
	const allPrimitivesSelected = response.primitives.includes('all');
	const primitivesToCreate = allPrimitivesSelected ? availablePrimitiveNames : response.primitives;
	const tasks: GeneratorCallback[] = [];

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
			buildable: config.buildable ?? true,
			importAlias: config.importAlias,
			style: config.style,
		});
		tasks.push(task);
	}

	const registryItems = await resolveRegistryItemList(
		primitivesToCreate.map((primitive) =>
			availablePrimitiveNames.includes(primitive as Primitive) ? `@spartan/${primitive}` : primitive,
		),
		{ style: options.style ?? config.style, registries: config.registries },
		{ builtinItemFactory: createFirstPartyRegistryItem },
	);

	const installTasks = [];
	for (const item of registryItems) {
		if (item.type !== 'registry:ui') {
			continue;
		}

		installTasks.push(
			await hlmRegistryItemGenerator(
				tree,
				{
					name: item.name,
					directory: options.directory ?? config.componentsPath,
					tags: options.tags,
					rootProject: options.rootProject,
					angularCli: options.angularCli,
					buildable: options.buildable ?? config.buildable ?? true,
					generateAs: options.generateAs ?? config.generateAs ?? 'library',
					importAlias: options.importAlias ?? config.importAlias ?? `@spartan-ng/helm`,
					style: options.style ?? config.style,
					overwrite: options.overwrite,
					dryRun: options.dryRun,
				} satisfies HlmBaseGeneratorSchema,
				item,
			),
		);
	}

	tasks.push(...installTasks.filter(Boolean));

	return tasks;
}

interface PrimitiveDefinitions {
	[componentName: string]: {
		name: string;
		peerDependencies: Record<string, string>;
	};
}
