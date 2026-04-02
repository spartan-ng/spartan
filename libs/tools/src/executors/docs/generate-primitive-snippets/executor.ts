import type { ExecutorContext } from '@nx/devkit';
import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import { getVariableNameFromFilename } from './getVarNameFromFileName';

function readFileAsSourceFile(filePath: string): ts.SourceFile | null {
	if (!fs.existsSync(filePath)) {
		console.warn(`File not found: ${filePath}`);
		return null;
	}
	const content = fs.readFileSync(filePath, 'utf-8');
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

	ts.forEachChild(sourceFile, (node) => {
		if (shouldSkipNode(node, sourceFile)) {
			return;
		}

		cleanContent += node.getFullText(sourceFile);
	});

	return cleanContent.trim();
}

function getComponentDirectories(componentsDir: string): string[] {
	if (!fs.existsSync(componentsDir)) {
		console.warn(`Base components directory not found: ${componentsDir}`);
		return [];
	}

	return fs.readdirSync(componentsDir).filter((name) => {
		const fullPath = path.join(componentsDir, name);
		return fs.statSync(fullPath).isDirectory();
	});
}

function getExampleFiles(primitiveDir: string): string[] {
	return fs
		.readdirSync(primitiveDir)
		.filter((fileName) => fileName.endsWith('.preview.ts') || fileName.endsWith('.example.ts'));
}

function processExampleFile(
	primitiveDir: string,
	fileName: string,
	primitiveNameClean: string,
): { name: string; code: string } | null {
	const filePath = path.join(primitiveDir, fileName);
	const sourceFile = readFileAsSourceFile(filePath);

	if (!sourceFile) {
		return null;
	}

	const cleanCode = extractCleanCodeFromSourceFile(sourceFile);

	if (!cleanCode || !cleanCode.includes('@Component')) {
		console.warn(`No component found in: ${filePath}`);
		return null;
	}

	const variableName = getVariableNameFromFilename(fileName, primitiveNameClean);

	return {
		name: variableName,
		code: cleanCode,
	};
}

function processPrimitive(componentsDir: string, primitiveName: string): Record<string, string> | null {
	const primitiveNameClean = primitiveName.replaceAll('(', '').replaceAll(')', '');
	const primitiveDir = path.join(componentsDir, primitiveName);

	const exampleFiles = getExampleFiles(primitiveDir);
	if (exampleFiles.length === 0) {
		console.info(`No example files found for ${primitiveName}. Skipping.`);
		return null;
	}

	const codeSnippets: Array<{ name: string; code: string }> = [];

	for (const fileName of exampleFiles) {
		const snippet = processExampleFile(primitiveDir, fileName, primitiveNameClean);
		if (snippet) {
			codeSnippets.push(snippet);
		}
	}

	if (codeSnippets.length === 0) {
		console.info(`No valid code snippets found for ${primitiveName}. Skipping.`);
		return null;
	}

	const snippetsMap: Record<string, string> = {};
	for (const snippet of codeSnippets) {
		snippetsMap[snippet.name] = snippet.code;
	}
	return snippetsMap;
}

export default async function runExecutor(_options: Record<string, never>, context: ExecutorContext) {
	console.log('[primitive-snippets] Extract Primitive Code running...');

	const componentsDir = path.join(context.root, 'apps/app/src/app/pages/(components)/components');
	const componentDirs = getComponentDirectories(componentsDir);

	if (componentDirs.length === 0) {
		console.info('No component directories found. Writing empty snippets file.');
	} else {
		console.info(`Found ${componentDirs.length} component directories.`);
	}

	const allPrimitivesSnippets: Record<string, Record<string, string>> = {};

	for (const primitiveName of componentDirs) {
		try {
			const snippets = processPrimitive(componentsDir, primitiveName);
			if (snippets) {
				const primitiveNameClean = primitiveName.replaceAll('(', '').replaceAll(')', '');
				allPrimitivesSnippets[primitiveNameClean] = snippets;
			}
		} catch (error) {
			console.error(`Failed to process ${primitiveName}: ${error}`);
		}
	}

	const outputPath = path.join(context.root, 'apps/app/src/public/data/primitives-snippets.json');
	const outputDir = path.dirname(outputPath);
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}
	fs.writeFileSync(outputPath, JSON.stringify(allPrimitivesSnippets, null, 2));

	console.log(
		`[primitive-snippets] Generated primitives snippets at: apps/app/src/public/data/primitives-snippets.json`,
	);
	console.log('[primitive-snippets] Done!');
	return { success: true };
}
