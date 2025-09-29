import { formatFiles, type Tree, visitNotIgnoredFiles } from '@nx/devkit';
import { getPackageManagerCommand, logger, readJson, updateJson } from 'nx/src/devkit-exports';
import type { PackageJson } from 'nx/src/utils/package-json';
import { basename } from 'path';
import imports from './import-map';
import type { MigrateBrainImportsGeneratorSchema } from './schema';
import { isBinaryPath } from './utils/binary-extensions';

export async function migrateBrainImportsGenerator(tree: Tree, options: MigrateBrainImportsGeneratorSchema) {
	if (!options.skipInstall) {
		ensureBrainPackageIsInstalled(tree);
	}

	for (const [from, to] of Object.entries(imports)) {
		replaceBrainPackageWithSecondaryEntrypoint(tree, options, from, to as string);
	}

	if (!options.skipFormat) {
		await formatFiles(tree);
	}
}

function ensureBrainPackageIsInstalled(tree: Tree) {
	// read the root package.json
	const packageJson = readJson<PackageJson>(tree, 'package.json');

	// merge all dependencies so we easily search for the cli package
	const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

	// check if the brain package is installed
	if (deps['@spartan-ng/brain']) {
		return;
	}

	// the brain package version should be the same as the cli package
	updateJson<PackageJson>(tree, 'package.json', (packageJson) => {
		packageJson.dependencies['@spartan-ng/brain'] = deps['@spartan-ng/cli'];
		return packageJson;
	});

	const { install } = getPackageManagerCommand();

	logger.warn(
		`The @spartan-ng/brain package has been added to your dependencies. Please run '${install}' to install the package.`,
	);
}

export function replaceBrainPackageWithSecondaryEntrypoint(
	tree: Tree,
	options: MigrateBrainImportsGeneratorSchema,
	oldImport: string,
	newImport: string,
): void {
	if (!options.skipInstall) {
		removePackageInDependencies(tree, oldImport);
	}

	replaceUsages(tree, oldImport, newImport);
}

function removePackageInDependencies(tree: Tree, oldPackageName: string) {
	visitNotIgnoredFiles(tree, '.', (path) => {
		if (basename(path) !== 'package.json') {
			return;
		}

		try {
			updateJson<PackageJson>(tree, path, (packageJson) => {
				for (const deps of [
					packageJson.dependencies ?? {},
					packageJson.devDependencies ?? {},
					packageJson.peerDependencies ?? {},
					packageJson.optionalDependencies ?? {},
				]) {
					if (oldPackageName in deps) {
						delete deps[oldPackageName];
					}
				}
				return packageJson;
			});
		} catch (e) {
			console.warn(`Could not remove ${oldPackageName} in ${path}.`);
		}
	});
}

// based on https://github.com/nrwl/nx/blob/master/packages/devkit/src/utils/replace-package.ts
function replaceUsages(tree: Tree, oldPackageName: string, newPackageName: string) {
	visitNotIgnoredFiles(tree, '.', (path) => {
		if (isBinaryPath(path)) {
			return;
		}

		const ignoredFiles = [
			'yarn.lock',
			'package-lock.json',
			'pnpm-lock.yaml',
			'bun.lockb',
			'CHANGELOG.md',
			// this is relevant for this repo only - and this file is auto-generated
			'supported-ui-libraries.json',
			// we don't want to replace usages in the import map as these are used to detect the usages
			'import-map.ts',
		];
		if (ignoredFiles.includes(basename(path))) {
			return;
		}

		try {
			const contents = tree.read(path).toString();

			if (!contents.includes(oldPackageName)) {
				return;
			}

			tree.write(path, contents.replace(new RegExp(oldPackageName, 'g'), newPackageName));
		} catch {
			logger.warn(`Could not replace ${oldPackageName} with ${newPackageName} in ${path}.`);
		}
	});
}

export default migrateBrainImportsGenerator;
