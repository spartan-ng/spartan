import { tsquery } from '@phenomnomnominal/tsquery';
import * as ts from 'typescript';

export function addToExportConstArray(sourceCode: string, newEntry: string): string {
	const ast = tsquery.ast(sourceCode);
	const query =
		'VariableStatement:has(ExportKeyword) > VariableDeclarationList VariableDeclaration ArrayLiteralExpression';
	const nodes = tsquery(ast, query) as ts.ArrayLiteralExpression[];

	if (nodes.length === 0) {
		throw new Error('No matching export const array found.');
	}

	const arrayNode = nodes[0];
	const elements = [...arrayNode.elements.map((el) => el.getText()), newEntry];

	return sourceCode.slice(0, arrayNode.getStart()) + `[${elements.join(', ')}]` + sourceCode.slice(arrayNode.getEnd());
}

export function addExportStatement(sourceCode: string, exportStatement: string): string {
	const ast = tsquery.ast(sourceCode);
	const importQuery = 'ImportDeclaration';
	const exportQuery = 'ExportDeclaration';

	const importNodes = tsquery(ast, importQuery) as ts.ImportDeclaration[];
	const exportNodes = tsquery(ast, exportQuery) as ts.ExportDeclaration[];

	let insertPosition = 0;
	if (importNodes.length > 0) {
		// Place after the last import
		insertPosition = importNodes[importNodes.length - 1].getEnd();
	}
	if (exportNodes.length > 0) {
		// If exports exist, place after the last export
		insertPosition = exportNodes[exportNodes.length - 1].getEnd();
	}

	return sourceCode.slice(0, insertPosition) + `\n${exportStatement}` + sourceCode.slice(insertPosition);
}

export function addImportStatement(sourceCode: string, importStatement: string): string {
	const ast = tsquery.ast(sourceCode);
	const query = 'ImportDeclaration';
	const importNodes = tsquery(ast, query) as ts.ImportDeclaration[];

	if (importNodes.length === 0) {
		// No existing imports, insert at the beginning
		return `${importStatement}\n\n${sourceCode}`;
	}

	const lastImport = importNodes[importNodes.length - 1];

	return sourceCode.slice(0, lastImport.getEnd()) + `\n${importStatement}` + sourceCode.slice(lastImport.getEnd());
}
