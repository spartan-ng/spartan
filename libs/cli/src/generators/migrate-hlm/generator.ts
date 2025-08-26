import { formatFiles, Tree } from '@nx/devkit';
import { visitFiles } from '../../utils/visit-files';
import { MigrateHlmGeneratorSchema } from './schema';

export async function migrateHlmGenerator(tree: Tree, { skipFormat }: MigrateHlmGeneratorSchema) {
	replaceHlmImport(tree);

	if (!skipFormat) {
		await formatFiles(tree);
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
