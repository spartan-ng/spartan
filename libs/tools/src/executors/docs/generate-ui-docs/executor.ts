import type { ExecutorContext } from '@nx/devkit';
import fs from 'fs';
import path from 'path';
import { CallExpression, ObjectLiteralExpression, Project, PropertyAssignment } from 'ts-morph';
import type { GenerateUiDocsExecutorSchema } from './schema';

export default async function runExecutor(options: GenerateUiDocsExecutorSchema, context: ExecutorContext) {
	// Convert relative paths to absolute paths using workspace root
	const brainDir = path.join(context.root, options.brainDir);
	const helmDir = path.join(context.root, options.helmDir);
	const outputDir = path.join(context.root, options.outputDir);

	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	const project = new Project();
	project.addSourceFilesAtPaths([
		`${brainDir}/**/*.ts`,
		`${helmDir}/**/*.ts`,
		`!${brainDir}/**/__tests__/**/*.ts`,
		`!${helmDir}/**/__tests__/**/*.ts`,
		`!${brainDir}/**/*.(spec|test).ts`,
		`!${helmDir}/**/*.(spec|test).ts`,
	]);

	const extractedData = extractInputsOutputs(project, context.root);

	const outputPath = path.join(outputDir, options.outputFile);
	await fs.promises.writeFile(outputPath, JSON.stringify(extractedData, null, 2));

	return { success: true };
}

function extractInputsOutputs(project: Project, workspaceRoot: string) {
	const inputsOutputs = {};

	project.getSourceFiles().forEach((sourceFile) => {
		// if the source file is a .spec.ts file then skip
		if (sourceFile.getFilePath().endsWith('.spec.ts')) {
			return;
		}

		sourceFile.getClasses().forEach((cls) => {
			const className = cls.getName();
			// Get the full file path and make it relative to workspace root
			const fullPath = sourceFile.getFilePath();
			const relativeFilePath = path.relative(workspaceRoot, fullPath);
			const componentInfo = {
				file: relativeFilePath,
				inputs: [],
				outputs: [],
				models: [],
				selector: null,
				exportAs: null,
			};

			const decorator = cls.getDecorator((d) => d.getName() === 'Component' || d.getName() === 'Directive');
			if (decorator) {
				const args = decorator.getArguments();
				if (args.length > 0 && args[0] instanceof ObjectLiteralExpression) {
					const obj = args[0] as ObjectLiteralExpression;
					componentInfo.selector = (obj.getProperty('selector') as PropertyAssignment)
						?.getInitializer()
						?.getText()
						.replace(/['"]/g, '');
					componentInfo.exportAs = (obj.getProperty('exportAs') as PropertyAssignment)
						?.getInitializer()
						?.getText()
						.replace(/['"]/g, '');
				}
			}

			cls.getProperties().forEach((prop) => {
				// Prefer the type as written in the code (without import path)
				const type = prop.getTypeNode()?.getText() || prop.getType().getText();
				const decorator = prop.getDecorator((d) => d.getName() === 'Input' || d.getName() === 'Output');
				const name = prop.getName();
				const description = prop
					.getJsDocs()
					.map((doc) => doc.getComment())
					.join('\n');

				if (decorator) {
					if (decorator.getName() === 'Input') {
						// Extract default value from Input decorator
						let defaultValue = null;
						const decoratorArgs = decorator.getArguments();
						if (decoratorArgs.length > 0) {
							// Get the text representation of the argument
							const argText = decoratorArgs[0].getText();
							// Extract the value between parentheses if present
							const match = argText.match(/\((.*?)\)/);
							if (match && match[1]) {
								defaultValue = match[1].replace(/['"]/g, '');
							}
						}
						componentInfo.inputs.push({ name, type, description, defaultValue, required: false });
					} else {
						componentInfo.outputs.push({ name, type, description });
					}
				} else {
					// Check for signal-based inputs/outputs/models
					const initializer = prop.getInitializer();
					if (initializer instanceof CallExpression) {
						const callExpr = initializer as CallExpression;
						const exprText = callExpr.getExpression().getText();
						// Prefer the type as written in the code (without import path)
						const typeArg = callExpr.getTypeArguments()?.[0];
						let inferredType = 'unknown';
						if (typeArg) {
							inferredType = typeArg.getText();
						}

						const required = exprText === 'input.required';

						// Extract default value from signal-based input/model
						let defaultValue = null;
						const callArgs = callExpr.getArguments();
						if (!required && callArgs.length > 0) {
							const argText = callArgs[0].getText();
							const match = argText.match(/\(([^()]*)\)$/);
							if (match && match[1]) {
								defaultValue = match[1].replace(/['"]/g, '');
							} else {
								defaultValue = argText.replace(/['"]/g, '');
							}
						}

						if (exprText === 'input' || required) {
							let inputName = name;
							if (callArgs.length > 1) {
								const lastArg = callArgs[callArgs.length - 1];
								if (lastArg instanceof ObjectLiteralExpression) {
									const aliasProp = lastArg.getProperty('alias');
									if (aliasProp instanceof PropertyAssignment) {
										const aliasValue = aliasProp.getInitializer().getText().replace(/['"]/g, '');
										if (aliasValue) inputName = aliasValue;
									}
								}
							}
							componentInfo.inputs.push({ name: inputName, type: inferredType, description, defaultValue, required });
						} else if (exprText === 'output') {
							componentInfo.outputs.push({ name, type: inferredType, description });
						} else if (exprText === 'model') {
							componentInfo.models.push({ name, type: inferredType, description, defaultValue });
						}
					}
				}
			});

			if (
				componentInfo.inputs.length ||
				componentInfo.outputs.length ||
				componentInfo.models.length ||
				componentInfo.selector ||
				componentInfo.exportAs
			) {
				addToNestedStructure(inputsOutputs, relativeFilePath, className, componentInfo);
			}
		});
	});

	return inputsOutputs;
}

function addToNestedStructure(rootObject, relativeFilePath, className, componentInfo) {
	// Split path and remove 'src' and 'lib' segments
	const pathSegments = relativeFilePath.split(path.sep).filter((segment) => segment !== 'src' && segment !== 'lib');

	// Remove 'libs' prefix if present
	if (pathSegments[0] === 'libs') {
		pathSegments.shift();
	}

	// Extract component type (e.g., 'accordion', 'button')
	const componentType = pathSegments[1];

	// Extract library type (e.g., 'brain', 'ui')
	const libraryType = pathSegments[0];

	// Create the nested structure
	if (!rootObject[componentType]) {
		rootObject[componentType] = {};
	}

	if (!rootObject[componentType][libraryType]) {
		rootObject[componentType][libraryType] = {};
	}

	// Add the component to the structure
	rootObject[componentType][libraryType][className] = componentInfo;
}
