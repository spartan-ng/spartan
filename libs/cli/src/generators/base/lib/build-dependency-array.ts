import { type Tree } from '@nx/devkit';
import { major } from 'semver';
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

	// embla-carousel-angular majors track the Angular major (v21 -> Angular 21, v22 -> Angular 22). A static
	// range in supported-ui-libraries.json can't know the consumer's Angular version, so npm resolves the
	// highest match and pulls a major whose peer range excludes an older Angular (ERESOLVE). Pin it to the
	// installed Angular major instead. Falls back to the declared range when Angular can't be resolved.
	if (dependencies['embla-carousel-angular']) {
		const angularVersion = getInstalledPackageVersion(tree, '@angular/core', undefined, false);
		const angularMajor = angularVersion ? major(angularVersion) : null;
		if (angularMajor) {
			dependencies['embla-carousel-angular'] = `^${angularMajor}.0.0`;
		}
	}

	if (options.name === 'icon' || options.name === 'spinner') {
		dependencies['@ng-icons/core'] = NG_ICONS_VERSION;
	}
	return dependencies;
}

export function buildDevDependencyArray() {
	return {
		'tw-animate-css': TW_ANIMATE_CSS,
	};
}
