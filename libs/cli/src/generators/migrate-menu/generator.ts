import { formatFiles, type Tree } from '@nx/devkit';
import { helmImport } from '../../utils/import-alias';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateMenuGeneratorSchema } from './schema';

export const ignoreMenuFiles = [
	'hlm-menu-bar-item.ts',
	'hlm-menu-group.ts',
	'hlm-menu-item-check.ts',
	'hlm-menu-item-checkbox.ts',
	'hlm-menu-item-icon.ts',
	'hlm-menu-item-radio-indicator.ts',
	'hlm-menu-item-radio.ts',
	'hlm-menu-item-sub-indicator.ts',
	'hlm-menu-item.ts',
	'hlm-menu-label.ts',
	'hlm-menu-separator.ts',
	'hlm-menu-shortcut.ts',
	'hlm-menu.ts',
	'hlm-sub-menu.ts',
	'menu/src/index.ts',
];

export async function migrateMenuGenerator(tree: Tree, { skipFormat, importAlias }: MigrateMenuGeneratorSchema) {
	updateImports(tree, importAlias);
	replaceSelector(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

/**
 * Update imports, removes '@spartan-ng/brain/menu' and '@spartan-ng/helm/menu'
 */
function updateImports(tree: Tree, importAlias: string) {
	visitFiles(tree, '/', (path) => {
		// if this is not a typescript file then skip
		if (!path.endsWith('.ts')) {
			return;
		}

		// skip HlmMenu itself
		if (ignoreMenuFiles.some((menuFile) => path.endsWith(menuFile))) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		const dropdownMenuImport = helmImport(importAlias, 'dropdown-menu');

		if (
			(content.includes("'@spartan-ng/brain/menu';") && content.includes("'@spartan-ng/helm/menu';")) ||
			(content.includes("'@spartan-ng/brain/menu';") && content.includes(`'${importAlias}/menu';`))
		) {
			const regex = new RegExp(`import\\s*\\{[^}]*\\}\\s*from\\s*['"]${importAlias}\\/menu['"];`, 'g');

			content = content
				// Handle `import { * } from '@spartan-ng/brain/menu';` including multi-line imports
				.replace(/import\s*\{[^}]*\}\s*from\s*['"]@spartan-ng\/brain\/menu['"];/g, '')
				// Handle `import { * } from '${importAlias}/menu';` including multi-line imports
				.replace(regex, `import { HlmDropdownMenuImports } from '${dropdownMenuImport}';`)
				// Replace `BrnMenuImports` with optional comma and whitespace
				.replace(/BrnMenuImports,?\s?/, '')
				.replace(/BrnMenuTrigger,?\s?/g, '')
				// Replace `HlmMenuImports` with optional comma and whitespace
				.replace(/HlmMenuImports?\s?/, 'HlmDropdownMenuImports')
				.replace(/HlmMenu\b/, 'HlmDropdownMenuImports')
				.replace(/\s*\bHlmMenu(?!bar)\w*\b\s*,?/g, '')
				.replace(/HlmSubMenu,?\s?/g, '');
		} else if (content.includes("'@spartan-ng/brain/menu';")) {
			content = content
				// Handle `import { * } from '@spartan-ng/brain/menu';` including multi-line imports
				.replace(
					/import\s*\{[^}]*\}\s*from\s*['"]@spartan-ng\/brain\/menu['"];/g,
					`import { HlmDropdownMenuImports } from '${dropdownMenuImport}';`,
				)
				// Replace `BrnMenuImports` with optional comma and whitespace
				.replace(/BrnMenuImports?\s?/, 'HlmDropdownMenuImports');
		}

		if (content.includes('brnCtxMenuTriggerFor') || content.includes('BrnContextMenuTrigger')) {
			const contextMenuImport = `import { HlmContextMenuImports } from '${helmImport(importAlias, 'context-menu')}';`;

			content = content
				.replace(/BrnContextMenuTrigger,?\s?/, '')
				.replace(
					/import\s*\{\s*HlmDropdownMenuImports\s*\}\s*from\s*['"][^'"]+dropdown-menu['"];\s*/,
					(match) => match + contextMenuImport + '\n',
				)
				.replace(
					/(imports\s*:\s*\[[\s\S]*?)\bHlmDropdownMenuImports\b([\s\S]*?\])/,
					(match, prefix, suffix) => `${prefix}HlmDropdownMenuImports, HlmContextMenuImports${suffix}`,
				);
		}

		if (content.includes('<hlm-menu-bar')) {
			const menubarImport = `import { HlmMenubarImports } from '${helmImport(importAlias, 'menubar')}';`;

			content = content
				.replace(
					/import\s*\{\s*HlmDropdownMenuImports\s*\}\s*from\s*['"][^'"]+dropdown-menu['"];\s*/,
					(match) => match + menubarImport + '\n',
				)
				.replace(
					/(imports\s*:\s*\[[^\]]*?)HlmDropdownMenuImports(.*?\])/,
					(match, prefix, suffix) => `${prefix}HlmDropdownMenuImports, HlmMenubarImports${suffix}`,
				);
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

		// skip HlmMenu itself
		if (ignoreMenuFiles.some((menuFile) => path.endsWith(menuFile))) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		// context-menu trigger
		if (content.includes('brnCtxMenuTrigger')) {
			content = content
				.replace(/brnCtxMenuTriggerFor/g, 'hlmContextMenuTrigger')
				.replace(/brnCtxMenuTriggerData/g, 'hlmContextMenuTriggerData');
		}

		// menubar
		if (content.includes('hlm-menu-bar')) {
			content = content.replaceAll('hlm-menu-bar', 'hlm-menubar');
		}
		if (content.includes('hlmMenuBarItem')) {
			content = content
				.replace(/hlmMenuBarItem(\s+[^>]*?)\[brnMenuTriggerFor\]/g, '$1[hlmMenubarTrigger]')
				.replace(/\[brnMenuTriggerFor\]=(["'][^"']*["'])(\s+[^>]*?)hlmMenuBarItem/g, '[hlmMenubarTrigger]=$1$2')
				.replace(/hlmMenuBarItem/g, '');
		}

		// dropdown-menu
		if (content.includes('hlm-menu') || content.includes('brnMenu') || content.includes('hlmMenu')) {
			content = content
				.replace(/hlm-menu-item-check/g, 'hlm-dropdown-menu-checkbox-indicator')
				.replace(/hlm-menu-item-radio/g, 'hlm-dropdown-menu-radio-indicator')
				// replaces hlm-menu including hlm-menu-* (hlm-menu-label, hlm-menu-group, hlm-menu-separator, hlm-menu-shortcut, etc.)
				.replace(/hlm-menu\b/g, 'hlm-dropdown-menu')
				.replace(/hlmMenuItemCheckbox/g, 'hlmDropdownMenuCheckbox')
				.replace(/hlmMenuItemRadio/g, 'hlmDropdownMenuRadio')
				.replace(/hlmMenuItem/g, 'hlmDropdownMenuItem')
				.replace(/brnMenuTriggerFor/g, 'hlmDropdownMenuTrigger')
				.replace(/brnMenuTriggerData/g, 'hlmDropdownMenuTriggerData')
				.replace(/hlm-sub-menu/g, 'hlm-dropdown-menu-sub');
		}

		tree.write(path, content);
	});
}

export default migrateMenuGenerator;
