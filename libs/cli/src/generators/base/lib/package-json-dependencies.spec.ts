import { type Tree, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { filterUnregisteredDependencies } from './package-json-dependencies';

describe('filterUnregisteredDependencies', () => {
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

		const result = filterUnregisteredDependencies(
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
				'@spartan-ng/brain': 'catalog:spartanui',
			},
			devDependencies: {
				'tw-animate-css': '^1.4.0',
			},
		});
	});

	it('keeps dependencies already declared with concrete versions', () => {
		writeJson(tree, 'package.json', {
			dependencies: {
				'@angular/cdk': '^20.0.0',
			},
			devDependencies: {
				'tw-animate-css': '^1.0.0',
			},
		});

		const result = filterUnregisteredDependencies(
			tree,
			{
				'@angular/cdk': '^21.0.0',
			},
			{
				'tw-animate-css': '^1.4.0',
			},
		);

		expect(result).toEqual({
			dependencies: {
				'@angular/cdk': '^21.0.0',
			},
			devDependencies: {
				'tw-animate-css': '^1.4.0',
			},
		});
	});

	it('keeps dependencies that are only declared as peer or optional dependencies', () => {
		writeJson(tree, 'package.json', {
			peerDependencies: {
				'@angular/cdk': '^20.0.0',
			},
			optionalDependencies: {
				'tw-animate-css': '^1.0.0',
			},
		});

		const result = filterUnregisteredDependencies(
			tree,
			{
				'@angular/cdk': '^21.0.0',
			},
			{
				'tw-animate-css': '^1.4.0',
			},
		);

		expect(result).toEqual({
			dependencies: {
				'@angular/cdk': '^21.0.0',
			},
			devDependencies: {
				'tw-animate-css': '^1.4.0',
			},
		});
	});

	it('drops null versions before registering dependencies', () => {
		writeJson(tree, 'package.json', {});

		expect(filterUnregisteredDependencies(tree, { '@spartan-ng/brain': null }, {})).toEqual({
			dependencies: {},
			devDependencies: {},
		});
	});
});
