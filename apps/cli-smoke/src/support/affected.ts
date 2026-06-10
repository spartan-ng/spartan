import { workspaceRoot } from '@nx/devkit';
import { execSync } from 'node:child_process';

/**
 * Whether anything affecting the CLI smoke scope changed in this CI run. The `cli-smoke` project
 * implicitly depends on cli/brain/helm, so nx marks it affected when any of those - or its own files,
 * or global inputs like the lockfile - change.
 *
 * This is what lets the workflow run unconditionally (so it can be a required check) while still being
 * cheap on unrelated PRs: when nothing relevant changed the runner short-circuits to a pass instead of
 * scaffolding and building real workspaces.
 *
 * Without base/head refs (local runs, or a push where nx-set-shas didn't provide them) we always run -
 * the conservative default is to verify, never to silently skip.
 */
const PROJECT = 'cli-smoke';

export function isSmokeAffected(): boolean {
	const base = process.env.NX_BASE;
	const head = process.env.NX_HEAD;
	if (!base || !head) {
		return true;
	}

	try {
		const affected = showProjects(`--affected --base=${base} --head=${head}`);
		if (affected.includes(PROJECT)) {
			return true;
		}

		// Not in the affected set. Before skipping, make sure that is because nothing relevant changed -
		// not because the project no longer exists under this name. Otherwise a rename/typo would silently
		// disable the smoke suite on every PR (only nightly would still run it).
		if (!showProjects('').includes(PROJECT)) {
			console.warn(`[cli-smoke] Project "${PROJECT}" not found in the workspace; running rather than skipping.`);
			return true;
		}

		return false;
	} catch (error) {
		console.warn('[cli-smoke] Could not determine affected projects; running the smoke test anyway.', error);
		return true;
	}
}

function showProjects(flags: string): string[] {
	const out = execSync(`npx nx show projects ${flags} --json`, { cwd: workspaceRoot, encoding: 'utf-8' });
	return JSON.parse(out) as string[];
}
