import { formatFiles, type Tree } from '@nx/devkit';
import { helmImport } from '../../utils/import-alias';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateMenuGeneratorSchema } from './schema';

export async function migrateMenuGenerator(tree: Tree, { skipFormat, importAlias }: MigrateMenuGeneratorSchema) {
	updateImports(tree, importAlias);
	// TODO update template

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

/**
 * Update imports, removes '@spartan-ng/brain/menu' and '@spartan-ng/helm/menu'
 */
function updateImports(tree: Tree, importAlias: string) {
	visitFiles(tree, '/', (path) => {
		const content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		const dropdownMenuImport = helmImport(importAlias, 'dropdown-menu');

		let updatedContent = content;

		if (
			(content.includes("'@spartan-ng/brain/menu';") && content.includes("'@spartan-ng/helm/menu';")) ||
			(content.includes("'@spartan-ng/brain/menu';") && content.includes(`'${importAlias}/menu';`))
		) {
			const regex = new RegExp(`import\\s*\\{[^}]*\\}\\s*from\\s*['"]${importAlias}\\/menu['"];`, 'g');

			updatedContent = updatedContent
				// Handle `import { * } from '@spartan-ng/brain/menu';` including multi-line imports
				.replace(/import\s*\{[^}]*\}\s*from\s*['"]@spartan-ng\/brain\/menu['"];/g, '')
				// Handle `import { * } from '${importAlias}/menu';` including multi-line imports
				.replace(regex, `import { HlmDropdownMenuImports } from '${dropdownMenuImport}';`)
				// Replace `BrnMenuImports` with optional comma and whitespace
				.replace(/BrnMenuImports,?\s?/, '')
				// Replace `HlmMenuImports` with optional comma and whitespace
				.replace(/HlmMenuImports?\s?/, 'HlmDropdownMenuImports');
		} else if (content.includes("'@spartan-ng/brain/menu';")) {
			updatedContent = updatedContent
				// Handle `import { * } from '@spartan-ng/brain/menu';` including multi-line imports
				.replace(
					/import\s*\{[^}]*\}\s*from\s*['"]@spartan-ng\/brain\/menu['"];/g,
					`import { HlmDropdownMenuImports } from '${dropdownMenuImport}';`,
				)
				// Replace `BrnMenuImports` with optional comma and whitespace
				.replace(/BrnMenuImports?\s?/, 'HlmDropdownMenuImports');
		}

		if (updatedContent.includes('brnCtxMenuTriggerFor')) {
			const contextMenuImport = `import { HlmContextMenuImports } from '${helmImport(importAlias, 'context-menu')}';`;

			updatedContent = updatedContent
				.replace(
					/import\s*\{\s*HlmDropdownMenuImports\s*\}\s*from\s*['"][^'"]+dropdown-menu['"];\s*/,
					(match) => match + contextMenuImport + '\n',
				)
				.replace(
					/(imports\s*:\s*\[[^\]]*?)HlmDropdownMenuImports(.*?\])/,
					(match, prefix, suffix) => `${prefix}HlmDropdownMenuImports, HlmContextMenuImports${suffix}`,
				);
		}

		if (updatedContent.includes('<hlm-menu-bar')) {
			const menubarImport = `import { HlmMenubarImports } from '${helmImport(importAlias, 'menubar')}';`;

			updatedContent = updatedContent
				.replace(
					/import\s*\{\s*HlmDropdownMenuImports\s*\}\s*from\s*['"][^'"]+dropdown-menu['"];\s*/,
					(match) => match + menubarImport + '\n',
				)
				.replace(
					/(imports\s*:\s*\[[^\]]*?)HlmDropdownMenuImports(.*?\])/,
					(match, prefix, suffix) => `${prefix}HlmDropdownMenuImports, HlmMenubarImports${suffix}`,
				);
		}

		tree.write(path, updatedContent);
	});
}

export default migrateMenuGenerator;
