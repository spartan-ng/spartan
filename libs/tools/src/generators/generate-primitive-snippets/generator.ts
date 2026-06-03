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

/** Top-level relative import specifiers (AST-based, so imports inside example strings are ignored). */
function getRelativeImports(sourceFile: ts.SourceFile): string[] {
	const out: string[] = [];
	for (const stmt of sourceFile.statements) {
		if (ts.isImportDeclaration(stmt) && ts.isStringLiteral(stmt.moduleSpecifier)) {
			const spec = stmt.moduleSpecifier.text;
			if (spec.startsWith('.')) out.push(spec);
		}
	}
	return out;
}

/**
 * Some examples (e.g. data-table) are split across sibling files the entry imports relatively.
 * The StackBlitz project only writes the entry as `src/app/example.ts`, so those siblings must be
 * bundled too. Walk the entry's relative imports (transitively), keyed by basename so the builder
 * can write each to `src/app/<basename>.ts`. Any sibling that imports back from the entry file is
 * rewritten to import from `./example` (the entry's name in the StackBlitz project).
 */
function collectSiblingFiles(
	tree: Tree,
	primitiveDir: string,
	entryFileName: string,
	entrySource: ts.SourceFile,
	accum: Record<string, string>,
): void {
	const entryRef = `./${entryFileName.replace(/\.ts$/, '')}`;
	const queue = getRelativeImports(entrySource).filter((s) => s !== entryRef);
	const visited = new Set<string>();

	while (queue.length) {
		const spec = queue.shift()!;
		const rel = spec.replace(/^\.\//, '');
		if (rel === 'example' || visited.has(rel)) continue;
		visited.add(rel);

		const candidate = [
			joinPathFragments(primitiveDir, `${rel}.ts`),
			joinPathFragments(primitiveDir, rel, 'index.ts'),
		].find((p) => tree.exists(p));
		if (!candidate) {
			logger.warn(`StackBlitz: sibling file for "${spec}" not found under ${primitiveDir}`);
			continue;
		}

		let content = tree.read(candidate, 'utf-8') ?? '';
		// Point any back-import of the entry file at the StackBlitz entry name.
		content = content.split(`'${entryRef}'`).join(`'./example'`).split(`"${entryRef}"`).join(`"./example"`);

		if (accum[rel] !== undefined && accum[rel] !== content) {
			logger.warn(`StackBlitz: sibling basename collision for "${rel}" - later example overwrites earlier.`);
		}
		accum[rel] = content;

		const siblingSource = ts.createSourceFile(candidate, content, ts.ScriptTarget.Latest, true);
		for (const next of getRelativeImports(siblingSource)) {
			if (next !== entryRef && next !== './example') queue.push(next);
		}
	}
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
	siblingFiles: Record<string, string>,
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

	// Bundle any sibling files this example imports relatively (e.g. data-table's helpers).
	collectSiblingFiles(tree, primitiveDir, fileName, sourceFile, siblingFiles);

	// Determine variable name based on filename
	const variableName = getVariableNameFromFilename(fileName, primitiveNameClean);

	return {
		name: variableName,
		code: cleanCode,
	};
}

function processPrimitive(
	tree: Tree,
	basePath: string,
	primitiveName: string,
	siblingFiles: Record<string, string>,
): Record<string, string> | null {
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
		const snippet = processExampleFile(tree, primitiveDir, fileName, primitiveNameClean, siblingFiles);
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
	// Sibling files imported by multi-file examples, keyed by basename. The StackBlitz builder
	// writes each to src/app/<basename>.ts when an example imports it.
	const siblingFiles: Record<string, string> = {};

	// Process each primitive directory
	for (const primitiveName of componentDirs) {
		try {
			const snippets = processPrimitive(tree, componentsDir, primitiveName, siblingFiles);
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

	const siblingsPath = 'apps/app/src/public/data/stackblitz-example-files.json';
	tree.write(siblingsPath, JSON.stringify(siblingFiles, null, 2));
	logger.info(`Generated StackBlitz example sibling files at: ${siblingsPath} (${Object.keys(siblingFiles).length})`);

	await formatFiles(tree);
	logger.info('Code generation complete!');
}

export default extractPrimitiveCodeGenerator;
