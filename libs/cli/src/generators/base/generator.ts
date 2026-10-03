import {
	addDependenciesToPackageJson,
	generateFiles,
	type GeneratorCallback,
	joinPathFragments,
	runTasksInSerial,
	type Tree,
	updateJson,
	visitNotIgnoredFiles,
} from '@nx/devkit';
import { addTsConfigPath, getRootTsConfigPathInTree } from '@nx/js';
import * as path from 'node:path';

import { readTsConfigPathsFromTree } from '../../utils/tsconfig';
import { getInstalledPackageVersion } from '../../utils/version-utils';
import { buildDependencyArray, buildDevDependencyArray } from './lib/build-dependency-array';
import { deleteFiles } from './lib/deleteFiles';
import { getTargetLibraryDirectory } from './lib/get-target-library-directory';
import { initializeAngularLibrary } from './lib/initialize-angular-library';
import { filterUnregisteredDependencies } from './lib/package-json-dependencies';

import { librarySecondaryEntryPointGenerator } from '@nx/angular/generators';

import { promises as fsPromises } from 'fs';
import type { RegistryItem } from '../../registry';
import { renderSpartanTemplateTokens, targetPathForRegistryFile } from '../../registry';
import type { Style } from '../../utils/supported-styles';
import { singleLibName } from './lib/single-lib-name';
import { createStyleMap } from './lib/styles/create-style-map';
import { transformStyle } from './lib/styles/transform';
import type { HlmBaseGeneratorSchema } from './schema';
import { FALLBACK_ANGULAR_CDK_VERSION } from './versions';

const styleMapCache = new Map<Style, Record<string, string>>();

const STYLE_FILE_CANDIDATES = [
	'src/styles.css',
	'src/styles.scss',
	'src/styles.less',
	'src/tailwind.css',
	'src/global.css',
	'styles.css',
];

const TAILWIND_JSON_CONFIG_CANDIDATES = ['tailwind.config.json'];

export async function getStyleMap(style: Style) {
	if (styleMapCache.has(style)) {
		return styleMapCache.get(style)!;
	}
	try {
		const cssPaths = [
			path.join(__dirname, '..', 'ui', `style-${style}.css`),
			path.join(__dirname, '..', '..', '..', '..', 'registry', 'src', 'styles', `style-${style}.css`),
		];
		let cssPath: string | null = null;
		for (const candidate of cssPaths) {
			try {
				await fsPromises.access(candidate);
				cssPath = candidate;
				break;
			} catch {
				// Try the next built/source asset location.
			}
		}
		if (!cssPath) {
			return {};
		}
		const css = await fsPromises.readFile(cssPath, 'utf-8');
		const styleMap = createStyleMap(css);
		styleMapCache.set(style, styleMap);
		return styleMap;
	} catch {
		return {};
	}
}

async function getStyleMapForRegistryItem(item: RegistryItem, style: Style) {
	return item.styleMaps?.[style] ?? (await getStyleMap(style));
}

function detectStyleFile(tree: Tree): string | null {
	return STYLE_FILE_CANDIDATES.find((candidate) => tree.exists(candidate)) ?? null;
}

function setMarkedBlock(content: string, marker: string, block: string) {
	const start = `/* spartan-registry:${marker}:start */`;
	const end = `/* spartan-registry:${marker}:end */`;
	const nextBlock = `${start}\n${block.trim()}\n${end}`;
	const pattern = new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`);

	if (pattern.test(content)) {
		return content.replace(pattern, nextBlock);
	}

	return `${content.trimEnd()}\n\n${nextBlock}\n`;
}

function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function serializeCssVars(cssVars: NonNullable<RegistryItem['cssVars']>) {
	const blocks: string[] = [];

	if (cssVars.theme && Object.keys(cssVars.theme).length) {
		blocks.push(`@theme {\n${serializeDeclarations(cssVars.theme)}\n}`);
	}

	if (cssVars.light && Object.keys(cssVars.light).length) {
		blocks.push(`:root {\n${serializeCssCustomProperties(cssVars.light)}\n}`);
	}

	if (cssVars.dark && Object.keys(cssVars.dark).length) {
		blocks.push(`.dark {\n${serializeCssCustomProperties(cssVars.dark)}\n}`);
	}

	return blocks.join('\n\n');
}

function serializeCssCustomProperties(values: Record<string, string>) {
	return Object.entries(values)
		.map(([key, value]) => `\t${key.startsWith('--') ? key : `--${key}`}: ${value};`)
		.join('\n');
}

function serializeDeclarations(values: Record<string, string>) {
	return Object.entries(values)
		.map(([key, value]) => `\t${key}: ${value};`)
		.join('\n');
}

function serializeCss(css: NonNullable<RegistryItem['css']>) {
	return Object.entries(css)
		.map(([selector, value]) => serializeCssRule(selector, value))
		.filter(Boolean)
		.join('\n\n');
}

function serializeCssRule(selector: string, value: unknown, indent = ''): string {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return '';
	}

	const declarations: string[] = [];
	const nested: string[] = [];

	for (const [key, childValue] of Object.entries(value)) {
		if (typeof childValue === 'string') {
			declarations.push(`${indent}\t${key}: ${childValue};`);
			continue;
		}

		if (Array.isArray(childValue)) {
			declarations.push(
				`${indent}\t${key}: ${childValue.map((entry) => (typeof entry === 'string' ? entry : '')).join(' ')};`,
			);
			continue;
		}

		if (childValue && typeof childValue === 'object') {
			if (key.startsWith('@')) {
				const nestedRule = serializeCssRule(selector, childValue, `${indent}\t`);
				if (nestedRule) {
					nested.push(`${indent}${key} {\n${nestedRule}\n${indent}}`);
				}
				continue;
			}

			nested.push(
				serializeCssRule(key.includes('&') ? key.replaceAll('&', selector) : `${selector} ${key}`, childValue, indent),
			);
		}
	}

	const rule = declarations.length ? `${indent}${selector} {\n${declarations.join('\n')}\n${indent}}` : '';
	return [rule, ...nested].filter(Boolean).join('\n\n');
}

function applyRegistryStylesToStylesheet(tree: Tree, item: RegistryItem) {
	if (!item.cssVars && !item.css) {
		return;
	}

	const styleFile = detectStyleFile(tree);
	if (!styleFile) {
		return;
	}

	let content = tree.read(styleFile, 'utf-8') ?? '';

	if (item.cssVars) {
		const cssVars = serializeCssVars(item.cssVars);
		if (cssVars) {
			content = setMarkedBlock(content, `${item.name}:css-vars`, cssVars);
		}
	}

	if (item.css) {
		const css = serializeCss(item.css);
		if (css) {
			content = setMarkedBlock(content, `${item.name}:css`, css);
		}
	}

	tree.write(styleFile, content);
}

function mergeObjects(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
	for (const [key, value] of Object.entries(source)) {
		if (
			value &&
			typeof value === 'object' &&
			!Array.isArray(value) &&
			target[key] &&
			typeof target[key] === 'object' &&
			!Array.isArray(target[key])
		) {
			target[key] = mergeObjects(target[key] as Record<string, unknown>, value as Record<string, unknown>);
		} else {
			target[key] = value;
		}
	}
	return target;
}

function applyRegistryTailwindConfig(tree: Tree, item: RegistryItem) {
	const config = item.tailwind?.config;
	if (!config) {
		return;
	}

	const configPath = TAILWIND_JSON_CONFIG_CANDIDATES.find((candidate) => tree.exists(candidate));
	if (!configPath) {
		return;
	}

	updateJson(tree, configPath, (json) => mergeObjects(json, config as Record<string, unknown>));
}

function applyRegistryGlobalStyles(tree: Tree, item: RegistryItem) {
	applyRegistryStylesToStylesheet(tree, item);
	applyRegistryTailwindConfig(tree, item);
}

export function isAlreadyInstalled(tree: Tree, alias: string): boolean {
	const existingPaths = readTsConfigPathsFromTree(tree);
	return alias in existingPaths;
}

export function setupAngularCliProject(tree: Tree, alias: string, targetLibDir: string) {
	addTsConfigPath(tree, alias, [`./${joinPathFragments(targetLibDir, 'src', 'index.ts').replace(/\\/g, '/')}`]);

	// The generated libraries live outside the app's `src`, so they aren't covered by tsconfig.app.json's
	// default `src/**/*.ts` include. The app still *builds* (the Angular builder follows the path-mapped
	// imports into the libs), but the TS language server treats the generated files as orphans compiled
	// without the root `paths`, so cross-lib imports (`@spartan-ng/helm/utils`, ...) show as "cannot find
	// module" in the editor. Add the generated component source dirs to the include so the files belong to
	// the app project and resolve in-editor, without pulling specs/stories/helpers under the components dir
	// into the app program.
	const componentsBaseDir = path.posix.dirname(targetLibDir.replace(/\\/g, '/'));
	ensureAppTsConfigIncludes(tree, `${componentsBaseDir}/**/src/**/*.ts`);
}

// Adds `glob` to the Angular CLI app's tsconfig.app.json `include` (idempotent). Targets tsconfig.app.json
// by convention - the default build/typecheck tsconfig for an `ng new` app; a non-standard app tsconfig is
// left untouched (the spartan angular-cli flow assumes the default layout).
function ensureAppTsConfigIncludes(tree: Tree, glob: string) {
	const tsConfigAppPath = 'tsconfig.app.json';
	if (!tree.exists(tsConfigAppPath)) {
		return;
	}
	updateJson(tree, tsConfigAppPath, (json) => {
		if (!Array.isArray(json.include)) {
			// With no `include`, TypeScript implicitly compiles every `.ts` under the config dir. Seeding the
			// array with just our glob would silently replace that with "only the generated libs", dropping the
			// app's own `src` from the editor program. Preserve the implicit `src` coverage before appending.
			json.include = ['src/**/*.ts'];
		}
		if (!json.include.includes(glob)) {
			json.include.push(glob);
		}
		return json;
	});
}

// nx's `librarySecondaryEntryPointGenerator` appends an entrypoint-prefixed copy of every existing
// include/exclude glob each time it runs (see `updateTsConfigIncludedFiles`). When many entrypoints
// are generated into the same library - e.g. `migrate-helm-libraries` (or `ui`) with "all" selected -
// these arrays double on every call until `JSON.stringify` throws `RangeError: Invalid string length`.
//
// The library already includes a recursive `**/*.ts` glob, which matches files in every entrypoint
// subdirectory, so the prefixed copies are redundant. This collapses them back to a bounded, equivalent
// set of recursive globs. It is idempotent, so it stays bounded no matter how many entrypoints are added.
// Collapses the entrypoint-prefixed globs nx accumulates back into their recursive equivalents, keeping
// `tsconfig.lib.json` bounded. For each glob in `recursiveGlobs` (e.g. `**/*.ts`), any "scoped variant"
// that it already covers - the recursive glob itself, or a sub-path form like `accordion/src/**/*.ts`
// that ends in the same `*.ext` suffix - is dropped, and the single recursive glob is restored *only if*
// such a variant was present. Patterns that aren't a scoped variant (literal files like `jest.config.ts`,
// a root-only `*.ts`, or a custom glob) are preserved untouched, and no recursive glob is injected unless
// it was already represented - so the function never widens or adds globs the tsconfig didn't already imply.
export function dedupeEntrypointGlobs(patterns: string[], recursiveGlobs: string[]): string[] {
	// The suffix each recursive glob covers in every subdirectory, e.g. '**/*.ts' -> '*.ts'.
	const suffixes = recursiveGlobs.map((glob) => glob.replace(/^\*\*\//, ''));
	const variantSeen = recursiveGlobs.map(() => false);
	// A pattern is a scoped variant of recursiveGlobs[i] only if it is that glob itself, or a recursive
	// sub-path glob (contains `/**/` and ends in `/<suffix>`) - exactly the shape nx prepends per entry
	// point, e.g. `accordion/src/**/*.ts`. A flat `*.ts` or a custom `tools/*.ts` is NOT a variant and is
	// left untouched, so user globs are never widened or dropped.
	const variantIndex = (pattern: string) =>
		recursiveGlobs.findIndex(
			(recursive, i) => pattern === recursive || (pattern.includes('/**/') && pattern.endsWith(`/${suffixes[i]}`)),
		);

	const result = patterns.filter((pattern) => {
		const index = variantIndex(pattern);
		if (index === -1) {
			return true; // unrelated glob - keep as-is
		}
		variantSeen[index] = true;
		return false; // redundant scoped variant - drop it
	});
	recursiveGlobs.forEach((glob, i) => {
		if (variantSeen[i]) {
			result.push(glob);
		}
	});
	return result;
}

// Targets `tsconfig.lib.json` by convention: that's the file `initializeAngularEntrypoint` seeds and the
// default build tsConfig for an @nx/angular library, which is also the file nx's secondary-entrypoint
// generator inflates. A library whose build target points its tsConfig elsewhere isn't normalized here,
// but the spartan generators never produce that shape.
export function normalizeEntrypointTsConfig(tree: Tree, libraryDir: string): void {
	const tsConfigLibPath = joinPathFragments(libraryDir, 'tsconfig.lib.json');
	if (!tree.exists(tsConfigLibPath)) {
		return;
	}
	updateJson(tree, tsConfigLibPath, (json) => {
		if (Array.isArray(json.include)) {
			json.include = dedupeEntrypointGlobs(json.include, ['**/*.ts']);
		}
		if (Array.isArray(json.exclude)) {
			json.exclude = dedupeEntrypointGlobs(json.exclude, ['**/*.spec.ts', '**/*.test.ts']);
		}
		return json;
	});
}

async function generateEntrypointFiles(tree: Tree, alias: string, options: HlmBaseGeneratorSchema): Promise<string> {
	const targetLibDir = `${options.directory}/${options.name}/src`;

	if (options.buildable) {
		// Normalize before *and* after: if tsconfig.lib.json is already bloated from an earlier run, the
		// nx generator would re-double the existing arrays and could throw "Invalid string length" before
		// the post-call cleanup runs. Pre-normalizing makes a dirty workspace recover deterministically.
		normalizeEntrypointTsConfig(tree, options.directory);
		await librarySecondaryEntryPointGenerator(tree, {
			name: options.name,
			library: singleLibName,
			skipFormat: true,
			skipModule: true,
		});
		// Collapse the redundant entrypoint-prefixed globs nx just appended so the include/exclude
		// arrays stay bounded as more entrypoints are added. See `dedupeEntrypointGlobs`.
		normalizeEntrypointTsConfig(tree, options.directory);
	} else {
		// Resolve the workspace's root tsconfig rather than assuming tsconfig.base.json - a standalone nx
		// workspace registers paths in tsconfig.json (there is no base file).
		updateJson(tree, getRootTsConfigPathInTree(tree), (json) => {
			json.compilerOptions ||= {};
			json.compilerOptions.paths ||= {};
			json.compilerOptions.paths[alias] = [`./${joinPathFragments(targetLibDir, 'index.ts').replace(/\\/g, '/')}`];
			return json;
		});
	}
	generateFiles(tree, path.join(__dirname, '..', 'ui', 'libs', options.name, 'files'), targetLibDir, options);
	return targetLibDir;
}

function generateLibraryFiles(tree: Tree, targetLibDir: string, options: HlmBaseGeneratorSchema) {
	const deletePath = joinPathFragments(options.directory, options.name, 'src', 'lib', options.name);
	deleteFiles(tree, deletePath);

	generateFiles(
		tree,
		path.join(__dirname, '..', 'ui', 'libs', options.name, 'files'),
		joinPathFragments(targetLibDir, 'src'),
		options,
	);
}

function registerDependencies(tree: Tree, options: HlmBaseGeneratorSchema): GeneratorCallback | undefined {
	const cdkVersion = getInstalledPackageVersion(tree, '@angular/cdk', FALLBACK_ANGULAR_CDK_VERSION, true);
	const { dependencies, devDependencies } = filterUnregisteredDependencies(
		tree,
		buildDependencyArray(tree, options, cdkVersion),
		buildDevDependencyArray(),
	);
	if (Object.keys(dependencies).length === 0 && Object.keys(devDependencies).length === 0) {
		return undefined;
	}
	return addDependenciesToPackageJson(tree, dependencies, devDependencies);
}

function registerRegistryDependencies(
	tree: Tree,
	options: HlmBaseGeneratorSchema,
	item: Pick<RegistryItem, 'dependencies' | 'devDependencies'>,
): GeneratorCallback {
	const parseDependency = (dependency: string): [string, string] => {
		const atIndex = dependency.startsWith('@') ? dependency.indexOf('@', 1) : dependency.indexOf('@');
		if (atIndex > 0) {
			return [dependency.slice(0, atIndex), dependency.slice(atIndex + 1)];
		}
		return [dependency, 'latest'];
	};
	const cdkVersion = getInstalledPackageVersion(tree, '@angular/cdk', FALLBACK_ANGULAR_CDK_VERSION, true);
	const dependencies = buildDependencyArray(
		tree,
		{
			...options,
			peerDependencies: Object.fromEntries((item.dependencies ?? []).map(parseDependency)),
		},
		cdkVersion,
	);
	const devDependencies = {
		...buildDevDependencyArray(),
		...Object.fromEntries((item.devDependencies ?? []).map(parseDependency)),
	};
	return addDependenciesToPackageJson(tree, dependencies, devDependencies);
}

async function createRegistryEntrypointScaffold(
	tree: Tree,
	alias: string,
	options: HlmBaseGeneratorSchema,
): Promise<string> {
	const targetLibDir = `${options.directory}/${options.name}/src`;

	if (options.buildable) {
		normalizeEntrypointTsConfig(tree, options.directory!);
		await librarySecondaryEntryPointGenerator(tree, {
			name: options.name,
			library: singleLibName,
			skipFormat: true,
			skipModule: true,
		});
		normalizeEntrypointTsConfig(tree, options.directory!);
	} else {
		updateJson(tree, getRootTsConfigPathInTree(tree), (json) => {
			json.compilerOptions ||= {};
			json.compilerOptions.paths ||= {};
			json.compilerOptions.paths[alias] = [`./${joinPathFragments(targetLibDir, 'index.ts').replace(/\\/g, '/')}`];
			return json;
		});
	}

	return targetLibDir;
}

function writeRegistryItemFiles(tree: Tree, filesPath: string, item: RegistryItem, options: HlmBaseGeneratorSchema) {
	for (const file of item.files ?? []) {
		if (!file.content) {
			continue;
		}

		const targetPath = joinPathFragments(filesPath, targetPathForRegistryFile(file, options.name));
		if (!options.overwrite && tree.exists(targetPath)) {
			continue;
		}

		const content = renderSpartanTemplateTokens(file.content, { importAlias: options.importAlias });
		tree.write(targetPath, content);
	}
}

export async function hlmRegistryItemGenerator(tree: Tree, options: HlmBaseGeneratorSchema, item: RegistryItem) {
	const tasks: GeneratorCallback[] = [];
	const targetLibDir = getTargetLibraryDirectory(options, tree);
	const tsConfigAlias = `${options.importAlias}/${options.name}`;

	if (options.dryRun) {
		console.log(`Would install ${tsConfigAlias} from registry item ${item.name}.`);
		return runTasksInSerial(...tasks);
	}

	if (!options.overwrite && isAlreadyInstalled(tree, tsConfigAlias)) {
		console.log(`Skipping ${tsConfigAlias}. It's already installed!`);
		return runTasksInSerial(...tasks);
	}

	if (options.angularCli) {
		setupAngularCliProject(tree, tsConfigAlias, targetLibDir);
	} else if (options.generateAs === 'library') {
		tasks.push(await initializeAngularLibrary(tree, options));
	}

	const filesPath =
		options.generateAs === 'entrypoint'
			? await createRegistryEntrypointScaffold(tree, tsConfigAlias, options)
			: joinPathFragments(targetLibDir, 'src');

	if (options.generateAs !== 'entrypoint') {
		const deletePath = joinPathFragments(options.directory!, options.name, 'src', 'lib', options.name);
		deleteFiles(tree, deletePath);
	}

	writeRegistryItemFiles(tree, filesPath, item, options);

	const styleMap = await getStyleMapForRegistryItem(item, options.style);
	const generatedFiles: string[] = [];
	visitNotIgnoredFiles(tree, filesPath, (filePath) => generatedFiles.push(filePath));

	for (const filePath of generatedFiles) {
		const content = tree.read(filePath, 'utf-8');
		if (!content) continue;
		tree.write(filePath, await transformStyle(content, { styleMap }));
	}

	applyRegistryGlobalStyles(tree, item);

	tasks.push(registerRegistryDependencies(tree, options, item));

	return runTasksInSerial(...tasks);
}

export async function hlmBaseGenerator(tree: Tree, options: HlmBaseGeneratorSchema) {
	const tasks: GeneratorCallback[] = [];
	const targetLibDir = getTargetLibraryDirectory(options, tree);
	const tsConfigAlias = `${options.importAlias}/${options.name}`;

	if (isAlreadyInstalled(tree, tsConfigAlias)) {
		console.log(`Skipping ${tsConfigAlias}. It's already installed!`);
		return runTasksInSerial(...tasks);
	}

	if (options.angularCli) {
		setupAngularCliProject(tree, tsConfigAlias, targetLibDir);
	} else if (options.generateAs === 'library') {
		tasks.push(await initializeAngularLibrary(tree, options));
	}
	let filesPath = targetLibDir;

	if (options.generateAs === 'entrypoint') {
		filesPath = await generateEntrypointFiles(tree, tsConfigAlias, options);
	} else {
		generateLibraryFiles(tree, targetLibDir, options);
	}

	const styleMap = await getStyleMap(options.style);
	const generatedFiles: string[] = [];

	visitNotIgnoredFiles(tree, filesPath, (filePath) => {
		generatedFiles.push(filePath);
	});

	for (const filePath of generatedFiles) {
		const content = tree.read(filePath, 'utf-8');
		if (!content) continue;
		const transformed = await transformStyle(content, { styleMap });
		tree.write(filePath, transformed);
	}

	const dependencyTask = registerDependencies(tree, options);
	if (dependencyTask) {
		tasks.push(dependencyTask);
	}

	return runTasksInSerial(...tasks);
}

export default hlmBaseGenerator;
