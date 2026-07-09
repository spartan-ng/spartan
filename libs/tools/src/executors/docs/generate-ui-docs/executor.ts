import type { ExecutorContext } from '@nx/devkit';
import fs from 'fs';
import path from 'path';
import type { ClassDeclaration, Decorator } from 'ts-morph';
import {
	ArrayLiteralExpression,
	CallExpression,
	Node,
	ObjectLiteralExpression,
	Project,
	PropertyAssignment,
} from 'ts-morph';
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

	// Load the workspace tsconfig so `@spartan-ng/*` imports resolve via its `paths` map.
	const project = new Project({
		tsConfigFilePath: path.join(context.root, 'tsconfig.base.json'),
		skipAddingFilesFromTsConfig: true,
	});
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

export function extractInputsOutputs(project: Project, workspaceRoot: string) {
	const inputsOutputs: NestedStructure = {};

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
			const componentInfo: ComponentInfo = {
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
			collectAllMembers(cls, componentInfo, seenMembers);

			// Collect inputs and outputs exposed through `hostDirectives`, applying the
			// renaming declared in the decorator (e.g. 'brnTabsContent: hlmTabsContent').
			collectHostDirectiveMembers(cls, componentInfo, seenMembers);

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

export interface Member {
	name: string;
	type: string;
	description: string;
	defaultValue?: string | null;
	required?: boolean;
}

export interface MemberCollection {
	inputs: Member[];
	outputs: Member[];
	models: Member[];
}

export interface ComponentInfo extends MemberCollection {
	file: string;
	selector?: string | null;
	exportAs?: string | null;
}

export type NestedStructure = Record<string, Record<string, Record<string, ComponentInfo>>>;

function collectAllMembers(cls: ClassDeclaration, componentInfo: MemberCollection, seen: Set<string>) {
	const visitedClasses = new Set<ClassDeclaration>();
	let currentClass: ClassDeclaration | undefined = cls;
	while (currentClass && !visitedClasses.has(currentClass)) {
		visitedClasses.add(currentClass);
		collectMembers(currentClass, componentInfo, seen);
		currentClass = currentClass.getBaseClass();
	}
}

function collectHostDirectiveMembers(cls: ClassDeclaration, componentInfo: MemberCollection, seen: Set<string>) {
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

		const directiveClass = resolveClass(directiveProp.getInitializer());
		if (!directiveClass) return;

		// Resolve the referenced directive's members (including inherited ones) so the
		// exposed mappings can be matched by their public name.
		const directiveInfo: MemberCollection = { inputs: [], outputs: [], models: [] };
		collectAllMembers(directiveClass, directiveInfo, new Set<string>());

		// A signal `model()` is exposed as an input plus a `<name>Change` output.
		const inputCandidates = [...directiveInfo.inputs, ...directiveInfo.models];
		const outputCandidates = [
			...directiveInfo.outputs,
			...directiveInfo.models.map((model) => ({
				name: `${model.name}Change`,
				type: model.type,
				description: model.description,
			})),
		];

		mapHostDirectiveMembers(element.getProperty('inputs'), inputCandidates, 'input', seen, componentInfo.inputs);
		mapHostDirectiveMembers(element.getProperty('outputs'), outputCandidates, 'output', seen, componentInfo.outputs);
	});
}

function mapHostDirectiveMembers(
	memberProp: Node | undefined,
	directiveMembers: Member[],
	kind: 'input' | 'output',
	seen: Set<string>,
	target: Member[],
) {
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

function resolveClass(expr: Node | undefined): ClassDeclaration | undefined {
	const declaration = expr
		?.getType()
		.getSymbol()
		?.getDeclarations()
		.find((decl): decl is ClassDeclaration => Node.isClassDeclaration(decl));
	return declaration;
}

function readAliasFromOptions(optionsArg: Node | undefined): string | undefined {
	if (optionsArg instanceof ObjectLiteralExpression) {
		const aliasProp = optionsArg.getProperty('alias');
		if (aliasProp instanceof PropertyAssignment) {
			const aliasValue = aliasProp.getInitializer()?.getText().replace(/['"]/g, '');
			if (aliasValue) return aliasValue;
		}
	}
	return undefined;
}

function readDecoratorAlias(decorator: Decorator): string | undefined {
	const args = decorator.getArguments();
	if (!args.length) return undefined;
	const firstArg = args[0];
	// `@Input({ alias: 'publicAlias' })` / `@Output({ alias: 'publicAlias' })`
	if (firstArg instanceof ObjectLiteralExpression) {
		return readAliasFromOptions(firstArg);
	}
	// `@Input('publicAlias')` / `@Output('publicAlias')`
	const text = firstArg.getText();
	if (/^['"`]/.test(text)) {
		return text.replace(/['"`]/g, '').trim() || undefined;
	}
	return undefined;
}

function collectMembers(cls: ClassDeclaration, componentInfo: MemberCollection, seen: Set<string>) {
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
			// Angular exposes the member under its binding alias when one is given.
			const publicName = readDecoratorAlias(decorator) ?? name;
			if (decorator.getName() === 'Input') {
				if (seen.has(`input:${publicName}`)) return;
				seen.add(`input:${publicName}`);
				componentInfo.inputs.push({ name: publicName, type, description, defaultValue: null, required: false });
			} else {
				if (seen.has(`output:${publicName}`)) return;
				seen.add(`output:${publicName}`);
				componentInfo.outputs.push({ name: publicName, type, description });
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

				const isInputRequired = exprText === 'input.required';
				const isModelRequired = exprText === 'model.required';
				const isRequired = isInputRequired || isModelRequired;

				const callArgs = callExpr.getArguments();

				// Only the plain `input`/`model` forms carry a default; the `*.required`
				// forms take their options object as the first argument instead. Keep the
				// default exactly as written so strings stay quoted and expressions intact.
				const hasDefault = !isRequired && (exprText === 'input' || exprText === 'model') && callArgs.length > 0;
				const defaultValue = hasDefault ? callArgs[0].getText() : null;

				// Options object is the first arg for the `*.required(opts)` forms and the
				// last arg for the `input(default, opts)` / `model(default, opts)` forms.
				const optionsArg = isRequired ? callArgs[0] : callArgs.length > 1 ? callArgs[callArgs.length - 1] : undefined;

				if (exprText === 'input' || isInputRequired) {
					const inputName = readAliasFromOptions(optionsArg) ?? name;
					if (seen.has(`input:${inputName}`)) return;
					seen.add(`input:${inputName}`);
					componentInfo.inputs.push({
						name: inputName,
						type: inferredType,
						description,
						defaultValue,
						required: isInputRequired,
					});
				} else if (exprText === 'output') {
					// `output(opts)` takes its options (incl. alias) as the first arg.
					const outputName = readAliasFromOptions(callArgs[0]) ?? name;
					if (seen.has(`output:${outputName}`)) return;
					seen.add(`output:${outputName}`);
					componentInfo.outputs.push({ name: outputName, type: inferredType, description });
				} else if (exprText === 'model' || isModelRequired) {
					const modelName = readAliasFromOptions(optionsArg) ?? name;
					if (seen.has(`model:${modelName}`)) return;
					seen.add(`model:${modelName}`);
					componentInfo.models.push({
						name: modelName,
						type: inferredType,
						description,
						defaultValue,
						required: isModelRequired,
					});
				}
			}
		}
	});
}

function addToNestedStructure(
	rootObject: NestedStructure,
	relativeFilePath: string,
	className: string | undefined,
	componentInfo: ComponentInfo,
) {
	if (!className) return;

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
