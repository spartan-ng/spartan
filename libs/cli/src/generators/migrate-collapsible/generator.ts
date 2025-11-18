import { formatFiles, type Tree } from '@nx/devkit';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateCollapsibleGeneratorSchema } from './schema';

export async function migrateCollapsibleGenerator(tree: Tree, { skipFormat }: MigrateCollapsibleGeneratorSchema) {
	updateImports(tree);
	replaceSelector(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

/**
 * Update imports remove BrnCollapsible import
 */
function updateImports(tree: Tree) {
	visitFiles(tree, '/', (path) => {
		// skip HlmCollapsible itself
		if (
			path.endsWith('hlm-collapsible.ts') ||
			path.endsWith('hlm-collapsible-trigger.ts') ||
			path.endsWith('hlm-collapsible-content.ts')
		) {
			return;
		}

		const content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		if (content.includes("'@spartan-ng/brain/collapsible';")) {
			const updatedContent = content
				// Handle `import { * } from '@spartan-ng/brain/collapsible';` including multi-line imports
				.replace(
					/import\s*\{[^}]*\}\s*from\s*['"]@spartan-ng\/brain\/collapsible['"];/g,
					"import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';",
				)
				// Replace `BrnCollapsibleImports` with optional comma and whitespace
				.replace(/BrnCollapsibleImports/, 'HlmCollapsibleImports')
				// Replace `BrnCollapsible` with optional comma and whitespace
				.replace(/BrnCollapsible/, 'HlmCollapsibleImports')
				// Remove `BrnCollapsibleTrigger` with optional comma and whitespace
				.replace(/BrnCollapsibleTrigger,?\s?/, '')
				// Remove `BrnCollapsibleContent` with optional comma and whitespace
				.replace(/BrnCollapsibleContent,?\s?/, '')
				// Remove any trailing comma before a closing bracket
				.replace(/,\s*]/g, ']');

			tree.write(path, updatedContent);
		}
	});
}

function replaceSelector(tree: Tree) {
	// if the element is `<brn-collapsible` then we need to replace it with `<hlm-collapsible`
	visitFiles(tree, '.', (path) => {
		// if this is not an html file or typescript file (inline templates) then skip
		if (!path.endsWith('.html') && !path.endsWith('.ts')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		if (content.includes('brn-collapsible') || content.includes('brnCollapsibleTrigger')) {
			content = replaceBrnCollapsible(content);

			tree.write(path, content);
		}
	});
}

function replaceBrnCollapsible(input) {
	// Split input to handle multiple tags separately
	return input
		.split(/(?=<)/)
		.map((tag) => {
			// Remove line breaks, tabs, and other whitespace within the tag
			// Replace with a single space
			tag = tag.replace(/\s+/g, ' ');

			return (
				tag
					// replace brn-collapsible and brn-collapsible-content opening tags
					.replace(/<brn-collapsible/, '<hlm-collapsible')
					.replace(/ brnCollapsibleTrigger/, ' hlmCollapsibleTrigger')
					// replace brn-collapsible and brn-collapsible-content closing tags
					.replace(/<\/brn-collapsible/g, '</hlm-collapsible')
			);
		})
		.join('');
}

export default migrateCollapsibleGenerator;
