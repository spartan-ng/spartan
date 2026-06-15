import { type Tree, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { HealthcheckSeverity } from '../healthchecks';
import { versionHealthcheck } from './version';

describe('versionHealthcheck', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	// Regression for the network-resilience fix: a registry fetch that rejects (offline, DNS, timeout)
	// must be reported as a failure, not thrown - a thrown error here aborted every other healthcheck.
	it('reports a failure instead of throwing when the registry fetch rejects', async () => {
		writeJson(tree, 'package.json', {
			dependencies: { '@spartan-ng/brain': '^1.0.0', '@spartan-ng/cli': '^1.0.0' },
		});
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
		const failure = vi.fn();
		const skip = vi.fn();

		await expect(
			versionHealthcheck.detect(tree, failure, skip, { importAlias: '@spartan-ng/helm' }),
		).resolves.toBeUndefined();

		expect(failure).toHaveBeenCalledWith(
			expect.stringContaining('Failed to fetch metadata'),
			HealthcheckSeverity.Error,
			false,
		);
	});

	it('skips when there is no package.json', async () => {
		tree.delete('package.json');
		const failure = vi.fn();
		const skip = vi.fn();

		await versionHealthcheck.detect(tree, failure, skip, { importAlias: '@spartan-ng/helm' });

		expect(skip).toHaveBeenCalledWith('No package.json found.');
		expect(failure).not.toHaveBeenCalled();
	});
});
