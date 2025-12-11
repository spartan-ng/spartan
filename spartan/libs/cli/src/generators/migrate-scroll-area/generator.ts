import { formatFiles, type Tree, visitNotIgnoredFiles } from '@nx/devkit';
import { applyChangesToString, ChangeType, type StringChange } from '@nx/devkit/src/utils/string-change';
import { isImported } from '@schematics/angular/utility/ast-utils';
import ts from 'typescript';
import type { MigrateScrollAreaGeneratorSchema } from './schema';

export async function migrateScrollAreaGenerator(tree: Tree, { skipFormat }: MigrateScrollAreaGeneratorSchema) {
	replaceImports(tree);
	replaceSelector(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

function replaceSelector(tree: Tree) {
	// if the element is `<hlm-scroll-area` then we need to replace it with `<ng-scrollbar hlm`
	// we also need to replace the closing tag `</hlm-scroll-area>` with `</ng-scrollbar>`
	visitNotIgnoredFiles(tree, '.', (path) => {
		// if this is not an html file or typescript file (inline templates) then skip
		if (!path.endsWith('.html') && !path.endsWith('.ts')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		content = content.replace(/<hlm-scroll-area/g, '<ng-scrollbar hlm');
		content = content.replace(/<\/hlm-scroll-area>/g, '</ng-scrollbar>');

		tree.write(path, content);
	});
}

function replaceImports(tree: Tree) {
	// ng modules or standalone components will have import arrays that may need updated.
	// if the import is `HlmScrollAreaModule` then we need to also import `NgScrollbarModule`,
	// if the import is `HlmScrollAreaComponent` we need to rename it to `HlmScrollAreaDirective` and add the `NgScrollbarModule` import.
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

		// find all imports of HlmScrollAreaModule or HlmScrollAreaComponent
		const imports = findHlmScrollAreaImports(sourceFile);

		// if no imports are found then skip
		if (imports.length === 0) {
			return;
		}

		const changes: StringChange[] = [];

		for (const identifier of imports) {
			// if the identifier is HlmScrollAreaModule then we need to add NgScrollbarModule to the imports
			if (identifier.getText() === 'HlmScrollAreaModule') {
				changes.push({
					type: ChangeType.Insert,
					index: identifier.getStart(),
					text: 'NgScrollbarModule, ',
				});
			}

			// if the identifier is HlmScrollAreaComponent then we need to rename it to HlmScrollAreaDirective and add NgScrollbarModule to the imports
			if (identifier.getText() === 'HlmScrollAreaComponent') {
				changes.push({
					type: ChangeType.Insert,
					index: identifier.getStart(),
					text: 'NgScrollbarModule, ',
				});
			}

			// check if the NgScrollbarModule import is already present
			if (!hasImport(content, 'NgScrollbarModule', 'ngx-scrollbar')) {
				changes.push({
					type: ChangeType.Insert,
					index: 0,
					text: `import { NgScrollbarModule } from 'ngx-scrollbar';\n`,
				});
			}
		}

		content = applyChangesToString(content, changes);

		// if there are any remaining uses of HlmScrollAreaComponent then replace them with HlmScrollAreaDirective
		content = content.replace(/HlmScrollAreaComponent/g, 'HlmScrollAreaDirective');

		tree.write(path, content);
	});
}

function findHlmScrollAreaImports(node: ts.SourceFile): ts.Node[] {
	const matches: ts.Identifier[] = [];

	const visit = (node: ts.Node) => {
		if (
			ts.isPropertyAssignment(node) &&
			node.name.getText() === 'imports' &&
			ts.isArrayLiteralExpression(node.initializer)
		) {
			// check if the array literal contains the HlmScrollAreaModule or HlmScrollAreaComponent
			node.initializer.elements.forEach((element) => {
				if (ts.isIdentifier(element)) {
					if (element.getText() === 'HlmScrollAreaModule' || element.getText() === 'HlmScrollAreaComponent') {
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

export default migrateScrollAreaGenerator;
