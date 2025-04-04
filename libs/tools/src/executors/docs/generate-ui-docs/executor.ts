import { ExecutorContext } from '@nx/devkit';
import fs from 'fs';
import path from 'path';
import { CallExpression, ObjectLiteralExpression, Project, PropertyAssignment } from 'ts-morph';
import { GenerateUiDocsExecutorSchema } from './schema';

export default async function runExecutor(options: GenerateUiDocsExecutorSchema, context: ExecutorContext) {
	// Convert relative paths to absolute paths using workspace root
	const brainDir = path.join(context.root, options.brainDir);
	const uiDir = path.join(context.root, options.uiDir);
	const outputDir = path.join(context.root, options.outputDir);

	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	const project = new Project();
	project.addSourceFilesAtPaths([
		`${brainDir}/**/*.component.ts`,
		`${brainDir}/**/*.directive.ts`,
		`${uiDir}/**/*.component.ts`,
		`${uiDir}/**/*.directive.ts`,
	]);

	const extractedData = extractInputsOutputs(project, context.root);

	const outputPath = path.join(outputDir, options.outputFile);
	await fs.promises.writeFile(outputPath, JSON.stringify(extractedData, null, 2));

	return { success: true };
}

function extractInputsOutputs(project: Project, workspaceRoot: string) {
	const inputsOutputs = {};

	project.getSourceFiles().forEach((sourceFile) => {
		sourceFile.getClasses().forEach((cls) => {
			const className = cls.getName();
			// Get the full file path and make it relative to workspace root
			const fullPath = sourceFile.getFilePath();
			const relativeFilePath = path.relative(workspaceRoot, fullPath);
			const componentInfo = {
				file: relativeFilePath,
				inputs: [],
				outputs: [],
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
				const type = prop.getType().getText();
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
						componentInfo.inputs.push({ name, type, description, defaultValue });
					} else {
						componentInfo.outputs.push({ name, type, description });
					}
				} else {
					// Check for signal-based inputs/outputs
					const initializer = prop.getInitializer();
					if (initializer instanceof CallExpression) {
						const callExpr = initializer as CallExpression;
						const inferredType = callExpr.getTypeArguments()?.[0]?.getText() || 'unknown';

						// Extract default value from signal-based input
						let defaultValue = null;
						const callArgs = callExpr.getArguments();
						if (callArgs.length > 0) {
							// Get the text representation of the argument
							const argText = callArgs[0].getText();
							// For signal-based inputs, the default value is directly in the argument
							// Example: input<'single' | 'multiple'>('single')
							// We need to extract the value between the last set of parentheses
							const match = argText.match(/\(([^()]*)\)$/);
							if (match && match[1]) {
								defaultValue = match[1].replace(/['"]/g, '');
							} else {
								// If no parentheses, the entire argument is the default value
								defaultValue = argText.replace(/['"]/g, '');
							}
						}

						if (callExpr.getExpression().getText() === 'input') {
							componentInfo.inputs.push({ name, type: inferredType, description, defaultValue });
						} else if (callExpr.getExpression().getText() === 'output') {
							componentInfo.outputs.push({ name, type: inferredType, description });
						}
					}
				}
			});

			if (
				componentInfo.inputs.length ||
				componentInfo.outputs.length ||
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
