import { formatFiles, type Tree, visitNotIgnoredFiles } from '@nx/devkit';
import { logger } from 'nx/src/devkit-exports';
import { basename } from 'path';
import { isBinaryPath } from '../migrate-brain-imports/utils/binary-extensions';
import importMap from './import-map';
import type { MigrateHelmImportsGeneratorSchema } from './schema';

export async function migrateHelmImportsGenerator(tree: Tree, options: MigrateHelmImportsGeneratorSchema) {
	for (const [from, to] of Object.entries(importMap)) {
		replaceUsages(tree, from, to);
	}

	if (!options.skipFormat) {
		await formatFiles(tree);
	}
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

export default migrateHelmImportsGenerator;
