import {
	addDependenciesToPackageJson,
	generateFiles,
	type GeneratorCallback,
	logger,
	runTasksInSerial,
	type Tree,
} from '@nx/devkit';
import { prompt } from 'enquirer';
import path from 'node:path';
import { getInstalledPackageVersion } from '../../utils/version-utils';
import { buildDependencyArray } from '../base/lib/build-dependency-array';
import type { HlmBaseGeneratorSchema } from '../base/schema';
import { FALLBACK_ANGULAR_VERSION, TW_ANIMATE_CSS } from '../base/versions';
import addThemeToApplicationGenerator from '../theme/generator';
import type { InitGeneratorSchema } from './schema';

export async function spartanInitGenerator(
	tree: Tree,
	{ installTailwind, addDependencies, applyTheming }: InitGeneratorSchema,
) {
	logger.info('Initializing Spartan UI Library...');

	let dependencies: Record<string, string> = {};
	let devDependencies: Record<string, string> = {};
	const tasks: GeneratorCallback[] = [];

	if (installTailwind) {
		dependencies = {
			tailwindcss: await getLatestVersion('tailwindcss'),
			'@tailwindcss/postcss': await getLatestVersion('@tailwindcss/postcss'),
			postcss: await getLatestVersion('postcss'),
		};

		devDependencies = { ...devDependencies, 'tw-animate-css': TW_ANIMATE_CSS };

		const { confirm } = (await prompt({
			type: 'confirm',
			name: 'confirm',
			message: 'Do you want to add a Postcss config file?',
			initial: true,
		})) as { confirm: boolean };
		if (confirm) {
			generateFiles(tree, path.join(__dirname, 'lib', 'postcss'), '', {});
		}
	}

	if (addDependencies) {
		const angularVersionStr = getInstalledPackageVersion(tree, '@angular/core', FALLBACK_ANGULAR_VERSION, true);
		const cdkVersionStr = await getLatestVersion('@angular/cdk');
		dependencies = {
			...dependencies,
			...buildDependencyArray(tree, {} as HlmBaseGeneratorSchema, angularVersionStr, cdkVersionStr),
		};
	}

	if (Object.entries(dependencies).length > 0 || Object.entries(devDependencies).length > 0) {
		tasks.push(addDependenciesToPackageJson(tree, dependencies, devDependencies));
	}

	if (applyTheming) {
		await addThemeToApplicationGenerator(tree, installTailwind);
	}

	return runTasksInSerial(...tasks);
}

export async function getLatestVersion(pkgName: string): Promise<string> {
	const url = `https://registry.npmjs.org/${pkgName.replace('/', '%2F')}/latest`;
	const res = await fetch(url);

	if (!res.ok) {
		throw new Error(`Failed to fetch version for ${pkgName}`);
	}

	const data = await res.json();
	return `^${data.version}`;
}

export default spartanInitGenerator;
