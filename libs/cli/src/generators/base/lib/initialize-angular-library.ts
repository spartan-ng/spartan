import { UnitTestRunner } from '@nx/angular/generators';
import { type Tree, joinPathFragments, readNxJson } from '@nx/devkit';
import * as path from 'path';
import { ObjectLiteralExpression, Project, SyntaxKind } from 'ts-morph';
import type { HlmBaseGeneratorSchema } from '../schema';

function addRulesToEslintOverride(tree: Tree, libRoot: string, filePattern: string, newRules: Record<string, string>) {
	const eslintPath = joinPathFragments(libRoot, 'eslint.config.mjs');
	if (!tree.exists(eslintPath)) return;

	const eslintFullPath = path.join(process.cwd(), eslintPath);

	const project = new Project({
		tsConfigFilePath: path.join(process.cwd(), 'tsconfig.base.json'),
		skipAddingFilesFromTsConfig: true,
	});

	const sourceFile = project.createSourceFile(eslintFullPath, tree.read(eslintPath, 'utf-8')!, { overwrite: true });

	const exportArray = sourceFile.getFirstDescendantByKind(SyntaxKind.ArrayLiteralExpression);
	if (!exportArray) return;

	const overrideObj = exportArray.getElements().find((el) => {
		if (!el || !el.isKind(SyntaxKind.ObjectLiteralExpression)) return false;
		const obj = el as ObjectLiteralExpression;
		const filesProp = obj.getProperty('files');
		return filesProp?.getText().includes(filePattern);
	}) as ObjectLiteralExpression | undefined;

	if (!overrideObj) return;

	let rulesProp = overrideObj.getProperty('rules');
	if (!rulesProp) {
		overrideObj.addPropertyAssignment({ name: 'rules', initializer: '{}' });
		rulesProp = overrideObj.getPropertyOrThrow('rules');
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const rulesObj = (rulesProp as any).getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

	for (const [ruleName, ruleValue] of Object.entries(newRules)) {
		if (!rulesObj.getProperty(ruleName)) {
			rulesObj.addPropertyAssignment({
				name: ruleName,
				initializer: ruleValue,
			});
		}
	}

	tree.write(eslintPath, sourceFile.getFullText());
}

/**
 * Add TypeScript rules to ESLint flat config
 */
function addTsRules(tree: Tree, libRoot: string) {
	addRulesToEslintOverride(tree, libRoot, '"**/*.ts"', {
		'"@angular-eslint/no-input-rename"': '"off"',
		'"@angular-eslint/directive-class-suffix"': '"off"',
		'"@angular-eslint/component-class-suffix"': '"off"',
		'"@typescript-eslint/naming-convention"': `[
			"error",
			{
				"selector": "classProperty",
				"modifiers": ["protected"],
				"format": ["camelCase"],
				"leadingUnderscore": "require"
			}
		]`,
	});
}

/**
 * Add HTML template rules to ESLint flat config
 */
function addHtmlRules(tree: Tree, libRoot: string) {
	addRulesToEslintOverride(tree, libRoot, '"**/*.html"', {
		'"@angular-eslint/template/interactive-supports-focus"': '"off"',
		'"@angular-eslint/template/click-events-have-key-events"': '"off"',
	});
}

function addRules(tree: Tree, libRoot: string) {
	addTsRules(tree, libRoot);
	addHtmlRules(tree, libRoot);
}

export async function initializeAngularLibrary(tree: Tree, options: HlmBaseGeneratorSchema) {
	const { libraryGenerator } = await import('@nx/angular/generators');

	const callback = await libraryGenerator(tree, {
		...(readNxJson(tree).generators?.['@nx/angular:library'] || {}),
		name: options.publicName,
		skipFormat: true,
		simpleName: true,
		buildable: true,
		importPath: `@spartan-ng/helm/${options.primitiveName}`,
		prefix: 'hlm',
		skipModule: true,
		directory: joinPathFragments(options.directory, options.publicName),
		tags: options.tags,
		skipTests: true,
		unitTestRunner: UnitTestRunner.None,
	});

	addRules(tree, joinPathFragments(options.directory, options.publicName));

	return callback;
}
