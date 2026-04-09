import { formatFiles, type Tree } from '@nx/devkit';
import { applyChangesToString, ChangeType, type StringChange } from '@nx/devkit/src/utils/string-change';
import ts from 'typescript';
import { getImportAlias } from '../../utils/config';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateIconSelectorGeneratorSchema } from './schema';

export async function migrateIconSelectorGenerator(tree: Tree, { skipFormat }: MigrateIconSelectorGeneratorSchema) {
	const importAlias = await getImportAlias(tree, false);
	const iconImportPath = `${importAlias}/icon`;

	replaceCssSelectors(tree);
	addHlmIconToBareNgIcons(tree, iconImportPath);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

/**
 * Replace ng-icon CSS element selectors with [hlmIcon] attribute selectors
 * in Tailwind class strings within TypeScript, HTML, and CSS files.
 */
function replaceCssSelectors(tree: Tree) {
	visitFiles(tree, '.', (path) => {
		if (!path.endsWith('.ts') && !path.endsWith('.html') && !path.endsWith('.css')) {
			return;
		}

		const content = tree.read(path, 'utf-8');

		if (!content || !content.includes('ng-icon')) {
			return;
		}

		let updated = content;

		// [&_ng-icon → [&_[hlmIcon]  (descendant)
		updated = updated.replace(/\[&_ng-icon/g, '[&_[hlmIcon]');

		// [&>ng-icon → [&>[hlmIcon]  (direct child)
		updated = updated.replace(/\[&>ng-icon/g, '[&>[hlmIcon]');

		// [&>_ng-icon → [&>_[hlmIcon]  (direct child with space, sidebar pattern)
		updated = updated.replace(/\[&>_ng-icon/g, '[&>_[hlmIcon]');

		// has-[>ng-icon] → has-[>[hlmIcon]]
		updated = updated.replace(/has-\[>ng-icon\]/g, 'has-[>[hlmIcon]]');

		// group-has-[>ng-icon] → group-has-[>[hlmIcon]]
		updated = updated.replace(/group-has-\[>ng-icon\]/g, 'group-has-[>[hlmIcon]]');

		// *:[ng-icon] → *:[[hlmIcon]]
		updated = updated.replace(/\*:\[ng-icon\]/g, '*:[[hlmIcon]]');

		// **:[ng-icon] → **:[[hlmIcon]]
		updated = updated.replace(/\*\*:\[ng-icon\]/g, '**:[[hlmIcon]]');

		// >ng-icon] → >[hlmIcon]]  (inside other arbitrary selectors)
		updated = updated.replace(/>ng-icon\]/g, '>[hlmIcon]]');

		if (updated !== content) {
			tree.write(path, updated);
		}
	});
}

/**
 * Find bare <ng-icon> elements (without hlm or hlmIcon attribute)
 * and add the hlmIcon attribute. Also ensure HlmIcon is imported.
 */
function addHlmIconToBareNgIcons(tree: Tree, iconImportPath: string) {
	visitFiles(tree, '.', (path) => {
		if (!path.endsWith('.ts') && !path.endsWith('.html')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content || !content.includes('<ng-icon')) {
			return;
		}

		const changes: StringChange[] = [];
		const regex = /<ng-icon\b([^>]*)>/g;
		let match;
		let hasBareNgIcon = false;

		while ((match = regex.exec(content)) !== null) {
			const attrs = match[1];

			if (/\bhlm\b/.test(attrs) || /\bhlmIcon\b/.test(attrs)) {
				continue;
			}

			if (isInsideStringLiteral(content, match.index, 'selector')) {
				continue;
			}

			hasBareNgIcon = true;

			const insertIndex = match.index + '<ng-icon'.length;
			changes.push({
				type: ChangeType.Insert,
				index: insertIndex,
				text: ' hlmIcon',
			});
		}

		if (!hasBareNgIcon) {
			return;
		}

		content = applyChangesToString(content, changes);

		if (path.endsWith('.ts')) {
			content = ensureHlmIconImport(content, iconImportPath);
		}

		tree.write(path, content);
	});
}

function isInsideStringLiteral(content: string, index: number, propertyName: string): boolean {
	const before = content.substring(Math.max(0, index - 200), index);
	const selectorPattern = new RegExp(propertyName + '\\s*:\\s*[\'"`][^\'"`]*$');
	return selectorPattern.test(before);
}

/**
 * Ensure the file has an import for HlmIcon from the resolved icon import path.
 */
function ensureHlmIconImport(content: string, iconImportPath: string): string {
	// Check if HlmIcon is already imported from any path
	if (isHlmIconImported(content)) {
		return content;
	}

	// Check if there's an existing import from the icon path that we can extend
	const escapedPath = iconImportPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const existingImportPattern = new RegExp('import\\s*\\{([^}]*)\\}\\s*from\\s*[\'"]' + escapedPath + '[\'"]');
	const existingImport = content.match(existingImportPattern);

	if (existingImport && !/\bHlmIcon\b/.test(existingImport[1])) {
		const updatedImport = existingImport[0].replace(existingImport[1], existingImport[1].trimEnd() + ', HlmIcon ');
		return content.replace(existingImport[0], updatedImport);
	}

	return "import { HlmIcon } from '" + iconImportPath + "';\n" + content;
}

/**
 * Check if HlmIcon is already imported from any path by scanning the AST.
 */
function isHlmIconImported(content: string): boolean {
	const sourceFile = ts.createSourceFile('temp.ts', content, ts.ScriptTarget.Latest, true);

	for (const statement of sourceFile.statements) {
		if (!ts.isImportDeclaration(statement) || !statement.importClause?.namedBindings) {
			continue;
		}

		const bindings = statement.importClause.namedBindings;
		if (!ts.isNamedImports(bindings)) {
			continue;
		}

		if (bindings.elements.some((el) => el.name.text === 'HlmIcon')) {
			return true;
		}
	}

	return false;
}

export default migrateIconSelectorGenerator;
