import type { Tree } from '@nx/devkit';
import { getTailwindVersion } from '../../../utils/get-tailwind-version';
import type { HlmBaseGeneratorSchema } from '../schema';
import { NG_ICONS_VERSION, SPARTAN_BRAIN_VERSION, TAILWIND_MERGE_VERSION, TW_ANIMATE_CSS } from '../versions';

export function buildDependencyArray(
	options: HlmBaseGeneratorSchema,
	angularVersion: string,
	existingCdkVersion: string,
) {
	let dependencies: Record<string, string> = {
		'@angular/cdk': existingCdkVersion ?? angularVersion,
		'@spartan-ng/brain': SPARTAN_BRAIN_VERSION,
		'tailwind-merge': TAILWIND_MERGE_VERSION,
	};

	if (options.peerDependencies) {
		dependencies = { ...dependencies, ...options.peerDependencies };
	}

	if (options.name === 'icon') {
		dependencies = { ...dependencies, '@ng-icons/core': NG_ICONS_VERSION };
	}
	return dependencies;
}

export function buildDevDependencyArray(tree: Tree) {
	const tailwindVersion = getTailwindVersion(tree);
	return {
		...(tailwindVersion === 4 && { 'tw-animate-css': TW_ANIMATE_CSS }),
	};
}
