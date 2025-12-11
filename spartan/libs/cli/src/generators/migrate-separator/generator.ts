import { formatFiles, type Tree } from '@nx/devkit';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateSeparatorGeneratorSchema } from './schema';

export async function migrateSeparatorGenerator(tree: Tree, { skipFormat }: MigrateSeparatorGeneratorSchema) {
	updateImports(tree);
	replaceSelector(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

function replaceSelector(tree: Tree) {
	// if the element is `<brn-separator hlmSeparator` then we need to replace it with `<hlm-separator`
	// we also need to replace the closing tag `</brn-separator>` with `</hlm-separator>`
	visitFiles(tree, '.', (path) => {
		// if this is not an html file or typescript file (inline templates) then skip
		if (!path.endsWith('.html') && !path.endsWith('.ts')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		// <brn-separator hlmSeparator but between
		content = replaceBrnSeparator(content);
		content = content.replace(/<\/brn-separator>/g, '</hlm-separator>');

		tree.write(path, content);
	});
}

function replaceBrnSeparator(input) {
	// Split input to handle multiple tags separately
	return input
		.split(/(?=<)/)
		.map((tag) => {
			// Skip if not a brn-separator tag
			if (!tag.startsWith('<brn-separator')) {
				return tag;
			}

			// Remove line breaks, tabs, and other whitespace within the tag
			// Replace with a single space
			tag = tag.replace(/\s+/g, ' ');

			// Check if standalone hlm attribute exists
			const hasHlm = / hlmSeparator(?=[\s>])/.test(tag);

			if (hasHlm) {
				// Remove the hlm attribute and convert to hlm-separator
				return tag
					.replace(/<brn-separator/, '<hlm-separator')
					.replace(/ hlmSeparator(?=[\s>])/, '')
					.replace(/\s+>/g, '>')
					.replace(/\s+/g, ' ');
			}

			return tag;
		})
		.join('');
}
/**
 * Update imports remove BrnSeparator import
 */
function updateImports(tree: Tree) {
	visitFiles(tree, '/', (path) => {
		// skip HlmSeparator itself
		if (path.endsWith('hlm-separator.ts')) {
			return;
		}

		const content = tree.read(path).toString('utf-8');

		if (content.includes('@spartan-ng/brain/separator') || content.includes('@spartan-ng/ui-separator-helm')) {
			const updatedContent = content
				// Handle `import { BrnSeparator } from '@spartan-ng/brain/separator';`
				.replace("import { BrnSeparator } from '@spartan-ng/brain/separator';", '')
				// Remove `BrnSeparator` with optional comma and whitespace
				.replace(/BrnSeparator,?\s?/, '');

			tree.write(path, updatedContent);
		}
	});
}

export default migrateSeparatorGenerator;
