import { readJson, type Tree, visitNotIgnoredFiles } from '@nx/devkit';
import { AngularCliConfigSchema, NXConfigSchema } from '../../../utils/config';

export interface SpartanInfo {
	/** The kind of workspace the project lives in. */
	workspaceType: 'nx' | 'angular-cli' | 'unknown';
	/** The resolved `components.json` configuration (defaults applied when missing). */
	config: {
		found: boolean;
		componentsPath: string;
		importAlias: string;
		buildable?: boolean;
		generateAs?: 'library' | 'entrypoint';
	};
	/** Versions of the relevant packages as declared in `package.json`. */
	versions: {
		angular: string | null;
		angularCdk: string | null;
		tailwind: string | null;
		spartanBrain: string | null;
		spartanHelm: string | null;
		spartanCli: string | null;
	};
	/** The detected icon library family, if any (Spartan uses `@ng-icons`). */
	iconLibrary: string | null;
	/** Best-effort path to the global stylesheet that imports the Tailwind preset. */
	tailwindCssFile: string | null;
	/** Resolved filesystem destinations the CLI writes to. */
	resolvedPaths: {
		components: string;
	};
	/** Spartan components detected in the workspace (by import usage and directory layout). */
	installedComponents: string[];
	/** Every component the CLI can generate. */
	availableComponents: string[];
}

const DEFAULT_COMPONENTS_PATH = 'libs/ui';
const DEFAULT_IMPORT_ALIAS = '@spartan-ng/helm';

const STYLE_FILE_CANDIDATES = [
	'src/styles.css',
	'src/styles.scss',
	'src/styles.less',
	'src/tailwind.css',
	'src/global.css',
	'styles.css',
];

const normalize = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]/g, '');

function readConfig(tree: Tree, angularCli: boolean): SpartanInfo['config'] {
	if (!tree.exists('components.json')) {
		return { found: false, componentsPath: DEFAULT_COMPONENTS_PATH, importAlias: DEFAULT_IMPORT_ALIAS };
	}

	const raw = readJson(tree, 'components.json');
	const schema = angularCli ? AngularCliConfigSchema : NXConfigSchema;
	const parsed = schema.safeParse(raw);
	// When validation succeeds use the parsed (defaulted) values, otherwise surface whatever we can read.
	const source: Record<string, unknown> = parsed.success ? parsed.data : (raw ?? {});

	return {
		found: true,
		componentsPath: typeof source.componentsPath === 'string' ? source.componentsPath : DEFAULT_COMPONENTS_PATH,
		importAlias: typeof source.importAlias === 'string' ? source.importAlias : DEFAULT_IMPORT_ALIAS,
		buildable: typeof source.buildable === 'boolean' ? source.buildable : undefined,
		generateAs: source.generateAs === 'library' || source.generateAs === 'entrypoint' ? source.generateAs : undefined,
	};
}

function readDependencies(tree: Tree): Record<string, string> {
	if (!tree.exists('package.json')) {
		return {};
	}
	const packageJson = readJson(tree, 'package.json');
	return { ...packageJson.dependencies, ...packageJson.devDependencies };
}

function detectIconLibrary(dependencies: Record<string, string>): string | null {
	return Object.keys(dependencies).some((dep) => dep.startsWith('@ng-icons/')) ? '@ng-icons' : null;
}

function detectStyleFile(tree: Tree): string | null {
	return STYLE_FILE_CANDIDATES.find((candidate) => tree.exists(candidate)) ?? null;
}

function detectInstalledComponents(tree: Tree, importAlias: string, availableComponents: string[]): string[] {
	// Map a normalized entrypoint name back to its canonical component name (e.g. "alertdialog" -> "alert-dialog").
	const byNormalized = new Map(availableComponents.map((name) => [normalize(name), name]));
	const prefixes = ['@spartan-ng/brain/', '@spartan-ng/helm/', `${importAlias}/`];
	const found = new Set<string>();

	const importRegex = /from\s*['"]([^'"]+)['"]/g;

	visitNotIgnoredFiles(tree, '.', (filePath) => {
		if (!/\.(ts|html)$/.test(filePath)) {
			return;
		}
		const contents = tree.read(filePath, 'utf-8');
		if (!contents) {
			return;
		}

		for (const match of contents.matchAll(importRegex)) {
			const moduleSpecifier = match[1];
			const prefix = prefixes.find((p) => moduleSpecifier.startsWith(p) && moduleSpecifier.length > p.length);
			if (!prefix) {
				continue;
			}
			const subpath = moduleSpecifier.slice(prefix.length).split('/')[0];
			const component = byNormalized.get(normalize(subpath));
			if (component) {
				found.add(component);
			}
		}
	});

	return [...found].sort();
}

export function collectSpartanInfo(
	tree: Tree,
	availableComponents: string[],
	options: { angularCli?: boolean } = {},
): SpartanInfo {
	const angularCli = options.angularCli ?? false;
	const config = readConfig(tree, angularCli);
	const dependencies = readDependencies(tree);

	const workspaceType: SpartanInfo['workspaceType'] = angularCli
		? 'angular-cli'
		: tree.exists('nx.json')
			? 'nx'
			: tree.exists('angular.json')
				? 'angular-cli'
				: 'unknown';

	return {
		workspaceType,
		config,
		versions: {
			angular: dependencies['@angular/core'] ?? null,
			angularCdk: dependencies['@angular/cdk'] ?? null,
			tailwind: dependencies['tailwindcss'] ?? null,
			spartanBrain: dependencies['@spartan-ng/brain'] ?? null,
			spartanHelm: dependencies['@spartan-ng/helm'] ?? null,
			spartanCli: dependencies['@spartan-ng/cli'] ?? null,
		},
		iconLibrary: detectIconLibrary(dependencies),
		tailwindCssFile: detectStyleFile(tree),
		resolvedPaths: {
			components: config.componentsPath,
		},
		installedComponents: detectInstalledComponents(tree, config.importAlias, availableComponents),
		availableComponents: [...availableComponents].sort(),
	};
}
