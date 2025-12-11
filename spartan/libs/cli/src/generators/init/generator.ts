import { addDependenciesToPackageJson, type GeneratorCallback, logger, runTasksInSerial, type Tree } from '@nx/devkit';
import { getInstalledPackageVersion } from '../../utils/version-utils';
import { buildDependencyArray, buildDevDependencyArray } from '../base/lib/build-dependency-array';
import type { HlmBaseGeneratorSchema } from '../base/schema';
import { FALLBACK_ANGULAR_CDK_VERSION } from '../base/versions';
import addThemeToApplicationGenerator from '../theme/generator';

export async function spartanInitGenerator(tree: Tree) {
	logger.info('Initializing Spartan UI Library...');

	const cdkVersionStr = getInstalledPackageVersion(tree, '@angular/cdk', FALLBACK_ANGULAR_CDK_VERSION, true);

	const dependencies: Record<string, string> = buildDependencyArray(tree, {} as HlmBaseGeneratorSchema, cdkVersionStr);
	const devDependencies: Record<string, string> = buildDevDependencyArray(tree);

	const tasks: GeneratorCallback[] = [];

	if (Object.entries(dependencies).length > 0 || Object.entries(devDependencies).length > 0) {
		tasks.push(addDependenciesToPackageJson(tree, dependencies, devDependencies));
	}

	await addThemeToApplicationGenerator(tree, true);

	return runTasksInSerial(...tasks);
}

export default spartanInitGenerator;
