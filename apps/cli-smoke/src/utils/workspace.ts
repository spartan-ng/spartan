import { createStyleMap, STYLE_PLACEHOLDER_ALLOWLIST, STYLES } from '@spartan-ng/cli';
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { componentsUnderTest, type SetupCell } from '../matrix';
import { readRegistryInfo, type RegistryInfo } from '../support/registry';

/** The style every cell uses unless it sets its own (matches matrix.ts's documented default). */
const DEFAULT_STYLE = 'vega';

// Read lazily (not at import time): when a cell is skipped because nothing affecting the CLI changed,
// global-setup never writes registry.json, and this module is still imported by the spec.
let cachedRegistry: RegistryInfo | undefined;
function registryInfo(): RegistryInfo {
	return (cachedRegistry ??= readRegistryInfo());
}

// Match the workspace's own Angular/Nx versions so scaffolded projects mirror real consumers. Strip any
// leading ^/~ so create-nx-workspace is pinned to the EXACT version, not a floating range: newer
// create-nx-workspace releases progressively remap legacy presets (e.g. `angular-monorepo`) to remote
// GitHub template clones, so an unpinned range could silently change the scaffold out from under us.
const rootPkg = require(join(workspaceRootDir(), 'package.json'));
const NX_VERSION: string = (rootPkg.devDependencies?.nx ?? rootPkg.dependencies?.nx ?? 'latest').replace(/^[\^~]/, '');
const NG_CLI_VERSION: string = (
	rootPkg.devDependencies?.['@angular/cli'] ??
	rootPkg.dependencies?.['@angular/cli'] ??
	'latest'
).replace(/^[\^~]/, '');

// Scaffold OUTSIDE the repo: create-nx-workspace/ng new run `git add`, which fails for paths the
// repo's .gitignore covers, and 700MB+ per workspace should not touch the working tree anyway.
const TMP_ROOT = join(tmpdir(), 'spartan-cli-smoke-workspaces');

export interface CellWorkspace {
	cell: SetupCell;
	dir: string;
	/** The Angular application project name inside the scaffolded workspace. */
	app: string;
	/** Workspace-relative directory the spartan components are generated into. */
	componentsPath: string;
	/** nx only: project names present before the spartan generators ran (to identify what they add). */
	baselineProjects?: string[];
}

function workspaceRootDir(): string {
	// apps/cli-smoke/src/utils -> repo root
	return join(__dirname, '..', '..', '..', '..');
}

/** AI-agent host markers that make create-nx-workspace switch into "AI mode" (see its isAiAgent()). In that
 * mode it remaps the `angular-monorepo` preset to cloning the remote `nrwl/angular-template` and auto-wires
 * Nx Cloud, ignoring our `--preset`/`--nxCloud=skip` - so the scaffold stops being deterministic (it depends
 * on a live remote template) and differs between a plain terminal, CI, and an agent like Claude Code. We
 * strip them from every child env so the local, pinned scaffold runs identically regardless of host. */
const AI_AGENT_ENV_VARS = [
	'CLAUDECODE',
	'CLAUDE_CODE',
	'OPENCODE',
	'CURSOR_TRACE_ID',
	'COMPOSER_NO_INTERACTION',
	'GEMINI_CLI',
	'REPL_ID',
] as const;

/** Registry + auth env shared by every child process so installs hit the local registry. */
function execEnv(): NodeJS.ProcessEnv {
	const env: NodeJS.ProcessEnv = {
		...process.env,
		npm_config_registry: registryInfo().registry,
		NPM_CONFIG_REGISTRY: registryInfo().registry,
		// Make create-nx-workspace/ng fully non-interactive (suppresses the git-provider prompt etc.).
		CI: 'true',
		// Disable the nx daemon. These are throwaway workspaces running a linear sequence of generators,
		// so the daemon's cross-invocation graph cache buys little, and under the all-components cell (50+
		// generator runs back-to-back) it intermittently crashes with "Failed to process project graph",
		// failing the cell non-deterministically. Running daemonless is reliable and, because the slow
		// daemon retries are gone, actually faster for that cell.
		NX_DAEMON: 'false',
		// The all-components cell generates 57 primitives and compiles them in one `ng build`, which
		// exceeds the 4GB default heap. Raise it for all cells (harmless for the small ones).
		NODE_OPTIONS: '--max-old-space-size=8192',
	};
	// Force standard (non-AI-agent) tooling behaviour so the scaffold is deterministic on any host.
	for (const key of AI_AGENT_ENV_VARS) {
		delete env[key];
	}
	return env;
}

function run(command: string, cwd: string): void {
	console.log(`[cli-smoke] $ (${cwd}) ${command}`);
	execSync(command, { cwd, env: execEnv(), stdio: 'inherit' });
}

function capture(command: string, cwd: string): string {
	return execSync(command, { cwd, env: execEnv(), encoding: 'utf-8' }).trim();
}

/** Tag applied to the spartan-generated nx libraries so the build step can target just them. */
const SPARTAN_TAG = 'scope:spartan-smoke';

/**
 * Defence-in-depth canary: confirm create-nx-workspace produced the classic local scaffold we asked for, not
 * a remote GitHub template clone. The `--preset=angular-monorepo --appName=sample` run always lands an
 * `apps/sample` project; in AI/template mode (see AI_AGENT_ENV_VARS) it instead clones `nrwl/angular-template`
 * (apps/api, apps/shop, ...) and there is no `apps/sample`. Failing loudly here turns a later cryptic
 * `nx g`/config-load error into a one-line diagnosis. Only the monorepo preset is remapped in AI mode
 * (angular-standalone is not, and the angular-cli cell uses `ng new`), so only this layout needs the canary.
 */
function assertClassicScaffold(cell: SetupCell, dir: string): void {
	const isMonorepo = cell.workspace === 'nx' && cell.nxLayout !== 'standalone';
	if (!isMonorepo) return;
	if (!existsSync(join(dir, 'apps', 'sample'))) {
		throw new Error(
			`[${cell.id}] create-nx-workspace did not produce the expected classic angular-monorepo layout ` +
				`(missing apps/sample) - it likely entered AI/template mode and cloned a remote template. Ensure the ` +
				`AI_AGENT_ENV_VARS are stripped from the scaffold env (see execEnv).`,
		);
	}
}

/** Scaffold the workspace, pin Tailwind v4, install the CLI, and write components.json. */
export function prepareWorkspace(cell: SetupCell): CellWorkspace {
	mkdirSync(TMP_ROOT, { recursive: true });
	const dir = join(TMP_ROOT, cell.id);
	rmSync(dir, { recursive: true, force: true });

	const isStandalone = cell.workspace === 'nx' && cell.nxLayout === 'standalone';
	let app: string;
	let componentsPath: string;

	if (isStandalone) {
		// Minimal single-app nx workspace: one app at the workspace root, no tsconfig.base.json (it only
		// appears once the first lib is generated). This guards that the nx generators resolve the root
		// tsconfig instead of assuming tsconfig.base.json. `--skipGit` is what makes angular-standalone
		// non-interactive (otherwise it prompts "Will you be using GitHub as your git hosting provider?").
		app = cell.id;
		componentsPath = 'libs/ui';
		run(
			`npx --yes create-nx-workspace@${NX_VERSION} ${cell.id} --preset=angular-standalone ` +
				`--style=css --bundler=esbuild --ssr=false --e2eTestRunner=none --unitTestRunner=none ` +
				`--nxCloud=skip --skipGit --interactive=false --packageManager=pnpm`,
			TMP_ROOT,
		);
	} else if (cell.workspace === 'nx') {
		app = 'demo';
		componentsPath = 'libs/ui';
		// Classic monorepo. The `angular-monorepo` template is the only preset that gives a classic layout
		// (with tsconfig.base.json) AND a composite-free TS setup the Angular build accepts - the empty
		// `apps` preset uses composite project references that fail the Angular build (NG4006). It ships a
		// sample app we ignore: we generate our own `demo` below and build only that + the spartan libs, so
		// the sample only costs install time, not build time.
		run(
			`npx --yes create-nx-workspace@${NX_VERSION} ${cell.id} --preset=angular-monorepo --appName=sample ` +
				`--style=css --bundler=esbuild --ssr=false --e2eTestRunner=none --unitTestRunner=none ` +
				`--nxCloud=skip --no-interactive --packageManager=pnpm`,
			TMP_ROOT,
		);
	} else {
		app = cell.id;
		componentsPath = 'src/app/spartan';
		run(
			`npx --yes @angular/cli@${NG_CLI_VERSION} new ${cell.id} --style=css --routing=false --ssr=false ` +
				`--skip-git --skip-tests --package-manager=pnpm --defaults`,
			TMP_ROOT,
		);
	}

	if (!existsSync(dir)) {
		throw new Error(`Scaffolding ${cell.id} did not produce a workspace at ${dir}`);
	}

	assertClassicScaffold(cell, dir);
	writeNpmrc(dir);

	if (cell.workspace === 'nx' && !isStandalone) {
		// @nx/angular ships with the template; generate our own clean app in the classic layout. The
		// standalone preset already is the app, so this only applies to the monorepo scaffold.
		run(
			`npx nx g @nx/angular:application --name=${app} --directory=apps/${app} --style=css --bundler=esbuild ` +
				`--ssr=false --routing=false --e2eTestRunner=none --unitTestRunner=none --no-interactive`,
			dir,
		);
	}

	writeTailwindConfig(dir);
	writeComponentsJson(dir, cell, componentsPath);

	// Install the locally published CLI (as a real consumer would) together with Tailwind v4 in a
	// single pass - separate `pnpm add` calls would each re-resolve the lockfile.
	run(`pnpm add -D @spartan-ng/cli@${registryInfo().version} tailwindcss@4 @tailwindcss/postcss postcss`, dir);

	// Record the project set before the spartan generators run so the build step can identify and build
	// exactly the libraries they add, ignoring the template's sample projects.
	const baselineProjects =
		cell.workspace === 'nx' ? (JSON.parse(capture(`npx nx show projects --json`, dir)) as string[]) : undefined;

	return { cell, dir, app, componentsPath, baselineProjects };
}

function writeNpmrc(dir: string): void {
	const { registry } = registryInfo();
	writeFileSync(
		join(dir, '.npmrc'),
		[
			`registry=${registry}`,
			`@spartan-ng:registry=${registry}`,
			`//${new URL(registry).host}/:_authToken=secretVerdaccioToken`,
			// npm's strict peer resolution trips over the Angular/brain peer ranges; match the workspace.
			`legacy-peer-deps=true`,
			'',
		].join('\n'),
	);
}

/** Tailwind v4 via the Angular CLI PostCSS pipeline - the documented spartan setup. The packages are
 * installed alongside the CLI (see prepareWorkspace); this only writes the PostCSS config. */
function writeTailwindConfig(dir: string): void {
	writeFileSync(
		join(dir, '.postcssrc.json'),
		`${JSON.stringify({ plugins: { '@tailwindcss/postcss': {} } }, null, 2)}\n`,
	);
}

function writeComponentsJson(dir: string, cell: SetupCell, componentsPath: string): void {
	const style = cell.style ?? DEFAULT_STYLE;
	const config =
		cell.workspace === 'nx'
			? {
					componentsPath,
					buildable: cell.buildable,
					generateAs: cell.generateAs,
					importAlias: '@spartan-ng/helm',
					style,
				}
			: { componentsPath, importAlias: '@spartan-ng/helm', style };
	writeFileSync(join(dir, 'components.json'), `${JSON.stringify(config, null, 2)}\n`);
}

/** Run `init` then `ui` for each component under test, non-interactively. */
export function runGenerators(ws: CellWorkspace): void {
	const gen = ws.cell.workspace === 'nx' ? 'npx nx g' : 'npx ng generate';
	// Tag spartan libs (nx only) so buildWorkspace can build just them, ignoring the template's sample.
	const tags = ws.cell.workspace === 'nx' ? ` --tags=${SPARTAN_TAG}` : '';

	run(`${gen} @spartan-ng/cli:init --project=${ws.app} --theme=zinc`, ws.dir);

	const components = ws.cell.allComponents ? readAllPrimitives() : [...componentsUnderTest];
	for (const component of components) {
		run(`${gen} @spartan-ng/cli:ui ${component} --directory=${ws.componentsPath}${tags}`, ws.dir);
	}
}

/**
 * Run `migrate-helm-libraries` against a workspace that has no spartan libraries yet. With a
 * components.json already written and nothing to migrate, the generator exits early with
 * "No libraries to migrate" without prompting - but loading it still resolves its `@nx/workspace`
 * (removeGenerator) and `@nx/devkit` deep imports in the *installed* CLI, where a stricter `exports`
 * map would break module resolution at load. This is the only coverage that runs the headline
 * command end-to-end as an installed package. nx-only: the generator's remove path is nx-specific.
 */
export function assertMigrateHelmLibrariesLoads(ws: CellWorkspace): void {
	if (ws.cell.workspace !== 'nx') return;
	const out = capture(`npx nx g @spartan-ng/cli:migrate-helm-libraries 2>&1`, ws.dir);
	console.log(out);
	if (!out.includes('No libraries to migrate')) {
		throw new Error(`Expected migrate-helm-libraries to no-op on a workspace with no spartan libraries, got:\n${out}`);
	}
}

/** Every supported primitive name, read from the CLI source so the list stays current as primitives are
 * added (the harness lives in the same repo as the CLI). */
function readAllPrimitives(): string[] {
	const file = join(workspaceRootDir(), 'libs', 'cli', 'src', 'generators', 'ui', 'supported-ui-libraries.json');
	return Object.keys(JSON.parse(readFileSync(file, 'utf-8')));
}

/**
 * Run the CLI's own healthcheck against the freshly generated output and fail the cell if it reports any
 * issue - this catches drift between what the generators emit and what the healthchecks expect. The
 * auto-fix flag avoids the interactive fix prompt (healthcheck never exits non-zero); the report is
 * printed before any fix runs, so failures are still visible in the output.
 *
 * Flag casing differs by CLI: Angular wants kebab-case (--auto-fix), nx accepts camelCase (--autoFix).
 */
export function assertHealthcheckClean(ws: CellWorkspace): void {
	const isNx = ws.cell.workspace === 'nx';
	const gen = isNx ? 'npx nx g' : 'npx ng generate';
	const flags = isNx ? '--autoFix --skipFormat' : '--auto-fix --skip-format';
	const out = capture(`${gen} @spartan-ng/cli:healthcheck ${flags} 2>&1`, ws.dir);
	console.log(out);
	// printReport marks a failed check with "[ ✖ ]" (see libs/cli .../healthcheck/utils/reporter.ts).
	// Ignore the "Dependency Check": it fetches the latest version from the public npm registry and flags
	// our local-registry smoke version as "not the latest" - meaningless here, not a generator issue.
	const failures = out
		.split('\n')
		.filter((line) => line.includes('[ ✖ ]'))
		.filter((line) => !line.includes('Dependency Check'));
	if (failures.length > 0) {
		throw new Error(`Healthcheck reported issues on freshly generated output:\n${failures.join('\n')}`);
	}
}

/** Build a style's class map from the registry CSS exactly as the CLI does, so the expected classes are
 *  derived (never hardcoded) and stay correct as the registry styles change. */
function registryStyleMap(style: string): Record<string, string> {
	const css = readFileSync(
		join(workspaceRootDir(), 'libs', 'registry', 'src', 'styles', `style-${style}.css`),
		'utf-8',
	);
	return createStyleMap(css);
}

/** Every registry placeholder selector across all styles (minus the allowlist), so a leftover survives the
 *  check even when the cell's own style is the one that dropped the selector. */
function allStylePlaceholders(): Set<string> {
	const placeholders = new Set<string>();
	for (const style of STYLES) {
		for (const selector of Object.keys(registryStyleMap(style))) {
			if (!STYLE_PLACEHOLDER_ALLOWLIST.has(selector)) placeholders.add(selector);
		}
	}
	return placeholders;
}

/** Selectors of the generated components (so the differential below only considers classes that can
 *  actually appear in this cell's output). The all-components cell generates everything, so it matches all. */
function generatedComponentSelectors(ws: CellWorkspace): (selector: string) => boolean {
	if (ws.cell.allComponents) return () => true;
	const components = [...componentsUnderTest];
	return (selector) => components.some((c) => selector === `spartan-${c}` || selector.startsWith(`spartan-${c}-`));
}

/** Tailwind tokens this style assigns to a generated-component selector that NO other style assigns to the
 *  same selector - the fingerprint proving the generator pulled THIS style's classes, not just any style's. */
function distinctiveTokens(
	mine: Record<string, string>,
	style: string,
	isRelevant: (selector: string) => boolean,
): Set<string> {
	const others = STYLES.filter((s) => s !== style).map(registryStyleMap);
	const distinctive = new Set<string>();
	for (const [selector, classes] of Object.entries(mine)) {
		if (!isRelevant(selector)) continue;
		for (const token of classes.split(/\s+/).filter(Boolean)) {
			const sharedElsewhere = others.some((m) => (m[selector] ?? '').split(/\s+/).includes(token));
			if (!sharedElsewhere) distinctive.add(token);
		}
	}
	return distinctive;
}

/** A class token is present only when it appears delimited by class separators (whitespace/quotes/backtick),
 *  so `bg-primary` does not spuriously match inside `bg-primary/80`. Tokens carry regex-special chars. */
function containsClass(source: string, token: string): boolean {
	const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	return new RegExp(`(?:^|[\\s"'\`])${escaped}(?=$|[\\s"'\`])`).test(source);
}

/** Concatenated source of every generated component file (specs excluded - they carry no styled classes). */
function readGeneratedSource(ws: CellWorkspace): string {
	const root = join(ws.dir, ws.componentsPath);
	return readdirSync(root, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts'))
		.map((entry) => readFileSync(join(entry.parentPath, entry.name), 'utf-8'))
		.join('\n');
}

/**
 * The heart of the style coverage: assert the CLI replaced the `spartan-*` placeholders with the configured
 * style's registry classes. Two checks, both reading the freshly generated source:
 *   1. No registry placeholder survives - a leftover is a `spartan-*` class the style map should have
 *      replaced (the build's themed-CSS check would not catch this; those CSS vars come from the theme, not
 *      the style). A genuine placeholder is one of the registry's `.spartan-*` selector names, so we match
 *      against those rather than any `spartan-*` substring - otherwise import paths (`@spartan-ng/...`) and
 *      file names (`provide-spartan-hlm`) would read as false leftovers.
 *   2. At least one class unique to this style (vs every other style, derived from the registry) reached the
 *      output - proving the RIGHT style's classes were applied, not merely some style's.
 */
export function assertStyleClassesApplied(ws: CellWorkspace): void {
	const style = ws.cell.style ?? DEFAULT_STYLE;
	const source = readGeneratedSource(ws);
	const styleMap = registryStyleMap(style);

	const placeholders = allStylePlaceholders();
	const leftover = [...new Set(Array.from(source.matchAll(/\bspartan-[\w-]+\b/g), (m) => m[0]))].filter((token) =>
		placeholders.has(token),
	);
	if (leftover.length > 0) {
		throw new Error(
			`[${ws.cell.id}] generated source still contains unreplaced spartan-* placeholders for style ` +
				`"${style}": ${leftover.join(', ')}`,
		);
	}

	const distinctive = distinctiveTokens(styleMap, style, generatedComponentSelectors(ws));
	if (distinctive.size === 0) {
		console.warn(
			`[${ws.cell.id}] style "${style}" has no classes distinctive from the other styles for the ` +
				`generated components - the style-identity assertion is skipped for this cell.`,
		);
		return;
	}
	if (![...distinctive].some((token) => containsClass(source, token))) {
		throw new Error(
			`[${ws.cell.id}] none of style "${style}"'s distinctive registry classes reached the generated ` +
				`output - the generator may have applied the wrong style's classes.`,
		);
	}
}

/**
 * A standalone component that imports the generated entrypoints and uses them in a template. Dropping
 * it into the app's source makes the build compile the generated code *through the public alias* - so
 * it verifies the alias is genuinely consumable (exports + selectors + templates type-check), not just
 * that the lib files compile in isolation. In non-buildable nx cells this is what compiles the generated
 * libs at all (they have no build target). Calendar is imported (so its lib compiles) but not placed in
 * the template, since it needs date inputs.
 */
const PROBE_SOURCE = `import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCalendarImports } from '@spartan-ng/helm/calendar';

@Component({
	selector: 'spartan-probe',
	imports: [...HlmButtonImports, ...HlmCardImports, ...HlmCalendarImports],
	template: \`
		<button hlmBtn>Click me</button>
		<section hlmCard>
			<h3 hlmCardTitle>Card title</h3>
		</section>
	\`,
})
export class SpartanProbe {}
`;

/** Write the probe component into the app source so the build compiles + consumes the generated code.
 * The nx monorepo app lives under apps/<app>; the nx standalone and angular-cli apps live at the root. */
export function useGeneratedComponents(ws: CellWorkspace): void {
	const monorepo = ws.cell.workspace === 'nx' && ws.cell.nxLayout !== 'standalone';
	const appDir = monorepo ? join('apps', ws.app, 'src', 'app') : join('src', 'app');
	writeFileSync(join(ws.dir, appDir, 'spartan-probe.ts'), PROBE_SOURCE);
}

/**
 * Build the workspace; throws (failing the test) on a non-zero exit. The probe component (written by
 * useGeneratedComponents) makes the app build compile the generated code through the public alias, so a
 * broken alias/export/template fails here. After the build we assert the theme styles reached the output.
 */
export function buildWorkspace(ws: CellWorkspace): void {
	if (ws.cell.workspace === 'nx') {
		// Build our app plus the spartan-generated buildable libs (the component libs in buildable cells,
		// and the ui-helm parent in entrypoint+buildable cells) - the libs the generators added, diffed
		// against the baseline. The app build compiles the probe, so the generated libs are compiled via
		// the alias even in non-buildable cells, where they have no build target of their own.
		const baseline = new Set(ws.baselineProjects ?? []);
		const buildable: string[] = JSON.parse(capture(`npx nx show projects --with-target build --json`, ws.dir));
		const spartanBuildable = buildable.filter((p) => !baseline.has(p));
		const projects = [ws.app, ...spartanBuildable].join(',');
		run(`npx nx run-many -t build -p ${projects} --parallel=1`, ws.dir);
	} else {
		run(`npx ng build`, ws.dir);
	}

	assertThemeStylesEmitted(ws);
}

/**
 * Assert the theme actually made it into the built CSS. The theme generator writes CSS custom
 * properties (`--background`, `--primary`, ...) into the styles entry point; if the styles/Tailwind/brain
 * pipeline is wired correctly they appear in the build output. A clean build that produced no themed CSS
 * would otherwise pass silently.
 */
function assertThemeStylesEmitted(ws: CellWorkspace): void {
	const distDir = join(ws.dir, 'dist');
	if (!existsSync(distDir)) {
		throw new Error(`No dist directory at ${distDir} after build`);
	}

	const css = readdirSync(distDir, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile() && entry.name.endsWith('.css'))
		.map((entry) => readFileSync(join(entry.parentPath, entry.name), 'utf-8'))
		.join('\n');

	if (!/--(background|foreground|primary|ring|border)\b/.test(css)) {
		throw new Error(
			`Theme CSS variables not found in the built CSS under ${distDir}. The theme/Tailwind/brain ` +
				`pipeline produced no themed styles for this setup.`,
		);
	}
}

export function cleanupWorkspace(ws: CellWorkspace): void {
	rmSync(ws.dir, { recursive: true, force: true });
}
