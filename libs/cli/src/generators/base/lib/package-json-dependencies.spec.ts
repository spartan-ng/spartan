import { type Tree, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { removeCatalogManagedDependencies } from './package-json-dependencies';

describe('removeCatalogManagedDependencies', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it('omits dependencies already declared with pnpm catalog references', () => {
		writeJson(tree, 'package.json', {
			dependencies: {
				'@angular/cdk': 'catalog:angular',
				rxjs: 'catalog:',
			},
			devDependencies: {
				'@spartan-ng/cli': 'catalog:spartanui',
			},
		});

		const result = removeCatalogManagedDependencies(
			tree,
			{
				'@angular/cdk': 'catalog:angular',
				'@spartan-ng/brain': 'catalog:spartanui',
				rxjs: 'catalog:',
			},
			{
				'@spartan-ng/cli': 'catalog:spartanui',
				'tw-animate-css': '^1.4.0',
			},
		);

		expect(result).toEqual({
			dependencies: {
				// kept: not installed yet, so it is a new dependency (even as a catalog ref)
				'@spartan-ng/brain': 'catalog:spartanui',
			},
			devDependencies: {
				'tw-animate-css': '^1.4.0',
			},
		});
	});

	it('keeps a concrete already-declared dependency so nx can still bump it', () => {
		writeJson(tree, 'package.json', {
			dependencies: { 'tailwind-merge': '^3.0.0' },
		});

		const result = removeCatalogManagedDependencies(tree, { 'tailwind-merge': '^3.5.0' }, {});

		expect(result.dependencies).toEqual({ 'tailwind-merge': '^3.5.0' });
	});

	it('drops null versions before registering dependencies', () => {
		writeJson(tree, 'package.json', {});

		expect(removeCatalogManagedDependencies(tree, { '@spartan-ng/brain': null }, {})).toEqual({
			dependencies: {},
			devDependencies: {},
		});
	});
});
