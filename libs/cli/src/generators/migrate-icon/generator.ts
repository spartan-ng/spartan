import { formatFiles, Tree, visitNotIgnoredFiles } from '@nx/devkit';
import { applyChangesToString, ChangeType, StringChange } from '@nx/devkit/src/utils/string-change';
import { isImported } from '@schematics/angular/utility/ast-utils';
import ts from 'typescript';
import { MigrateIconGeneratorSchema } from './schema';

export async function migrateIconGenerator(tree: Tree, { skipFormat }: MigrateIconGeneratorSchema) {
	replaceImports(tree);
	replaceSelector(tree);
	replaceProvideIcons(tree);
	addAccordionIcon(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

function addAccordionIcon(tree: Tree) {
	visitNotIgnoredFiles(tree, '.', (path) => {
		// if this is not a html or typescript file then skip
		if (!path.endsWith('.ts') && !path.endsWith('.html')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		// if there is no hlmAccIcon or hlmAccordionIcon then skip
		if (!content.includes('hlmAccIcon') && !content.includes('hlmAccordionIcon')) {
			return;
		}

		const changes: StringChange[] = [];

		// if an element is using hlmAccIcon or hlmAccordionIcon and has no name attribute then add the name attribute
		const regex = /<ng-icon\b[^>]*(\bhlmAccIcon\b|\bhlmAccordionIcon\b)[^>]*>/g;

		let match;
		const results: { match: string; index: number }[] = [];

		while ((match = regex.exec(content)) !== null) {
			results.push({ match: match[0], index: match.index });
		}

		if (!results.length) {
			return;
		}

		for (const { match, index } of results) {
			if (!match.includes('name=')) {
				const directive = match.includes('hlmAccIcon') ? 'hlmAccIcon' : 'hlmAccordionIcon';

				const startIndex = index + match.indexOf(directive);

				changes.push({
					type: ChangeType.Insert,
					index: startIndex + directive.length,
					text: ` name="lucideChevronDown"`,
				});
			}
		}

		content = applyChangesToString(content, changes);

		tree.write(path, content);
	});
}

function replaceProvideIcons(tree: Tree) {
	visitNotIgnoredFiles(tree, '.', (path) => {
		// if this is not a typescript file then skip
		if (!path.endsWith('.ts')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		// if the user is importing `provideIcons` from '@spartan-ng/ui-icon-helm' then we need to replace it with `provideIcons` from '@ng-icons/core'
		if (!content || !content?.includes('provideIcons')) {
			return;
		}

		const sourceFile = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);

		if (!isImported(sourceFile, 'provideIcons', '@spartan-ng/ui-icon-helm')) {
			return;
		}

		const changes: StringChange[] = [];

		// remove the import of provideIcons from '@spartan-ng/ui-icon-helm'
		// add the import of provideIcons from '@ng-icons/core'
		changes.push({
			type: ChangeType.Delete,
			start: content.indexOf('provideIcons'),
			length: 'provideIcons'.length,
		});

		changes.push({
			type: ChangeType.Insert,
			index: 0,
			text: `import { provideIcons } from '@ng-icons/core';\n`,
		});

		content = applyChangesToString(content, changes);

		tree.write(path, content);
	});
}

function replaceSelector(tree: Tree) {
	// if the element is `<ng-icon hlm` then we need to replace it with `<ng-icon hlm`
	// we also need to replace the closing tag `</ng-icon>` with `</ng-icon>`
	visitNotIgnoredFiles(tree, '.', (path) => {
		// if this is not an html file or typescript file (inline templates) then skip
		if (!path.endsWith('.html') && !path.endsWith('.ts')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		content = content.replace(/<ng-icon hlm/g, '<ng-icon hlm');
		content = content.replace(/<\/hlm-icon>/g, '</ng-icon>');

		tree.write(path, content);
	});
}

function replaceImports(tree: Tree) {
	// ng modules or standalone components will have import arrays that may need updated.
	// if the import is `HlmIconModule` then we need to also import `NgIcon`,
	// if the import is `HlmIconComponent` we need to rename it to `HlmIconDirective` and add the `NgIcon` import.
	visitNotIgnoredFiles(tree, '.', (path) => {
		// if the file is not a typescript file then skip
		if (!path.endsWith('.ts')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		// convert the content to an ast
		const sourceFile = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);

		// find all imports of HlmIconModule or HlmIconComponent
		const imports = findHlmIconImports(sourceFile);

		// if no imports are found then skip
		if (imports.length === 0) {
			return;
		}

		const changes: StringChange[] = [];

		for (const identifier of imports) {
			// if the identifier is HlmIconModule then we need to add NgIcon to the imports
			if (identifier.getText() === 'HlmIconModule') {
				changes.push({
					type: ChangeType.Insert,
					index: identifier.getStart(),
					text: 'NgIcon, ',
				});
			}

			// if the identifier is HlmIconComponent then we need to rename it to HlmIconDirective and add NgIcon to the imports
			if (identifier.getText() === 'HlmIconComponent') {
				changes.push({
					type: ChangeType.Insert,
					index: identifier.getStart(),
					text: 'NgIcon, ',
				});
			}

			// check if the NgIcon import is already present
			if (!hasImport(content, 'NgIcon', '@ng-icons/core')) {
				changes.push({
					type: ChangeType.Insert,
					index: 0,
					text: `import { NgIcon } from '@ng-icons/core';\n`,
				});
			}
		}

		content = applyChangesToString(content, changes);

		// if there are any remaining uses of HlmIconComponent then replace them with HlmIconDirective
		content = content.replace(/HlmIconComponent/g, 'HlmIconDirective');

		tree.write(path, content);
	});
}

function findHlmIconImports(node: ts.SourceFile): ts.Node[] {
	const matches: ts.Identifier[] = [];

	const visit = (node: ts.Node) => {
		if (
			ts.isPropertyAssignment(node) &&
			node.name.getText() === 'imports' &&
			ts.isArrayLiteralExpression(node.initializer)
		) {
			// check if the array literal contains the HlmIconModule or HlmIconComponent
			node.initializer.elements.forEach((element) => {
				if (ts.isIdentifier(element)) {
					if (element.getText() === 'HlmIconModule' || element.getText() === 'HlmIconComponent') {
						matches.push(element);
					}
				}
			});
		}

		ts.forEachChild(node, visit);
	};

	visit(node);

	return matches;
}

function hasImport(contents: string, importName: string, importPath: string): boolean {
	const sourceFile = ts.createSourceFile('temp.ts', contents, ts.ScriptTarget.Latest, true);
	return isImported(sourceFile, importName, importPath);
}

export default migrateIconGenerator;