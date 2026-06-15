import { type Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { type Healthcheck, HealthcheckSeverity, HealthcheckStatus } from '../healthchecks';
import { runHealthcheck } from './runner';

describe('runHealthcheck', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it('returns a success report when the check reports nothing', async () => {
		const check: Healthcheck = { name: 'noop', detect: () => undefined };

		const report = await runHealthcheck(tree, check, '@spartan-ng/helm');

		expect(report.status).toBe(HealthcheckStatus.Success);
	});

	it('returns a failure report when the check reports an issue', async () => {
		const check: Healthcheck = {
			name: 'fails',
			detect: (_tree, failure) => failure('bad thing', HealthcheckSeverity.Error, false),
		};

		const report = await runHealthcheck(tree, check, '@spartan-ng/helm');

		expect(report.status).toBe(HealthcheckStatus.Failure);
		expect(report.issues?.[0].details).toBe('bad thing');
	});

	it('returns a skipped report when the check skips', async () => {
		const check: Healthcheck = {
			name: 'skips',
			detect: (_tree, _failure, skip) => skip('not applicable'),
		};

		const report = await runHealthcheck(tree, check, '@spartan-ng/helm');

		expect(report.status).toBe(HealthcheckStatus.Skipped);
		expect(report.reason).toBe('not applicable');
	});

	// Regression for the per-check isolation: a detect() that throws (a parse error, a network
	// failure, a malformed file) must be caught and surfaced as a failure rather than propagating -
	// otherwise a single bad check aborts every remaining healthcheck in the run.
	it('converts a synchronous throw into a failure report instead of propagating', async () => {
		const check: Healthcheck = {
			name: 'throws',
			detect: () => {
				throw new Error('boom');
			},
		};

		const report = await runHealthcheck(tree, check, '@spartan-ng/helm');

		expect(report.status).toBe(HealthcheckStatus.Failure);
		expect(report.issues?.some((issue) => issue.details.includes('boom'))).toBe(true);
	});

	it('converts a rejected async detect into a failure report', async () => {
		const check: Healthcheck = {
			name: 'rejects',
			detect: async () => {
				throw new Error('async boom');
			},
		};

		const report = await runHealthcheck(tree, check, '@spartan-ng/helm');

		expect(report.status).toBe(HealthcheckStatus.Failure);
		expect(report.issues?.some((issue) => issue.details.includes('async boom'))).toBe(true);
	});
});
