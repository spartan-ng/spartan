import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { isSmokeAffected } from './affected';
import { buildAndPublishPackages, DEFAULT_REGISTRY } from './registry';

/**
 * Vitest globalSetup: stand up a local npm registry, then build and publish the spartan packages to
 * it so every matrix cell installs the freshly built CLI/brain exactly as a real consumer would. The
 * returned function runs as the global teardown (stops the registry).
 *
 * First, though, short-circuit when nothing affecting the CLI changed: skip all the heavy work (no
 * registry, no build/publish) and let the spec pass trivially. This keeps the workflow cheap on
 * unrelated PRs even though it runs unconditionally (so it can be a required check).
 */
export default async function () {
	if (!isSmokeAffected()) {
		console.log('[cli-smoke] No changes affect the CLI (cli/brain/helm/cli-smoke); skipping - cells will pass.');
		return;
	}

	const stopLocalRegistry = await startLocalRegistry({
		localRegistryTarget: 'spartan:local-registry',
		storage: './tmp/local-registry/storage',
		verbose: false,
	});

	// startLocalRegistry sets npm_config_registry to the URL verdaccio actually bound to (the requested
	// port may have been busy), so use that rather than assuming the default.
	const registry = process.env.npm_config_registry || DEFAULT_REGISTRY;

	try {
		buildAndPublishPackages(registry);
	} catch (error) {
		await stopLocalRegistry();
		throw error;
	}

	console.log(`[cli-smoke] Local registry ready on ${registry}`);

	// Returned to Vitest as the global teardown - stops the local registry after the suite.
	return async () => {
		await stopLocalRegistry();
	};
}
