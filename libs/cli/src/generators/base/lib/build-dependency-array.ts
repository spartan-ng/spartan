import { type Tree } from '@nx/devkit';
import { getTailwindVersion } from '../../../utils/get-tailwind-version';
import type { HlmBaseGeneratorSchema } from '../schema';

import { execSync } from 'child_process';

export function buildDependencyArray(
	options: HlmBaseGeneratorSchema,
	angularVersion: string,
	existingCdkVersion: string,
) {
	let dependencies: Record<string, string> = {
		'@angular/cdk': existingCdkVersion ?? angularVersion,
		'@spartan-ng/brain': getLatestPkgVersion('@spartan-ng/brain'),
		'tailwind-merge': getLatestPkgVersion('tailwind-merge'),
	};

	if (options.peerDependencies) {
		dependencies = { ...dependencies, ...options.peerDependencies };
	}

	if (options.name === 'icon' || options.name === 'spinner') {
		dependencies['@ng-icons/core'] = getLatestPkgVersion('@ng-icons/core');
	}
	return dependencies;
}

export function buildDevDependencyArray(tree: Tree) {
	const tailwindVersion = getTailwindVersion(tree);
	return {
		...(tailwindVersion === 4 && { 'tw-animate-css': getLatestPkgVersion('tw-animate-css') }),
	};
}

function getLatestPkgVersion(pkgName: string): string {
	const version = execSync(`npm view ${pkgName} version`).toString().trim();
	return `^${version}`; // prefix with caret if you want
}
