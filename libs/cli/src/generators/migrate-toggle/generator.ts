import { formatFiles, type Tree } from '@nx/devkit';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateToggleGeneratorSchema } from './schema';

export async function migrateToggleGenerator(tree: Tree, { skipFormat }: MigrateToggleGeneratorSchema) {
	updateImports(tree);
	replaceSelector(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

function replaceSelector(tree: Tree) {
	// if the element is `<button brnToggle hlm` then we need to replace it with `<button hlmToggle`
	visitFiles(tree, '.', (path) => {
		// if this is not an html file or typescript file (inline templates) then skip
		if (!path.endsWith('.html') && !path.endsWith('.ts')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		if (content.includes('brnToggle') || content.includes('@spartan-ng/helm/toggle')) {
			// <button brnToggle hlm but between
			content = replaceBrnToggle(content);

			tree.write(path, content);
		}
	});
}

function replaceBrnToggle(input) {
	// Split input to handle multiple tags separately
	return input
		.split(/(?=<)/)
		.map((tag) => {
			// Skip if not a brnToggle tag
			if (!tag.includes('brnToggle')) {
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
					.replace(/brnToggle/, 'hlmToggle')
					.replace(/ hlm(?=[\s>])/, '')
					.replace(/\s+>/g, '>')
					.replace(/\s+/g, ' ');
			}

			return tag;
		})
		.join('');
}
/**
 * Update imports remove BrnToggle import
 */
function updateImports(tree: Tree) {
	visitFiles(tree, '/', (path) => {
		// skip HlmToggle itself
		if (path.endsWith('hlm-toggle.ts') || path.endsWith('hlm-toggle-item.ts')) {
			return;
		}

		const content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		if (content.includes("'@spartan-ng/brain/toggle';") || content.includes("'@spartan-ng/helm/toggle';")) {
			const updatedContent = content
				// Handle `import { BrnToggle } from '@spartan-ng/brain/toggle';`
				.replace("import { BrnToggle } from '@spartan-ng/brain/toggle';", '')
				// Remove `BrnToggle` with optional comma and whitespace
				.replace(/BrnToggle,?\s?/, '');

			tree.write(path, updatedContent);
		}
	});
}

export default migrateToggleGenerator;
