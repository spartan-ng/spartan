import { type Tree } from '@nx/devkit';
import { getTailwindVersion } from '../../../utils/get-tailwind-version';
import type { HlmBaseGeneratorSchema } from '../schema';

export async function buildDependencyArray(
	options: HlmBaseGeneratorSchema,
	angularVersion: string,
	existingCdkVersion: string,
) {
	let dependencies: Record<string, string> = {
		'@angular/cdk': existingCdkVersion ?? angularVersion,
		'@spartan-ng/brain': await getLatestPkgVersion('@spartan-ng/brain'),
		'tailwind-merge': await getLatestPkgVersion('tailwind-merge'),
	};

	if (options.peerDependencies) {
		dependencies = { ...dependencies, ...options.peerDependencies };
	}

	if (options.name === 'icon' || options.name === 'spinner') {
		dependencies['@ng-icons/core'] = await getLatestPkgVersion('@ng-icons/core');
	}
	return dependencies;
}

export async function buildDevDependencyArray(tree: Tree) {
	const tailwindVersion = getTailwindVersion(tree);
	return {
		...(tailwindVersion === 4 && { 'tw-animate-css': await getLatestPkgVersion('tw-animate-css') }),
	};
}

function getLatestPkgVersion(pkgName: string): Promise<string> {
	return fetch(`https://registry.npmjs.org/${pkgName}/latest`)
		.then((res) => res.json())
		.then((data) => data.version)
		.catch((err) => console.error(err));
}
