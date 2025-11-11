import { type Tree } from '@nx/devkit';
import { getTailwindVersion } from '../../../utils/get-tailwind-version';
import { getInstalledPackageVersion } from '../../../utils/version-utils';
import type { HlmBaseGeneratorSchema } from '../schema';
import { NG_ICONS_VERSION, TAILWIND_MERGE_VERSION, TW_ANIMATE_CSS } from '../versions';

export function buildDependencyArray(tree: Tree, options: HlmBaseGeneratorSchema, cdkVersion: string) {
	let dependencies: Record<string, string> = {
		'@angular/cdk': cdkVersion,
		'@spartan-ng/brain': getInstalledPackageVersion(tree, '@spartan-ng/cli', undefined, true),
		'tailwind-merge': TAILWIND_MERGE_VERSION,
	};

	if (options.peerDependencies) {
		dependencies = { ...dependencies, ...options.peerDependencies };
	}

	if (options.name === 'icon' || options.name === 'spinner') {
		dependencies['@ng-icons/core'] = NG_ICONS_VERSION;
	}
	return dependencies;
}

export function buildDevDependencyArray(tree: Tree) {
	const tailwindVersion = getTailwindVersion(tree);
	return {
		...(tailwindVersion === 4 && { 'tw-animate-css': TW_ANIMATE_CSS }),
	};
}
