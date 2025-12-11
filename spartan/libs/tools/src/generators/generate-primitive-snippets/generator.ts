import { type Tree, formatFiles, joinPathFragments, logger } from '@nx/devkit';
import ts from 'typescript';
import { getVariableNameFromFilename } from './getVarNameFromFileName';

function readFileAsSourceFile(tree: Tree, filePath: string): ts.SourceFile | null {
	const content = tree.read(filePath, 'utf-8');
	if (!content) {
		logger.warn(`File not found: ${filePath}`);
		return null;
	}

	return ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
}

function shouldSkipNode(node: ts.Node, sourceFile: ts.SourceFile): boolean {
	const nodeText = node.getFullText(sourceFile);

	return (
		nodeText.includes('export const defaultSkeleton =') ||
		nodeText.includes('export const defaultStyles =') ||
		nodeText.includes('export const defaultCode =') ||
		nodeText.includes('export const defaultImports =')
	);
}

function extractCleanCodeFromSourceFile(sourceFile: ts.SourceFile): string {
	let cleanContent = '';

	// Use AST to properly traverse and filter nodes
	ts.forEachChild(sourceFile, (node) => {
		if (shouldSkipNode(node, sourceFile)) {
			return; // Skip this node - it's an export we don't want
		}

		// Keep this node - add its text to our clean content
		cleanContent += node.getFullText(sourceFile);
	});

	return cleanContent.trim();
}

function getComponentDirectories(tree: Tree, basePath: string): string[] {
	if (!tree.exists(basePath)) {
		logger.warn(`Base components directory not found: ${basePath}`);
		return [];
	}

	return tree.children(basePath).filter((name) => {
		const fullPath = joinPathFragments(basePath, name);
		return tree.isFile(fullPath) === false; // Only directories
	});
}

function getExampleFiles(tree: Tree, primitiveDir: string): string[] {
	return tree
		.children(primitiveDir)
		.filter((fileName) => fileName.endsWith('.preview.ts') || fileName.endsWith('.example.ts'));
}

function processExampleFile(
	tree: Tree,
	primitiveDir: string,
	fileName: string,
	primitiveNameClean: string,
): { name: string; code: string } | null {
	const filePath = joinPathFragments(primitiveDir, fileName);
	const sourceFile = readFileAsSourceFile(tree, filePath);

	if (!sourceFile) {
		return null;
	}

	// Use AST to extract clean code
	const cleanCode = extractCleanCodeFromSourceFile(sourceFile);

	if (!cleanCode || !cleanCode.includes('@Component')) {
		logger.warn(`No component found in: ${filePath}`);
		return null;
	}

	// Determine variable name based on filename
	const variableName = getVariableNameFromFilename(fileName, primitiveNameClean);

	return {
		name: variableName,
		code: cleanCode,
	};
}

function processPrimitive(tree: Tree, basePath: string, primitiveName: string): Record<string, string> | null {
	const primitiveNameClean = primitiveName.replaceAll('(', '').replaceAll(')', '');
	const primitiveDir = joinPathFragments(basePath, primitiveName);

	const exampleFiles = getExampleFiles(tree, primitiveDir);
	if (exampleFiles.length === 0) {
		logger.info(`No example files found for ${primitiveName}. Skipping.`);
		return null;
	}

	const codeSnippets: Array<{ name: string; code: string }> = [];

	// Process each example file using AST
	for (const fileName of exampleFiles) {
		const snippet = processExampleFile(tree, primitiveDir, fileName, primitiveNameClean);
		if (snippet) {
			codeSnippets.push(snippet);
		}
	}

	if (codeSnippets.length === 0) {
		logger.info(`No valid code snippets found for ${primitiveName}. Skipping.`);
		return null;
	}

	const snippetsMap: Record<string, string> = {};
	for (const snippet of codeSnippets) {
		snippetsMap[snippet.name] = snippet.code;
	}
	return snippetsMap;
}

export async function extractPrimitiveCodeGenerator(tree: Tree): Promise<void> {
	logger.info('Extract Primitive Code generator running...');

	const componentsDir = 'apps/app/src/app/pages/(components)/components';
	const componentDirs = getComponentDirectories(tree, componentsDir);

	if (componentDirs.length === 0) {
		logger.info('No component directories found. Writing empty snippets file.');
	} else {
		logger.info(`Found ${componentDirs.length} component directories.`);
	}

	const allPrimitivesSnippets: Record<string, Record<string, string>> = {};

	// Process each primitive directory
	for (const primitiveName of componentDirs) {
		try {
			const snippets = processPrimitive(tree, componentsDir, primitiveName);
			if (snippets) {
				const primitiveNameClean = primitiveName.replaceAll('(', '').replaceAll(')', '');
				allPrimitivesSnippets[primitiveNameClean] = snippets;
			}
		} catch (error) {
			logger.error(`Failed to process ${primitiveName}: ${error}`);
			// Continue with other primitives even if one fails
		}
	}

	const outputPath = 'apps/app/src/public/data/primitives-snippets.json';
	tree.write(outputPath, JSON.stringify(allPrimitivesSnippets, null, 2));
	logger.info(`Generated primitives snippets at: ${outputPath}`);

	await formatFiles(tree);
	logger.info('Code generation complete!');
}

export default extractPrimitiveCodeGenerator;
