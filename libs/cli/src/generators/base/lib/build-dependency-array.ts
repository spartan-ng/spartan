import type { HlmBaseGeneratorSchema } from '../schema';
import {
	NG_ICONS_VERSION,
	SPARTAN_BRAIN_VERSION,
	TAILWINDCSS_VERSION,
	TAILWIND_ANIMATE_VERSION,
	TAILWIND_MERGE_VERSION,
} from '../versions';

export function buildDependencyArray(
	options: HlmBaseGeneratorSchema,
	angularVersion: string,
	existingCdkVersion: string,
) {
	let dependencies: Record<string, string> = {
		'@angular/cdk': existingCdkVersion ?? angularVersion,
		'@spartan-ng/brain': SPARTAN_BRAIN_VERSION,
	};

	if (options.peerDependencies) {
		dependencies = { ...dependencies, ...options.peerDependencies };
	}

	if (options.primitiveName === 'icon') {
		dependencies = { ...dependencies, '@ng-icons/core': NG_ICONS_VERSION };
	}
	return dependencies;
}

export function buildDevDependencyArray() {
	return {
		'tailwind-merge': TAILWIND_MERGE_VERSION,
		tailwindcss: TAILWINDCSS_VERSION,
		'tailwindcss-animate': TAILWIND_ANIMATE_VERSION,
	};
}
