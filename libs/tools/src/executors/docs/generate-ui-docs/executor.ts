import type { ExecutorContext } from '@nx/devkit';
import fs from 'fs';
import path from 'path';
import type { ClassDeclaration, Decorator, Node, SourceFile } from 'ts-morph';
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

	// Build a registry of every class by name so we can resolve base classes and
	// host directives even when they are imported via TS path aliases (which the
	// type checker can't resolve without a tsconfig). Multiple classes may share a
	// name across packages, so we keep a list per name and disambiguate later.
	const classRegistry = new Map<string, ClassDeclaration[]>();
	project.getSourceFiles().forEach((sourceFile) => {
		sourceFile.getClasses().forEach((cls) => {
			const name = cls.getName();
			if (!name) return;
			const existing = classRegistry.get(name);
			if (existing) {
				existing.push(cls);
			} else {
				classRegistry.set(name, [cls]);
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
	classRegistry: Map<string, ClassDeclaration[]>,
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
	classRegistry: Map<string, ClassDeclaration[]>,
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
		const directiveClass = resolveClassByName(directiveName, cls.getSourceFile(), classRegistry);
		if (!directiveClass) return;

		// Resolve the referenced directive's members (including inherited ones) so the
		// exposed mappings can be matched by their public name.
		const directiveInfo = { inputs: [], outputs: [], models: [] };
		collectAllMembers(directiveClass, directiveInfo, classRegistry, new Set<string>());

		// A signal `model()` is exposed as an input plus a `<name>Change` output, so
		// include models as candidates for both the input and output mappings.
		const inputCandidates = [
			...directiveInfo.inputs,
			...directiveInfo.models.map((model) => ({
				name: model.name,
				type: model.type,
				description: model.description,
				defaultValue: model.defaultValue,
				required: model.required,
			})),
		];
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
	classRegistry: Map<string, ClassDeclaration[]>,
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
	return resolveClassByName(baseName, cls.getSourceFile(), classRegistry);
}

function resolveClassByName(
	name: string,
	fromSourceFile: SourceFile,
	classRegistry: Map<string, ClassDeclaration[]>,
): ClassDeclaration | undefined {
	const candidates = classRegistry.get(name);
	if (!candidates || candidates.length === 0) {
		return undefined;
	}
	if (candidates.length === 1) {
		return candidates[0];
	}

	// Multiple classes share this name; disambiguate using the import declaration
	// in the referencing file so inheritance/host-directive lookups don't silently
	// resolve to the wrong package.
	const importDecl = fromSourceFile
		.getImportDeclarations()
		.find((imp) =>
			imp.getNamedImports().some((named) => (named.getAliasNode()?.getText() ?? named.getName()) === name),
		);
	if (importDecl) {
		// Prefer the file the module resolver points to (works for relative imports).
		const resolvedSourceFile = importDecl.getModuleSpecifierSourceFile();
		if (resolvedSourceFile) {
			const match = candidates.find((candidate) => candidate.getSourceFile() === resolvedSourceFile);
			if (match) return match;
		}
		// Otherwise match the module specifier tail against candidate file paths,
		// e.g. '@spartan-ng/brain/dialog' -> a file under '.../brain/dialog/...'.
		const specifierTail = importDecl
			.getModuleSpecifierValue()
			.replace(/^@[^/]+\//, '')
			.replace(/^[./]+/, '');
		if (specifierTail) {
			const match = candidates.find((candidate) =>
				candidate.getSourceFile().getFilePath().includes(`/${specifierTail}`),
			);
			if (match) return match;
		}
	}

	return candidates[0];
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

				// Extract the default value from signal-based input/model. The `*.required`
				// forms take their options object as the first argument, so they have none.
				let defaultValue = null;
				if (!isRequired && (exprText === 'input' || exprText === 'model') && callArgs.length > 0) {
					const argText = callArgs[0].getText();
					const match = argText.match(/\(([^()]*)\)$/);
					if (match && match[1]) {
						defaultValue = match[1].replace(/['"]/g, '');
					} else {
						defaultValue = argText.replace(/['"]/g, '');
					}
				}

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
