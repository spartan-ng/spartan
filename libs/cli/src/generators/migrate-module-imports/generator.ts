import { formatFiles, type Tree, visitNotIgnoredFiles } from '@nx/devkit';
import { logger } from 'nx/src/devkit-exports';
import { basename } from 'path';
import { isBinaryPath } from '../migrate-brain-imports/utils/binary-extensions';
import importMap from './import-map';
import type { MigrateModuleImportsGeneratorSchema } from './schema';

export async function migrateModuleImportsGenerator(tree: Tree, options: MigrateModuleImportsGeneratorSchema) {
	for (const [from, to] of Object.entries(importMap)) {
		replaceUsages(tree, from, to);
	}

	deduplicateBrainImports(tree);

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

function deduplicateBrainImports(tree: Tree) {
	visitNotIgnoredFiles(tree, '.', (path) => {
		if (isBinaryPath(path)) return;

		try {
			let contents = tree.read(path)!.toString();
			if (!contents.includes('@spartan-ng/brain')) return;

			// -----------------------------
			// Step 1: Deduplicate import statements
			// -----------------------------
			const importRegex = /import\s+{([^}]+)}\s+from\s+'(@spartan-ng\/brain\/[^']+)';/g;
			const importMap: Record<string, Set<string>> = {};

			[...contents.matchAll(importRegex)].forEach((match) => {
				const identifiers = match[1]
					.split(',')
					.map((i) => i.trim())
					.filter(Boolean);
				const modulePath = match[2];

				if (!importMap[modulePath]) importMap[modulePath] = new Set();
				identifiers.forEach((i) => importMap[modulePath].add(i));
			});

			if (Object.keys(importMap).length > 0) {
				contents = contents.replace(importRegex, '');
				const dedupImports = Object.entries(importMap)
					.map(([modulePath, identifiers]) => `import { ${[...identifiers].join(', ')} } from '${modulePath}';`)
					.join('\n');
				contents = dedupImports + '\n' + contents;
			}

			// -----------------------------
			// Step 2: Deduplicate @Component/@NgModule imports array
			// -----------------------------
			// Match imports: [ ... ] arrays
			const importsArrayRegex = /imports\s*:\s*\[([\s\S]*?)\]/g;
			contents = contents.replace(importsArrayRegex, (match, inner) => {
				const identifiers = inner
					.split(',')
					.map((i) => i.trim())
					.filter(Boolean);

				// Deduplicate Brn* imports only
				const deduped = Array.from(new Set(identifiers));
				return `imports: [${deduped.join(', ')}]`;
			});

			tree.write(path, contents);
		} catch {
			logger.warn(`Could not deduplicate brain imports in ${path}`);
		}
	});
}

export default migrateModuleImportsGenerator;
