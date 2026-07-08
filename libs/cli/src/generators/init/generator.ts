import { addDependenciesToPackageJson, type GeneratorCallback, logger, runTasksInSerial, type Tree } from '@nx/devkit';
import { getInstalledPackageVersion } from '../../utils/version-utils';
import { buildDependencyArray, buildDevDependencyArray } from '../base/lib/build-dependency-array';
import { filterUnregisteredDependencies } from '../base/lib/package-json-dependencies';
import type { HlmBaseGeneratorSchema } from '../base/schema';
import { FALLBACK_ANGULAR_CDK_VERSION } from '../base/versions';
import addThemeToApplicationGenerator from '../theme/generator';
import type { SpartanInitGeneratorSchema } from './schema';

export async function spartanInitGenerator(tree: Tree, options: SpartanInitGeneratorSchema = {}) {
	logger.info('Initializing Spartan UI Library...');

	const cdkVersionStr = getInstalledPackageVersion(tree, '@angular/cdk', FALLBACK_ANGULAR_CDK_VERSION, true);

	const { dependencies, devDependencies } = filterUnregisteredDependencies(
		tree,
		buildDependencyArray(tree, {} as HlmBaseGeneratorSchema, cdkVersionStr),
		buildDevDependencyArray(),
	);

	const tasks: GeneratorCallback[] = [];

	if (Object.keys(dependencies).length > 0 || Object.keys(devDependencies).length > 0) {
		tasks.push(addDependenciesToPackageJson(tree, dependencies, devDependencies));
	}

	await addThemeToApplicationGenerator(tree, { ...options, setupTailwindCss: true });

	return runTasksInSerial(...tasks);
}

export default spartanInitGenerator;
