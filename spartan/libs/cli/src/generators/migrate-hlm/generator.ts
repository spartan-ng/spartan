import { formatFiles, type Tree } from '@nx/devkit';
import { getOrCreateConfig } from '../../utils/config';
import { visitFiles } from '../../utils/visit-files';
import type { SupportedLibraries } from '../base/lib/supported-libs';
import { createPrimitiveLibraries } from '../ui/generator';
import type { Primitive } from '../ui/primitives';
import type { MigrateHlmGeneratorSchema } from './schema';

export async function migrateHlmGenerator(tree: Tree, { skipFormat, angularCli }: MigrateHlmGeneratorSchema) {
	await ensureHelmUtilsInstalled(tree, angularCli);
	replaceHlmImport(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

async function ensureHelmUtilsInstalled(tree: Tree, angularCli: boolean) {
	const tsconfigPath = tree.exists('tsconfig.base.json')
		? 'tsconfig.base.json'
		: tree.exists('tsconfig.json')
			? 'tsconfig.json'
			: null;

	if (!tsconfigPath) {
		throw new Error('Could not find tsconfig.base.json or tsconfig.json to verify @spartan-ng/helm/utils.');
	}

	const tsconfig = JSON.parse(tree.read(tsconfigPath, 'utf-8') || '{}');

	// Check compilerOptions.paths for @spartan-ng/helm/utils
	const paths = tsconfig.compilerOptions?.paths || {};
	const hasHelmUtils = Object.keys(paths).some((pkg) => pkg === '@spartan-ng/helm/utils');

	if (!hasHelmUtils) {
		const supportedLibraries = (await import('../ui/supported-ui-libraries.json').then(
			(m) => m.default,
		)) as SupportedLibraries;
		const config = await getOrCreateConfig(tree, { angularCli });

		await createPrimitiveLibraries(
			{
				primitives: ['utils'],
			},
			Object.keys(supportedLibraries) as Primitive[],
			supportedLibraries,
			tree,
			{ angularCli, installPeerDependencies: true },
			config,
		);
	}
}

function replaceHlmImport(tree: Tree) {
	visitFiles(tree, '.', (path) => {
		if (!path.endsWith('.ts')) return;

		let content = tree.read(path, 'utf-8');
		if (!content) return;

		// Find imports from @spartan-ng/brain/core
		const importRegex = /import\s*{\s*([^}]*)\s*}\s*from\s*['"]@spartan-ng\/brain\/core['"];?/g;

		content = content.replace(importRegex, (match, imports) => {
			// Split the import specifiers
			const specifiers = imports
				.split(',')
				.map((s) => s.trim())
				.filter(Boolean);

			if (!specifiers.includes('hlm')) {
				// nothing to change
				return match;
			}

			// Remove hlm from the original import
			const remaining = specifiers.filter((s) => s !== 'hlm');

			let newImports = '';
			if (remaining.length > 0) {
				newImports = `import { ${remaining.join(', ')} } from '@spartan-ng/brain/core';\n`;
			}

			// Always add hlm import from new package
			newImports += `import { hlm } from '@spartan-ng/helm/utils';`;

			return newImports;
		});

		tree.write(path, content);
	});
}

export default migrateHlmGenerator;
