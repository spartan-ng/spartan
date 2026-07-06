import type { ExecutorContext } from '@nx/devkit';
import fs from 'fs';
import path from 'path';
import type { ClassDeclaration } from 'ts-morph';
import { ArrayLiteralExpression, CallExpression, ObjectLiteralExpression, Project, PropertyAssignment } from 'ts-morph';
import { writePerComponentData } from '../../../write-per-component-data';
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

	const perComponentDir = path.join(outputDir, 'ui-api');
	fs.mkdirSync(perComponentDir, { recursive: true });
	writePerComponentData(extractedData, perComponentDir, (filePath, content) => fs.writeFileSync(filePath, content));

	return { success: true };
}

function extractInputsOutputs(project: Project, workspaceRoot: string) {
	const inputsOutputs = {};

	// Build a registry of every class by name so we can resolve base classes even
	// when they are imported via TS path aliases (which the type checker can't
	// resolve without a tsconfig).
	const classRegistry = new Map<string, ClassDeclaration>();
	project.getSourceFiles().forEach((sourceFile) => {
		sourceFile.getClasses().forEach((cls) => {
			const name = cls.getName();
			if (name && !classRegistry.has(name)) {
				classRegistry.set(name, cls);
			}
		});
	});

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

			// Collect members from the class itself and every ancestor it extends,
			// so inherited inputs/outputs/models show up in the generated docs.
			const seenMembers = new Set<string>();
			collectAllMembers(cls, componentInfo, classRegistry, seenMembers);

			// Collect inputs and outputs exposed through `hostDirectives`, applying the
			// renaming declared in the decorator (e.g. 'brnTabsContent: hlmTabsContent').
			collectHostDirectiveMembers(cls, componentInfo, classRegistry, seenMembers);

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

function collectAllMembers(
	cls: ClassDeclaration,
	componentInfo,
	classRegistry: Map<string, ClassDeclaration>,
	seen: Set<string>,
) {
	const visitedClasses = new Set<ClassDeclaration>();
	let currentClass: ClassDeclaration | undefined = cls;
	while (currentClass && !visitedClasses.has(currentClass)) {
		visitedClasses.add(currentClass);
		collectMembers(currentClass, componentInfo, seen);
		currentClass = resolveBaseClass(currentClass, classRegistry);
	}
}

function collectHostDirectiveMembers(
	cls: ClassDeclaration,
	componentInfo,
	classRegistry: Map<string, ClassDeclaration>,
	seen: Set<string>,
) {
	const decorator = cls.getDecorator((d) => d.getName() === 'Component' || d.getName() === 'Directive');
	if (!decorator) return;

	const args = decorator.getArguments();
	if (!args.length || !(args[0] instanceof ObjectLiteralExpression)) return;

	const hostDirectivesProp = args[0].getProperty('hostDirectives');
	if (!(hostDirectivesProp instanceof PropertyAssignment)) return;

	const hostDirectivesInit = hostDirectivesProp.getInitializer();
	if (!(hostDirectivesInit instanceof ArrayLiteralExpression)) return;

	hostDirectivesInit.getElements().forEach((element) => {
		// A bare directive reference (e.g. `BrnDialogClose`) exposes nothing publicly.
		if (!(element instanceof ObjectLiteralExpression)) return;

		const directiveProp = element.getProperty('directive');
		if (!(directiveProp instanceof PropertyAssignment)) return;

		const directiveName = directiveProp.getInitializer().getText().replace(/<.*>$/s, '').trim();
		const directiveClass = classRegistry.get(directiveName);
		if (!directiveClass) return;

		// Resolve the referenced directive's members (including inherited ones) so the
		// exposed mappings can be matched by their public name.
		const directiveInfo = { inputs: [], outputs: [], models: [] };
		collectAllMembers(directiveClass, directiveInfo, classRegistry, new Set<string>());

		mapHostDirectiveMembers(element.getProperty('inputs'), directiveInfo.inputs, 'input', seen, componentInfo.inputs);
		mapHostDirectiveMembers(
			element.getProperty('outputs'),
			directiveInfo.outputs,
			'output',
			seen,
			componentInfo.outputs,
		);
	});
}

function mapHostDirectiveMembers(memberProp, directiveMembers, kind: 'input' | 'output', seen: Set<string>, target) {
	if (!(memberProp instanceof PropertyAssignment)) return;
	const init = memberProp.getInitializer();
	if (!(init instanceof ArrayLiteralExpression)) return;

	const membersByName = new Map(directiveMembers.map((member) => [member.name, member]));

	init.getElements().forEach((entry) => {
		// Entries are `'memberName'` or `'memberName: publicAlias'`.
		const [originalName, alias] = entry
			.getText()
			.replace(/['"]/g, '')
			.split(':')
			.map((part) => part.trim());
		const publicName = alias || originalName;

		const resolved = membersByName.get(originalName);
		if (!resolved) return;
		if (seen.has(`${kind}:${publicName}`)) return;
		seen.add(`${kind}:${publicName}`);
		target.push({ ...resolved, name: publicName });
	});
}

function resolveBaseClass(
	cls: ClassDeclaration,
	classRegistry: Map<string, ClassDeclaration>,
): ClassDeclaration | undefined {
	// Try the type-checker first (works when the base class is in the same file
	// or resolvable without path aliases).
	const resolved = cls.getBaseClass();
	if (resolved) {
		return resolved;
	}

	// Fall back to resolving by the written name of the `extends` expression,
	// stripping any generic type arguments (e.g. `BrnDialog<T>` -> `BrnDialog`).
	const extendsExpr = cls.getExtends();
	if (!extendsExpr) {
		return undefined;
	}
	const baseName = extendsExpr.getExpression().getText().replace(/<.*>$/s, '').trim();
	return classRegistry.get(baseName);
}

function collectMembers(cls: ClassDeclaration, componentInfo, seen: Set<string>) {
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
				if (seen.has(`input:${name}`)) return;
				seen.add(`input:${name}`);
				componentInfo.inputs.push({ name, type, description, defaultValue, required: false });
			} else {
				if (seen.has(`output:${name}`)) return;
				seen.add(`output:${name}`);
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
					// Options object is the first arg for `input.required(opts)` and the
					// last arg for `input(default, opts)`.
					const optionsArg = required ? callArgs[0] : callArgs.length > 1 ? callArgs[callArgs.length - 1] : undefined;
					if (optionsArg instanceof ObjectLiteralExpression) {
						const aliasProp = optionsArg.getProperty('alias');
						if (aliasProp instanceof PropertyAssignment) {
							const aliasValue = aliasProp.getInitializer().getText().replace(/['"]/g, '');
							if (aliasValue) inputName = aliasValue;
						}
					}
					if (seen.has(`input:${inputName}`)) return;
					seen.add(`input:${inputName}`);
					componentInfo.inputs.push({ name: inputName, type: inferredType, description, defaultValue, required });
				} else if (exprText === 'output') {
					let outputName = name;
					// `output(opts)` takes its options (incl. alias) as the first arg.
					const optionsArg = callArgs[0];
					if (optionsArg instanceof ObjectLiteralExpression) {
						const aliasProp = optionsArg.getProperty('alias');
						if (aliasProp instanceof PropertyAssignment) {
							const aliasValue = aliasProp.getInitializer().getText().replace(/['"]/g, '');
							if (aliasValue) outputName = aliasValue;
						}
					}
					if (seen.has(`output:${outputName}`)) return;
					seen.add(`output:${outputName}`);
					componentInfo.outputs.push({ name: outputName, type: inferredType, description });
				} else if (exprText === 'model') {
					if (seen.has(`model:${name}`)) return;
					seen.add(`model:${name}`);
					componentInfo.models.push({ name, type: inferredType, description, defaultValue });
				}
			}
		}
	});
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
