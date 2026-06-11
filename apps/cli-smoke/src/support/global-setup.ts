import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { isSmokeAffected } from './affected';
import { buildAndPublishPackages, DEFAULT_REGISTRY } from './registry';

/**
 * Jest globalSetup: stand up a local npm registry, then build and publish the spartan packages to it
 * so every matrix cell installs the freshly built CLI/brain exactly as a real consumer would.
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

	// Stash the teardown handle for global-teardown (separate module invocation, same process).
	(globalThis as Record<string, unknown>).__STOP_LOCAL_REGISTRY__ = stopLocalRegistry;

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
}
