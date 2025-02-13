import { ExecutorContext } from '@nx/devkit';
import fs from 'fs';
import path from 'path';
import { CallExpression, ObjectLiteralExpression, Project, PropertyAssignment } from 'ts-morph';
import { GenerateUiDocsExecutorSchema } from './schema';

export default async function runExecutor(options: GenerateUiDocsExecutorSchema, context: ExecutorContext) {
	const brainDir = path.join(context.root, 'libs/brain');
	const uiDir = path.join(context.root, 'libs/ui');
	const outputDir = options.outputDir || path.join(context.root, 'dist/extracted-metadata');

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

	const extractedData = extractInputsOutputs(project);

	const outputPath = path.join(outputDir, 'ui-api.json');
	await fs.promises.writeFile(outputPath, JSON.stringify(extractedData, null, 2));

	console.log(`Inference completed. Output saved to ${outputPath}`);
	return { success: true };
}

function extractInputsOutputs(project: Project) {
	const inputsOutputs = {};

	project.getSourceFiles().forEach((sourceFile) => {
		sourceFile.getClasses().forEach((cls) => {
			const className = cls.getName();
			const relativeFilePath = path.relative('libs/', sourceFile.getFilePath());
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
						componentInfo.inputs.push({ name, type, description });
					} else {
						componentInfo.outputs.push({ name, type, description });
					}
				} else {
					// Check for signal-based inputs/outputs
					const initializer = prop.getInitializer();
					if (initializer instanceof CallExpression) {
						const callExpr = initializer as CallExpression;
						const inferredType = callExpr.getTypeArguments()?.[0]?.getText() || 'unknown';
						if (callExpr.getExpression().getText() === 'input') {
							componentInfo.inputs.push({ name, type: inferredType, description });
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

function addToNestedStructure(rootObject, relativePath, className, componentInfo) {
	const pathSegments = relativePath.split(path.sep).filter((segment) => segment !== 'src' && segment !== 'lib');

	if (pathSegments[0] === 'ui') {
		pathSegments.shift();
	} else {
		[pathSegments[0], pathSegments[1]] = [pathSegments[1], pathSegments[0]];
	}

	let current = rootObject;
	for (const segment of pathSegments.slice(0, -1)) {
		current[segment] = current[segment] || {};
		current = current[segment];
	}

	current[className] = componentInfo;
}
