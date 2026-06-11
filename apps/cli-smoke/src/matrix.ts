/**
 * The set of supported workspace setups the CLI must keep working. Each cell drives one real
 * scaffold -> generate -> build run in the smoke suite. Adding/removing a combination is a one-line
 * change here.
 *
 * Tailwind is fixed at v4 (the supported/documented setup).
 */
export type WorkspaceType = 'nx' | 'angular-cli';
export type GenerateAs = 'library' | 'entrypoint';
/** nx workspace shape: a classic monorepo (apps/ + libs/, has tsconfig.base.json) or a single-app
 * standalone workspace (app at root, no tsconfig.base.json until the first lib is created). */
export type NxLayout = 'monorepo' | 'standalone';

export interface SetupCell {
	/** Stable id, also used as the temp workspace folder name. */
	id: string;
	workspace: WorkspaceType;
	/** Only meaningful for nx. Defaults to 'monorepo'. */
	nxLayout?: NxLayout;
	/** Only meaningful for nx: the angular-cli branch ignores it. */
	generateAs?: GenerateAs;
	/** Only meaningful for nx: the angular-cli branch ignores it. */
	buildable?: boolean;
	/** Generate every supported primitive instead of the small default set. */
	allComponents?: boolean;
	/** Excluded from the per-PR CI matrix (too slow); runs only in the nightly full run. */
	nightlyOnly?: boolean;
}

const nxCells: SetupCell[] = (['library', 'entrypoint'] as GenerateAs[]).flatMap((generateAs) =>
	[true, false].map((buildable) => ({
		id: `nx-${generateAs === 'library' ? 'lib' : 'entry'}-${buildable ? 'buildable' : 'nonbuildable'}`,
		workspace: 'nx' as const,
		generateAs,
		buildable,
	})),
);

// A single-app nx workspace (no tsconfig.base.json initially). Guards that the nx generators resolve the
// root tsconfig rather than assuming tsconfig.base.json - see libs/cli initialize-angular-library.ts.
const nxStandaloneCells: SetupCell[] = [
	{ id: 'nx-standalone', workspace: 'nx', nxLayout: 'standalone', generateAs: 'library', buildable: true },
];

// For angular-cli the generateAs/buildable axes are dead code (setupAngularCliProject ignores both),
// so a single cell covers it. Re-add the other axes here if that ever changes.
const angularCliCells: SetupCell[] = [{ id: 'acli', workspace: 'angular-cli' }];

// Generate every supported primitive and build them all - broad per-component coverage the small default
// set can't give, so a broken template in any single primitive surfaces here. Uses the angular-cli setup
// on purpose: the components all land in src/ and `ng build` compiles the lot in one pass, with no nx
// project graph to serialize (nx hits V8's max-string-length / OOM well before 57 generators). It is the
// slowest cell; it fans out to its own runner so it does not hold up the others. Set `nightlyOnly: true`
// to drop it from per-PR CI if it proves too slow.
const allComponentsCells: SetupCell[] = [{ id: 'all-components', workspace: 'angular-cli', allComponents: true }];

export const setupMatrix: SetupCell[] = [...nxCells, ...nxStandaloneCells, ...angularCliCells, ...allComponentsCells];

/**
 * Default components generated in every cell. `button` is a standalone primitive; `card` exercises a
 * multi-part primitive; `calendar` pulls in dependent primitives (button/icon/select) so the
 * dependent-primitive resolution path is covered too. The all-components cell overrides this with the
 * full supported set (see workspace.ts).
 */
export const componentsUnderTest = ['button', 'card', 'calendar'] as const;
