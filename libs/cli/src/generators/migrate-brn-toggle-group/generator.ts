import { formatFiles, type Tree } from '@nx/devkit';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateBrnToggleGroupGeneratorSchema } from './schema';

export async function migrateBrnToggleGroupGenerator(tree: Tree, { skipFormat }: MigrateBrnToggleGroupGeneratorSchema) {
	updateImports(tree);
	replaceSelector(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

/**
 * Update imports remove BrnToggleGroup import
 */
function updateImports(tree: Tree) {
	visitFiles(tree, '/', (path) => {
		// skip HlmToggleGroup itself
		if (path.endsWith('hlm-toggle-group.ts') || path.endsWith('hlm-toggle-group-item.ts')) {
			return;
		}

		const content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		if (content.includes("'@spartan-ng/brain/toggle-group';")) {
			const updatedContent = content
				// Handle `import { * } from '@spartan-ng/brain/toggle-group';` including multi-line imports
				.replace(/import\s*\{[^}]*\}\s*from\s*['"]@spartan-ng\/brain\/toggle-group['"];/g, '')
				// Remove `BrnToggleGroupItem` with optional comma and whitespace
				.replace(/BrnToggleGroupItem,?\s?/, '')
				// Remove `BrnToggleGroup` with optional comma and whitespace
				.replace(/BrnToggleGroup,?\s?/, '');

			tree.write(path, updatedContent);
		}
	});
}

function replaceSelector(tree: Tree) {
	// if the element is `<brn-toggle-group hlm` then we need to replace it with `<hlm-toggle-group`
	visitFiles(tree, '.', (path) => {
		// if this is not an html file or typescript file (inline templates) then skip
		if (!path.endsWith('.html') && !path.endsWith('.ts')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		if (content.includes('brn-toggle-group')) {
			// <brn-toggle-group hlm but between
			content = replaceBrnToggleGroup(content);
			// replace closing tag
			content = content.replace(/<\/brn-toggle-group>/g, '</hlm-toggle-group>');

			tree.write(path, content);
		}
	});
}

function replaceBrnToggleGroup(input) {
	// Split input to handle multiple tags separately
	return input
		.split(/(?=<)/)
		.map((tag) => {
			// Skip if not a brn-toggle-group tag
			if (!tag.startsWith('<brn-toggle-group')) {
				return tag;
			}

			// Remove line breaks, tabs, and other whitespace within the tag
			// Replace with a single space
			tag = tag.replace(/\s+/g, ' ');

			// Check if standalone hlm attribute exists
			const hasHlm = / hlm(?=[\s>])/.test(tag);

			if (hasHlm) {
				// Remove the hlm attribute and convert to hlmToggle
				return tag
					.replace(/<brn-toggle-group/, '<hlm-toggle-group')
					.replace(/ hlm(?=[\s>])/, '')
					.replace(/ multiple="false"/, ' type="single"')
					.replace(/ multiple="true"/, ' type="multiple"')
					.replace(/\s+>/g, '>')
					.replace(/\s+/g, ' ');
			}

			return tag;
		})
		.join('');
}

export default migrateBrnToggleGroupGenerator;
