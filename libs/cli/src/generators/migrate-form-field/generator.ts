import { formatFiles, type Tree } from '@nx/devkit';
import { helmImport } from '../../utils/import-alias';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateFormFieldGeneratorSchema } from './schema';

export async function migrateFormFieldGenerator(
	tree: Tree,
	{ skipFormat, importAlias }: MigrateFormFieldGeneratorSchema,
) {
	updateImports(tree, importAlias);
	replaceSelector(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

/**
 * Migrate @spartan-ng/hlm/form-field imports to @spartan-ng/hlm/field
 */
function updateImports(tree: Tree, importAlias: string) {
	visitFiles(tree, '/', (path) => {
		// if this is not a typescript file then skip
		if (!path.endsWith('.ts')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		const formFieldImport = helmImport(importAlias, 'form-field');
		const fieldImport = helmImport(importAlias, 'field');

		if (content.includes(formFieldImport)) {
			content = content
				.replace(
					`import { HlmFormFieldImports } from '${formFieldImport}';`,
					`import { HlmFieldImports } from '${fieldImport}';`,
				)
				.replace(/HlmFormFieldImports/, 'HlmFieldImports');
		}

		tree.write(path, content);
	});
}

function replaceSelector(tree: Tree) {
	visitFiles(tree, '.', (path) => {
		// if this is not an html file or typescript file (inline templates) then skip
		if (!path.endsWith('.html') && !path.endsWith('.ts')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		if (content.includes('hlm-form-field')) {
			content = content.replace(/hlm-form-field/g, 'hlm-field');
		}
		if (content.includes('hlm-hint')) {
			content = content.replace(/<hlm-hint/g, '<p hlmFieldDescription').replace(/<\/hlm-hint>/g, '</p>');
		}
		if (content.includes('hlm-error')) {
			content = content.replace(/hlm-error/g, 'hlm-field-error');
		}

		tree.write(path, content);
	});
}

export default migrateFormFieldGenerator;
