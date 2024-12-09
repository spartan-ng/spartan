import { ExecutorContext } from '@nx/devkit';
import { GenerateUiDocsExecutorSchema } from './schema';

import fs from 'fs';
import path from 'path';
import ts from 'typescript';

export default async function runExecutor(options: GenerateUiDocsExecutorSchema, context: ExecutorContext) {
	const libsDir = path.join(context.root, 'libs/ui');
	const outputDir = options.outputDir || path.join(context.root, 'dist/extracted-metadata');

	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	const libraryFiles = getLibraryFiles(libsDir);
	const extractedData = await extractInputsOutputs(libraryFiles, libsDir);

	const outputPath = path.join(outputDir, 'ui-api.json');
	await fs.promises.writeFile(outputPath, JSON.stringify(extractedData, null, 2));

	console.log(`Inference completed. Output saved to ${outputPath}`);
	return { success: true };
}

function getLibraryFiles(libsDir: string): string[] {
	const libraryFiles = [];
	fs.readdirSync(libsDir).forEach((libName) => {
		const libPath = path.join(libsDir, libName);
		if (fs.statSync(libPath).isDirectory()) {
			libraryFiles.push(...getFiles(libPath));
		}
	});
	return libraryFiles;
}

function getFiles(dir: string): string[] {
	const files = [];
	fs.readdirSync(dir).forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);
		if (stat.isDirectory()) {
			files.push(...getFiles(filePath));
		} else if (filePath.endsWith('.component.ts') || filePath.endsWith('.directive.ts')) {
			files.push(filePath);
		}
	});
	return files;
}

async function extractInputsOutputs(fileNames: string[], libsDir: string) {
	const inputsOutputs = {};

	for (const fileName of fileNames) {
		const sourceFile = ts.createSourceFile(
			fileName,
			await fs.promises.readFile(fileName, 'utf8'),
			ts.ScriptTarget.ESNext,
			true,
		);

		ts.forEachChild(sourceFile, (node) => {
			if (ts.isClassDeclaration(node) && node.name) {
				const className = node.name.text;
				const relativeFilePath = path.relative(libsDir, fileName);
				const componentInfo = {
					file: `libs/ui/${relativeFilePath}`,
					inputs: [],
					outputs: [],
					selector: null,
					exportAs: null,
				};

				// Retrieve decorators
				const decorators = ts.canHaveDecorators(node) ? ts.getDecorators(node) : undefined;
				decorators?.forEach((decorator) => {
					if (ts.isCallExpression(decorator.expression)) {
						const decoratorName = decorator.expression.expression.getText();
						if (decoratorName === 'Component' || decoratorName === 'Directive') {
							const decoratorArg = decorator.expression.arguments[0];
							if (decoratorArg && ts.isObjectLiteralExpression(decoratorArg)) {
								decoratorArg.properties.forEach((prop) => {
									if (ts.isPropertyAssignment(prop)) {
										const propName = prop.name.getText();
										const propValue = prop.initializer.getText().replace(/['"]/g, '');

										if (propName === 'selector') {
											componentInfo.selector = propValue;
										} else if (propName === 'exportAs') {
											componentInfo.exportAs = propValue;
										}
									}
								});
							}
						}
					}
				});

				node.members.forEach((member) => {
					const description = getJsDocDescription(member);

					if (ts.isPropertyDeclaration(member) && member.initializer) {
						const initializer = member.initializer;

						if (ts.isCallExpression(initializer)) {
							const expressionText = initializer.expression.getText();

							if (expressionText === 'input') {
								const typeArgument = initializer.typeArguments?.[0]?.getText() || 'any';
								componentInfo.inputs.push({
									name: member.name.getText(),
									type: typeArgument,
									description,
								});
							} else if (expressionText === 'output') {
								const typeArgument = initializer.typeArguments?.[0]?.getText() || 'EventEmitter<any>';
								componentInfo.outputs.push({
									name: member.name.getText(),
									type: typeArgument,
									description,
								});
							}
						}
					}
				});

				if (
					componentInfo.inputs.length > 0 ||
					componentInfo.outputs.length > 0 ||
					componentInfo.selector ||
					componentInfo.exportAs
				) {
					addToNestedStructure(inputsOutputs, relativeFilePath, className, componentInfo);
				}
			}
		});
	}

	return inputsOutputs;
}

// Helper to get JSDoc description for a member
function getJsDocDescription(member: ts.ClassElement): string {
	const jsDocTags = ts.getJSDocCommentsAndTags(member);
	if (jsDocTags && jsDocTags.length > 0) {
		const comment = jsDocTags[0].comment;
		return typeof comment === 'string' ? comment.trim() : '';
	}
	return '';
}

// Helper function to add data to nested structure based on file path
function addToNestedStructure(rootObject, relativePath, className, componentInfo) {
	const pathSegments = relativePath.split(path.sep).filter((segment) => segment !== 'src' && segment !== 'lib');

	let current = rootObject;
	for (const segment of pathSegments.slice(0, -1)) {
		current[segment] = current[segment] || {};
		current = current[segment];
	}

	current[className] = componentInfo;
}
