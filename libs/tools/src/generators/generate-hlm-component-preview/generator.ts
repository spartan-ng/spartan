import { formatFiles, joinPathFragments, logger, type Tree, visitNotIgnoredFiles } from '@nx/devkit';
import { createTree } from '@nx/devkit/testing';
import { createPrimitiveLibraries, createStyleMap, getOrCreateConfig, transformStyle } from '@spartan-ng/cli';
import { copyFileSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

// todo remove this when the registry is build and published
const STYLES = ['nova', 'vega', 'lyra', 'maia', 'mira', 'luma'] as const;
type Style = (typeof STYLES)[number];

function shouldIgnoreImport(importLine: string) {
	const match = importLine.match(/from\s+['"](.*)['"]/);
	if (!match) return false;

	const source = match[1];
	return source.startsWith('./') || source.startsWith('../');
}

function extractHlmImportsBlock(content: string): string | null {
	const match = content.match(/export\s+const\s+Hlm\w+Imports[\s\S]*?as const;/m);
	return match ? match[0].trim() : null;
}

function mergeImports(imports: string[]) {
	const importMap = new Map<
		string,
		{
			default?: string;
			namespace?: string;
			named: Set<string>;
			typeNamed: Set<string>;
		}
	>();

	for (const imp of imports) {
		const match = imp.match(/import\s+(.*)\s+from\s+['"](.*)['"]/s);
		if (!match) continue;

		const clause = match[1].trim();
		const source = match[2];

		if (!importMap.has(source)) {
			importMap.set(source, {
				named: new Set(),
				typeNamed: new Set(),
			});
		}

		const entry = importMap.get(source)!;

		const nsMatch = clause.match(/\*\s+as\s+(\w+)/);
		if (nsMatch) {
			entry.namespace = nsMatch[1];
			continue;
		}

		const namedMatch = clause.match(/\{([\s\S]*)\}/);
		if (namedMatch) {
			const beforeBrace = clause.slice(0, clause.indexOf('{')).replace(',', '').trim();
			// A leading `type` before the brace means this is a type-only named import
			// (e.g. `import type { ClassValue } from 'clsx'`). It is NOT a default import,
			// so all of its names are type-only and no default should be recorded.
			const isTypeOnly = beforeBrace === 'type';
			if (beforeBrace && !beforeBrace.startsWith('*') && !isTypeOnly) {
				entry.default = beforeBrace;
			}

			const names = namedMatch[1]
				.split(',')
				.map((s) => s.trim())
				.filter(Boolean);

			for (const n of names) {
				if (isTypeOnly || n.startsWith('type ')) {
					entry.typeNamed.add(n.replace('type ', '').trim());
				} else {
					entry.named.add(n);
				}
			}
			continue;
		}

		entry.default = clause;
	}

	const result: string[] = [];

	for (const [source, data] of importMap) {
		const parts: string[] = [];

		if (data.default) parts.push(data.default);
		if (data.namespace) parts.push(`* as ${data.namespace}`);

		const named = [...[...data.named].sort(), ...[...data.typeNamed].sort().map((t) => `type ${t}`)];

		if (named.length) {
			parts.push(`{ ${named.join(', ')} }`);
		}

		result.push(`import ${parts.join(', ')} from '${source}';`);
	}

	return result.sort();
}

function extractImports(code: string) {
	const importRegex = /import[\s\S]*?from\s+['"][^'"]+['"];?/g;

	const imports = (code.match(importRegex) ?? []).filter((i) => !shouldIgnoreImport(i));

	const body = code.replace(importRegex, '').trim();

	return { imports, body };
}

function getComponentDirectories(tree: Tree, basePath: string): string[] {
	if (!tree.exists(basePath)) {
		logger.warn(`Base components directory not found: ${basePath}`);
		return [];
	}

	return tree.children(basePath).filter((name) => {
		const fullPath = joinPathFragments(basePath, name);
		return !tree.isFile(fullPath);
	});
}

export async function generateHlmComponentManualInstallation(tree: Tree): Promise<void> {
	logger.info('Generating manual install snippets...');

	const componentsDir = 'apps/app/src/app/pages/(components)/components';
	const componentDirs = getComponentDirectories(tree, componentsDir);
	componentDirs.push(...['utils', 'typography']);
	const styleMaps: Record<Style, ReturnType<typeof createStyleMap>> = {} as never;

	for (const theme of STYLES) {
		const css = tree.read(`libs/registry/src/styles/style-${theme}.css`, 'utf-8');
		if (!css) {
			logger.warn(`Missing style file for theme: ${theme}`);
			continue;
		}
		styleMaps[theme] = createStyleMap(css);
	}

	const result: Record<string, Record<Style, string>> = {};

	for (const primitiveName of componentDirs) {
		const name = primitiveName.replace('(', '').replace(')', '');
		const baseDir = `libs/cli/src/generators/ui/libs/${name}/files`;

		const files: string[] = [];

		visitNotIgnoredFiles(tree, baseDir, (filePath) => files.push(filePath));

		if (files.length === 0) {
			logger.warn(`Skipping empty primitive: ${name}`);
			continue;
		}

		result[name] = {} as Record<Style, string>;

		for (const theme of STYLES) {
			const styleMap = styleMaps[theme];
			if (!styleMap) continue;

			const importSet = new Set<string>();
			const bodies: string[] = [];
			let hlmImportBlock: string | null = null;

			for (const filePath of files) {
				const content = tree.read(filePath, 'utf-8');
				if (!content?.trim()) continue;

				if (filePath.endsWith('index.ts.template')) {
					hlmImportBlock = extractHlmImportsBlock(content);
					continue;
				}

				const transformed = await transformStyle(content, { styleMap });

				const { imports, body } = extractImports(transformed);

				imports.forEach((i) => importSet.add(i.trim().replaceAll('<%- importAlias %>', '@spartan-ng/helm')));

				if (body.trim()) {
					bodies.push(body);
				}
			}

			if (bodies.length === 0) {
				logger.warn(`Skipping empty primitive (${theme}): ${name}`);
				continue;
			}

			const mergedImports = mergeImports([...importSet]).join('\n');
			const mergedBody = bodies.join('\n\n');

			const finalParts = [mergedImports, mergedBody];

			if (hlmImportBlock) {
				finalParts.push(hlmImportBlock);
			}

			result[name][theme] = finalParts.join('\n\n');
		}
	}

	const outputPath = 'apps/app/src/public/data/manual-install-snippets.json';
	tree.write(outputPath, JSON.stringify(result, null, 2));

	// The StackBlitz artifacts need the real workspace (brain version, the CLI generator's source).
	// Skip them when running against a synthetic tree, e.g. the unit test's empty workspace.
	if (tree.exists('libs/brain/package.json')) {
		writeStackblitzMeta(tree);
		await writeStackblitzProject(tree);
	}

	await formatFiles(tree);
	logger.info(`Snippets generated at ${outputPath}`);
}

/**
 * Emit the metadata a StackBlitz project needs to assemble a runnable spartan app:
 * the base/dev dependency set (non-Angular versions mirrored from the workspace root so
 * they never drift) and the Tailwind preset CSS text. No helm component source is
 * duplicated here - the helm bytes only live in manual-install-snippets.json, which is
 * regenerated from libs/helm in the same pass.
 */
function writeStackblitzMeta(tree: Tree): void {
	const rootPkg = JSON.parse(tree.read('package.json', 'utf-8') ?? '{}');
	const allVersions: Record<string, string> = { ...rootPkg.dependencies, ...rootPkg.devDependencies };
	const pick = (name: string, fallback: string) => allVersions[name] ?? fallback;
	const brainVersion = JSON.parse(tree.read('libs/brain/package.json', 'utf-8') ?? '{}').version ?? 'latest';

	// StackBlitz projects target the latest Angular (21) rather than the workspace's version. All
	// `@angular/*` packages (incl. cdk, which is released in lockstep) must share one major or the
	// build fails - e.g. an unpinned `@angular/router` peer floating to a newer major than
	// compiler-cli throws "Unsupported change detection strategy" while parsing the router bundle.
	const ANGULAR = '^21.0.0';

	const baseDependencies: Record<string, string> = {
		'@angular/animations': ANGULAR,
		'@angular/cdk': ANGULAR,
		'@angular/common': ANGULAR,
		'@angular/compiler': ANGULAR,
		'@angular/core': ANGULAR,
		'@angular/forms': ANGULAR,
		'@angular/platform-browser': ANGULAR,
		'@angular/router': ANGULAR,
		'@ng-icons/core': pick('@ng-icons/core', '^32.0.0'),
		'@ng-icons/lucide': pick('@ng-icons/lucide', '^32.0.0'),
		// Additional icon sets a handful of examples pull in besides lucide.
		'@ng-icons/remixicon': pick('@ng-icons/remixicon', '^32.0.0'),
		'@ng-icons/tabler-icons': pick('@ng-icons/tabler-icons', '^32.0.0'),
		'@spartan-ng/brain': brainVersion,
		// Used by the data-table example (not declared as a helm peer dependency, so it is not
		// captured in the generated project deps - add it explicitly or data-table fails to resolve).
		// Pinned EXACT (caret stripped) to the workspace version: the example's `flexRenderComponent`
		// usage is API-sensitive and a newer patch (8.21.4) changed the signature, so a floating
		// caret would break the build with TS2554.
		'@tanstack/angular-table': pick('@tanstack/angular-table', '^8.21.0').replace(/^[\^~]/, ''),
		'class-variance-authority': pick('class-variance-authority', '^0.7.0'),
		clsx: pick('clsx', '^2.1.1'),
		// Example-specific runtime deps not declared as helm peers (so not captured in the project):
		// the carousel autoplay plugin, the luxon date adapter used by date-picker, and ngx-scrollbar
		// behind scroll-area.
		'embla-carousel-autoplay': pick('embla-carousel-autoplay', '^8.0.0'),
		luxon: pick('luxon', '^3.0.0'),
		'ngx-scrollbar': pick('ngx-scrollbar', '^18.0.0'),
		rxjs: pick('rxjs', '~7.8.0'),
		'tailwind-merge': pick('tailwind-merge', '^3.5.0'),
		'zone.js': pick('zone.js', '~0.15.0'),
	};

	const devDependencies: Record<string, string> = {
		'@angular/build': ANGULAR,
		'@angular/cli': ANGULAR,
		'@angular/compiler-cli': ANGULAR,
		'@tailwindcss/postcss': pick('@tailwindcss/postcss', '^4.0.0'),
		// luxon ships no bundled types; the date-picker examples need these to type-check.
		'@types/luxon': pick('@types/luxon', '^3.0.0'),
		tailwindcss: pick('tailwindcss', '^4.0.0'),
		'tw-animate-css': pick('tw-animate-css', '^1.4.0'),
		typescript: pick('typescript', '~5.9.0'),
	};

	const presetCss = tree.read('libs/brain/hlm-tailwind-preset.css', 'utf-8') ?? '';

	const meta = { baseDependencies, devDependencies, presetCss };
	const metaPath = 'apps/app/src/public/data/stackblitz-meta.json';
	tree.write(metaPath, JSON.stringify(meta, null, 2));
	logger.info(`StackBlitz metadata generated at ${metaPath}`);
}

/**
 * Run the REAL `@spartan-ng/cli` ui generator against a fresh in-memory Angular-CLI workspace
 * (NOT nx) so the captured files exactly match what `nx g @spartan-ng/cli:ui` produces for a
 * real app: the `libs/ui/<component>/src/lib/...` folder structure, the tsconfig path aliases,
 * and the exact dependency set. The StackBlitz builder writes these verbatim.
 *
 * Note: the CLI base generator currently hardcodes the nova style map, so this output is nova
 * (the default theme) - matching what real CLI users get today.
 */
async function writeStackblitzProject(tree: Tree): Promise<void> {
	const brainVersion = JSON.parse(tree.read('libs/brain/package.json', 'utf-8') ?? '{}').version ?? 'latest';
	const rootPkg = JSON.parse(tree.read('package.json', 'utf-8') ?? '{}');
	const rootVersions: Record<string, string> = { ...rootPkg.dependencies, ...rootPkg.devDependencies };
	const cli = createTree();
	cli.write(
		'package.json',
		JSON.stringify(
			{
				name: 'spartan-ui-example',
				// Seed values only - the CLI generator reads them while resolving peer deps, but the
				// StackBlitz builder overrides every Angular package with the pinned set from
				// stackblitz-meta.json. Sourced from the workspace root so they cannot drift.
				dependencies: {
					'@angular/core': rootVersions['@angular/core'] ?? 'latest',
					'@angular/cdk': rootVersions['@angular/cdk'] ?? 'latest',
				},
				// the generator reads @spartan-ng/cli's version to pin @spartan-ng/brain
				devDependencies: { '@spartan-ng/cli': brainVersion },
			},
			null,
			2,
		),
	);
	cli.write('tsconfig.json', JSON.stringify({ compilerOptions: { paths: {} } }, null, 2));
	cli.write(
		'components.json',
		JSON.stringify({ componentsPath: 'libs/ui', importAlias: '@spartan-ng/helm', style: 'nova' }, null, 2),
	);

	const supported = JSON.parse(
		readFileSync(join(__dirname, '../../../../cli/src/generators/ui/supported-ui-libraries.json'), 'utf-8'),
	);
	const names = Object.keys(supported);
	const config = await getOrCreateConfig(cli, {
		angularCli: true,
		componentsPath: 'libs/ui',
		importAlias: '@spartan-ng/helm',
		style: 'nova',
	});

	// The CLI base generator reads its style map from `libs/cli/src/generators/ui/style-nova.css`
	// on the real filesystem (that file is normally produced by the cli build's asset copy). When
	// running from source it is absent, which would silently strip the spartan-* variant classes.
	// Stage it from the registry source for the duration of the run, then clean up.
	const cliNovaCss = join(__dirname, '../../../../cli/src/generators/ui/style-nova.css');
	const stagedNovaCss = !existsSync(cliNovaCss);
	if (stagedNovaCss) {
		copyFileSync(join(__dirname, '../../../../registry/src/styles/style-nova.css'), cliNovaCss);
	}
	try {
		await createPrimitiveLibraries(
			{ primitives: ['all'] },
			names as never,
			supported as never,
			cli,
			{
				angularCli: true,
				directory: 'libs/ui',
				importAlias: '@spartan-ng/helm',
				installPeerDependencies: true,
			} as never,
			config,
		);
	} finally {
		if (stagedNovaCss) rmSync(cliNovaCss, { force: true });
	}

	// Capture the real generated component files (libs/ui/**) + components.json. package.json
	// and tsconfig.json are surfaced as structured data (deps + paths) instead.
	const files: Record<string, string> = {};
	for (const change of cli.listChanges()) {
		if (change.type === 'DELETE') continue;
		if (!(change.path.startsWith('libs/') || change.path === 'components.json')) continue;
		const content = cli.read(change.path, 'utf-8');
		if (content == null) continue;
		files[change.path] = content;
	}
	const pkg = JSON.parse(cli.read('package.json', 'utf-8') || '{}');
	const tsconfig = JSON.parse(cli.read('tsconfig.json', 'utf-8') || '{}');

	const project = {
		files,
		dependencies: (pkg.dependencies ?? {}) as Record<string, string>,
		tsconfigPaths: (tsconfig.compilerOptions?.paths ?? {}) as Record<string, string[]>,
	};
	const outputPath = 'apps/app/src/public/data/stackblitz-project.json';
	tree.write(outputPath, JSON.stringify(project, null, 2));
	logger.info(`StackBlitz project generated at ${outputPath} (${Object.keys(files).length} files)`);
}

export default generateHlmComponentManualInstallation;
