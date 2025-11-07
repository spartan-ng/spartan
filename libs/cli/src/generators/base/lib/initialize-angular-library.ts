import { UnitTestRunner } from '@nx/angular/generators';
import type { Schema } from '@nx/angular/src/generators/library/schema';
import { type Tree, joinPathFragments, readNxJson, updateJson } from '@nx/devkit';
import * as path from 'path';
import { type ObjectLiteralExpression, Project, SyntaxKind } from 'ts-morph';
import type { HlmBaseGeneratorSchema } from '../schema';
import { singleLibName } from './single-lib-name';

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
		'"@nx/enforce-module-boundaries"': `
		(() => {
  const r = baseConfig.find(c => c.rules && c.rules["@nx/enforce-module-boundaries"])?.rules["@nx/enforce-module-boundaries"];
  return r ? [r[0], { ...r[1], allowCircularSelfDependency: true }] : undefined;
})()
		`,
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

function cleanupSingleLibFolder(tree: Tree, dir: string) {
	// delete everything in the src directory except the index.ts file
	const srcDir = joinPathFragments(dir, 'src');
	const files = tree.children(srcDir).filter((file) => file !== 'index.ts');
	for (const file of files) {
		const filePath = joinPathFragments(srcDir, file);
		if (tree.exists(filePath)) {
			tree.delete(filePath);
		}
	}

	// replace the content of the index.ts with "export default null;"
	const indexPath = joinPathFragments(srcDir, 'index.ts');
	if (tree.exists(indexPath)) {
		tree.write(
			indexPath,
			'// This file is intentionally left empty. Import from the respective entrypoint.\nexport default null;',
		);
	}
}

const defaultSchema: Partial<Schema> = {
	skipFormat: true,
	simpleName: true,
	prefix: 'hlm',
	skipModule: true,
	skipTests: true,
	strict: true,
	unitTestRunner: UnitTestRunner.None,
};

export async function initializeAngularEntrypoint(
	tree: Tree,
	options: Pick<HlmBaseGeneratorSchema, 'directory' | 'buildable' | 'tags' | 'importAlias'>,
) {
	const { libraryGenerator } = await import('@nx/angular/generators');
	const dir = joinPathFragments(options.directory);
	const callback = await libraryGenerator(tree, {
		...(readNxJson(tree).generators?.['@nx/angular:library'] || {}),
		...defaultSchema,
		flat: true,
		name: singleLibName,
		buildable: options.buildable,
		importPath: options.importAlias,
		directory: dir,
		tags: options.tags,
	});

	cleanupSingleLibFolder(tree, dir);
	addRules(tree, dir);

	updateJson(tree, joinPathFragments(dir, 'tsconfig.lib.json'), (json) => {
		const include = json.include || [];
		if (!include.includes('**/*.ts')) {
			include.push('**/*.ts');
		}
		json.include = include;
		return json;
	});

	return callback;
}

export async function initializeAngularLibrary(tree: Tree, options: HlmBaseGeneratorSchema) {
	const { libraryGenerator } = await import('@nx/angular/generators');

	const dir = joinPathFragments(options.directory, options.name);

	const callback = await libraryGenerator(tree, {
		...(readNxJson(tree).generators?.['@nx/angular:library'] || {}),
		...defaultSchema,
		name: options.name,
		buildable: options.buildable,
		importPath: `${options.importAlias}/${options.name}`,
		directory: dir,
		tags: options.tags,
	});

	addRules(tree, dir);

	return callback;
}
