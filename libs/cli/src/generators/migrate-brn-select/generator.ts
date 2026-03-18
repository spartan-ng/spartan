import { formatFiles, type Tree } from '@nx/devkit';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateBrnSelectGeneratorSchema } from './schema';

export async function migrateBrnSelectGenerator(tree: Tree, { skipFormat }: MigrateBrnSelectGeneratorSchema) {
	updateImports(tree);
	replaceSelector(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

/**
 * Update imports
 */
function updateImports(tree: Tree) {
	visitFiles(tree, '/', (path) => {
		// if this is not a typescript file then skip
		if (!path.endsWith('.ts')) {
			return;
		}

		// skip hlm select files itself
		if (path.match(/hlm-select(-.*)?\.ts$/)) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		if (content.includes('@spartan-ng/brain/select')) {
			content = content
				.replace(`import { BrnSelectImports } from '@spartan-ng/brain/select';`, '')
				.replace(/BrnSelectImports,?\s?/, '');
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

		// skip hlm select files itself
		if (path.match(/hlm-select(-.*)?\.ts$/)) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		if (content.includes('<brn-select')) {
			const placeholderMatch = content.match(/placeholder="([^"]*)"/);
			const placeholder = placeholderMatch?.length > 1 ? placeholderMatch[1] : null;

			content = content
				.replace(/<brn-select/g, `<hlm-select`)
				.replace(/<\/brn-select>/g, `</hlm-select>`)
				.replace(/\s+placeholder="[^"]*"/g, '')
				.replace(/<hlm-select-content/g, `<hlm-select-content *hlmSelectPortal`)
				.replace(/<hlm-select-content([^>]*)>/g, `<hlm-select-content$1>\n<hlm-select-group>`)
				.replace(/<\/hlm-select-content>/g, `</hlm-select-group>\n</hlm-select-content>`)
				.replace(/<hlm-option/g, `<hlm-select-item`)
				.replace(/<\/hlm-option>/g, `</hlm-select-item>`);

			if (placeholder) {
				content = content.replace(/<hlm-select-value \/>/g, `<hlm-select-value placeholder="${placeholder}" />`);
			}
		}

		tree.write(path, content);
	});
}

export default migrateBrnSelectGenerator;
