import { setupMatrix } from './matrix';
import { isSmokeAffected } from './support/affected';
import {
	assertHealthcheckClean,
	buildWorkspace,
	cleanupWorkspace,
	prepareWorkspace,
	runGenerators,
	useGeneratedComponents,
} from './utils/workspace';

// Computed once. When nothing affecting the CLI changed, every cell returns a pass without doing work -
// global-setup likewise skipped standing up the registry. This lets the workflow be a required check
// that stays cheap on unrelated PRs. Same git state as global-setup, so the decision matches.
const affected = isSmokeAffected();

/**
 * For every supported workspace setup: scaffold a real workspace from the locally published CLI, run
 * the init + ui generators, consume a generated component in the app, and build it. A generator error,
 * a generated component that does not compile/consume through its alias, a build failure, or missing
 * themed CSS in the output all fail the cell.
 *
 * On success the temp workspace is removed; on failure it is left on disk under
 * <os-tmp>/spartan-cli-smoke-workspaces/<cell-id> for inspection.
 */
describe('CLI setup matrix', () => {
	// A plain loop rather than `describe.each(setupMatrix)('$id', ...)`: the `$id` interpolation renders the
	// cell id wrapped in quotes (e.g. `'nx-entry-buildable'`), so CI's `--testNamePattern="<id> "` (no quotes)
	// matched nothing and every cell silently skipped. `describe(cell.id, ...)` produces a clean, unquoted
	// name the per-cell pattern can anchor to.
	for (const cell of setupMatrix) {
		describe(cell.id, () => {
			it('scaffolds, generates, passes healthcheck, consumes components, and builds with themed styles', () => {
				if (!affected) {
					console.log(`[cli-smoke] ${cell.id}: skipped (nothing affecting the CLI changed).`);
					return;
				}
				const ws = prepareWorkspace(cell);
				runGenerators(ws);
				assertHealthcheckClean(ws);
				useGeneratedComponents(ws);
				buildWorkspace(ws);
				cleanupWorkspace(ws);
			});
		});
	}
});
