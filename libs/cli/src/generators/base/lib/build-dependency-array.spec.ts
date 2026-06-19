import { type Tree, updateJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import type { HlmBaseGeneratorSchema } from '../schema';
import { buildDependencyArray } from './build-dependency-array';

describe('buildDependencyArray', () => {
	let tree: Tree;

	const carouselOptions: HlmBaseGeneratorSchema = {
		name: 'carousel',
		directory: 'libs/ui',
		buildable: false,
		generateAs: 'library',
		importAlias: '@spartan-ng/helm',
		peerDependencies: {
			'embla-carousel': '>=8.0.0 <9.0.0',
			'embla-carousel-angular': '>=21.0.0 <23.0.0',
		},
	};

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	function setAngularVersion(version: string | null) {
		updateJson(tree, 'package.json', (json) => {
			json.dependencies ??= {};
			if (version === null) {
				delete json.dependencies['@angular/core'];
			} else {
				json.dependencies['@angular/core'] = version;
			}
			return json;
		});
	}

	it('pins embla-carousel-angular to the installed Angular major', () => {
		setAngularVersion('^21.2.9');

		const deps = buildDependencyArray(tree, carouselOptions, '^21.0.0');

		expect(deps['embla-carousel-angular']).toBe('^21.0.0');
		// other peer deps are passed through untouched
		expect(deps['embla-carousel']).toBe('>=8.0.0 <9.0.0');
	});

	it('tracks whatever Angular major is installed', () => {
		setAngularVersion('^22.0.1');

		const deps = buildDependencyArray(tree, carouselOptions, '^22.0.0');

		expect(deps['embla-carousel-angular']).toBe('^22.0.0');
	});

	it('falls back to the declared range when Angular cannot be resolved', () => {
		setAngularVersion(null);

		const deps = buildDependencyArray(tree, carouselOptions, '^21.0.0');

		expect(deps['embla-carousel-angular']).toBe('>=21.0.0 <23.0.0');
	});

	it('does not introduce embla for primitives that do not declare it', () => {
		setAngularVersion('^21.2.9');

		const deps = buildDependencyArray(tree, { ...carouselOptions, name: 'button', peerDependencies: {} }, '^21.0.0');

		expect(deps).not.toHaveProperty('embla-carousel-angular');
	});
});
