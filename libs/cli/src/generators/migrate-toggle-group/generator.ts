import { formatFiles, type Tree } from '@nx/devkit';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateToggleGroupGeneratorSchema } from './schema';

export async function migrateToggleGroupGenerator(tree: Tree, { skipFormat }: MigrateToggleGroupGeneratorSchema) {
	updateBrainImports(tree);
	updateHlmImports(tree);
	replaceSelector(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

/**
 * Update brain imports to migrate from toggle to toggle-group
 */
function updateBrainImports(tree: Tree) {
	visitFiles(tree, '/', (path) => {
		// Filter for TypeScript files that might contain the imports we're interested in
		if (!path.endsWith('.ts')) return;

		let content = tree.read(path)?.toString();
		if (!content) return;

		// Only proceed if file has BrnToggleGroupModule from toggle but not from toggle-group
		if (
			content.includes('BrnToggleGroupModule') &&
			content.includes("from '@spartan-ng/brain/toggle'") &&
			!content.includes("from '@spartan-ng/brain/toggle-group'")
		) {
			// Remove BrnToggleGroupModule from the toggle import
			content = content.replace(
				/import\s+\{\s*([^{}]*BrnToggleGroupModule[^{}]*)\s*\}\s+from\s+['"]@spartan-ng\/brain\/toggle['"];/g,
				(_match, importList) => {
					// Remove BrnToggleGroupModule from the import list
					const newImportList = importList
						.split(',')
						.map((item) => item.trim())
						.filter((item) => item !== 'BrnToggleGroupModule')
						.join(', ');

					// If there are still imports remaining, return the modified import statement
					if (newImportList.length > 0) {
						return `import { ${newImportList} } from '@spartan-ng/brain/toggle';`;
					} else {
						// If no imports remain, remove the entire import statement
						return '';
					}
				},
			);

			// Add the new toggle-group import with BrnToggleGroupComponent and BrnToggleGroupItemDirective
			const importRegex = /import\s+.*?;/g;
			let match;
			let lastImportEndIndex = 0;

			while ((match = importRegex.exec(content)) !== null) {
				lastImportEndIndex = match.index + match[0].length;
			}

			// If we found imports, add after the last one
			if (lastImportEndIndex > 0) {
				const newImport = `\nimport { BrnToggleGroupComponent, BrnToggleGroupItemDirective } from '@spartan-ng/brain/toggle-group';`;
				content = content.substring(0, lastImportEndIndex) + newImport + content.substring(lastImportEndIndex);
			} else {
				// If no imports found, add at the beginning
				const newImport = `import { BrnToggleGroupComponent, BrnToggleGroupItemDirective } from '@spartan-ng/brain/toggle-group';\n\n`;
				content = newImport + content;
			}

			// Update component imports to include BrnToggleGroupItemDirective
			content = content.replace(
				/imports:\s*\[\s*BrnToggleGroupModule\s*,/g,
				'imports: [BrnToggleGroupComponent, BrnToggleGroupItemDirective,',
			);

			// Also handle the case where BrnToggleGroupModule is the only import
			content = content.replace(
				/imports:\s*\[\s*BrnToggleGroupModule\s*\]/g,
				'imports: [BrnToggleGroupComponent, BrnToggleGroupItemDirective]',
			);

			tree.write(path, content);
		}
	});

	return tree;
}

/**
 * Update hlm imports to migrate from toggle to toggle-group
 */
function updateHlmImports(tree: Tree) {
	visitFiles(tree, '/', (path) => {
		// Filter for TypeScript files that might contain the imports we're interested in
		if (!path.endsWith('.ts')) return;

		let content = tree.read(path)?.toString();
		if (!content) return;

		// Only proceed if file has imports from ui-toggle-helm but not from ui-toggle-group-helm
		if (
			content.includes("from '@spartan-ng/ui-toggle-helm'") &&
			!content.includes("from '@spartan-ng/ui-toggle-group-helm'")
		) {
			// Replace HlmToggleDirective and HlmToggleGroupModule with the directives
			// Handle case with HlmToggleDirective
			content = content.replace(
				/import\s+\{\s*HlmToggleDirective\s*,\s*HlmToggleGroupModule\s*\}\s+from\s+['"]@spartan-ng\/ui-toggle-helm['"];/g,
				"import { HlmToggleGroupDirective, HlmToggleGroupItemDirective } from '@spartan-ng/ui-toggle-group-helm';",
			);

			// Also handle case with just HlmToggleGroupModule
			content = content.replace(
				/import\s+\{\s*HlmToggleGroupModule\s*\}\s+from\s+['"]@spartan-ng\/ui-toggle-helm['"];/g,
				"import { HlmToggleGroupDirective, HlmToggleGroupItemDirective } from '@spartan-ng/ui-toggle-group-helm';",
			);

			// Update the imports array to replace HlmToggleGroupModule with the directives
			// For the case where HlmToggleGroupModule is in the middle of other imports
			content = content.replace('HlmToggleGroupModule', 'HlmToggleGroupDirective, HlmToggleGroupItemDirective');

			tree.write(path, content);
		}
	});

	return tree;
}

/**
 * Replace brnToggle with hlmToggleGroupItem inside the brn-toggle-group
 */
function replaceSelector(_tree: Tree) {
	visitFiles(_tree, '/', (path) => {
		if (!path.endsWith('.html') && !path.endsWith('.ts')) {
			return;
		}

		let content = _tree.read(path)?.toString();

		if (!content) return;

		// if file contains @spartan-ng/ui-toggle-group-helm
		if (content.includes('@spartan-ng/ui-toggle-group-helm')) {
			content = content.replace(/brnToggle/g, 'hlmToggleGroupItem');
		}

		_tree.write(path, content);
	});

	return true;
}

export default migrateToggleGroupGenerator;
