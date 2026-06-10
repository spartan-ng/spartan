import { workspaceRoot } from '@nx/devkit';
import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

/**
 * A version that does not exist on the public npm registry, so the smoke workspaces unambiguously
 * resolve the freshly built packages from the local registry. The CLI writes the `@spartan-ng/brain`
 * dependency at the *installed CLI version* (see build-dependency-array.ts), so cli and brain MUST be
 * published under the same version.
 *
 * It is unique PER RUN (timestamp suffix): a constant version is fatal here, because pnpm's
 * content-addressed store + metadata cache key on name@version and would serve a previously published
 * build of the same version, so changes to cli/brain would silently not be picked up across runs.
 */
function newSmokeVersion(): string {
	return `9999.0.0-smoke.${Date.now()}`;
}

/** The port the local-registry target requests. Verdaccio may pick another if it is busy, which is why
 * global-setup reads the actual URL from the registry rather than assuming this one. */
export const REGISTRY_PORT = 4873;
export const DEFAULT_REGISTRY = `http://localhost:${REGISTRY_PORT}`;

/** Packages the smoke workspaces consume. `helm` is generated as source by the CLI, not installed. */
const PACKAGES = [
	{ project: 'cli', dist: 'dist/libs/cli' },
	{ project: 'brain', dist: 'dist/libs/brain' },
] as const;

/** Written by global-setup, read by the spec (globalSetup and workers are separate processes). */
export const REGISTRY_INFO_FILE = join(workspaceRoot, 'tmp', 'cli-smoke', 'registry.json');

export interface RegistryInfo {
	registry: string;
	version: string;
}

/**
 * Build and publish the spartan packages to the (already running) local registry.
 * @param registry the registry URL verdaccio actually bound to - NOT assumed, since it may differ from
 *   the requested port if that port was busy.
 */
export function buildAndPublishPackages(registry: string): RegistryInfo {
	const version = newSmokeVersion();
	const projects = PACKAGES.map((p) => p.project).join(',');
	console.log(`[cli-smoke] Building ${projects}...`);
	execSync(`pnpm nx run-many -t build -p ${projects} --parallel=1`, {
		cwd: workspaceRoot,
		stdio: 'inherit',
	});

	// Publish with an explicit userconfig npmrc carrying the auth token. We do NOT rely on the global
	// `npm config set` that startLocalRegistry runs - it can be a no-op in some environments (e.g. a
	// volta shim), which surfaces as ENEEDAUTH. Verdaccio allows anonymous publish, so any token works.
	const publishNpmrc = join(dirname(REGISTRY_INFO_FILE), '.npmrc-publish');
	mkdirSync(dirname(publishNpmrc), { recursive: true });
	const host = new URL(registry).host;
	writeFileSync(publishNpmrc, `//${host}/:_authToken=secretVerdaccioToken\nregistry=${registry}\n`);

	for (const { dist } of PACKAGES) {
		const pkgPath = join(workspaceRoot, dist, 'package.json');
		// Bump the version only for the publish, then restore the original file byte-for-byte so a local
		// `pnpm smoke` leaves the build artifacts untouched (CI uses a fresh checkout, so it only matters
		// locally - a dev inspecting dist afterwards would otherwise see the smoke version).
		const original = readFileSync(pkgPath, 'utf-8');
		const pkg = JSON.parse(original);
		writeFileSync(pkgPath, JSON.stringify({ ...pkg, version }, null, 2));
		try {
			console.log(`[cli-smoke] Publishing ${pkg.name}@${version} to ${registry}...`);
			execSync(`npm publish --registry ${registry} --userconfig ${publishNpmrc} --tag smoke`, {
				cwd: join(workspaceRoot, dist),
				stdio: 'inherit',
			});
		} finally {
			writeFileSync(pkgPath, original);
		}
	}

	const info: RegistryInfo = { registry, version };
	mkdirSync(dirname(REGISTRY_INFO_FILE), { recursive: true });
	writeFileSync(REGISTRY_INFO_FILE, JSON.stringify(info, null, 2));
	return info;
}

export function readRegistryInfo(): RegistryInfo {
	return JSON.parse(readFileSync(REGISTRY_INFO_FILE, 'utf-8'));
}
