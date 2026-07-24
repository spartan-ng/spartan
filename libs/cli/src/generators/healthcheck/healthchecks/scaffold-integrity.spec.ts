import { type Tree, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { HealthcheckStatus } from '../healthchecks';
import { runHealthcheck } from '../utils/runner';
import { scaffoldIntegrityHealthcheck } from './scaffold-integrity';

describe('scaffold-integrity healthcheck', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it('flags a primitive that is imported but has no tsconfig path', async () => {
		writeJson(tree, 'tsconfig.base.json', {
			compilerOptions: { paths: { '@spartan-ng/helm/command': ['libs/ui/command/src/index.ts'] } },
		});
		tree.write(
			'libs/ui/command/src/lib/hlm-command-input.ts',
			`import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';`,
		);

		const report = await runHealthcheck(tree, scaffoldIntegrityHealthcheck, '@spartan-ng/helm');

		expect(report.status).toBe(HealthcheckStatus.Failure);
		expect(report.issues?.[0].details).toContain('input-group');
		expect(report.issues?.[0].details).toContain('nx g @spartan-ng/cli:ui input-group');
	});

	it('passes when every imported primitive is path-mapped', async () => {
		writeJson(tree, 'tsconfig.base.json', {
			compilerOptions: {
				paths: {
					'@spartan-ng/helm/command': ['libs/ui/command/src/index.ts'],
					'@spartan-ng/helm/input-group': ['libs/ui/input-group/src/index.ts'],
				},
			},
		});
		tree.write(
			'libs/ui/command/src/lib/hlm-command-input.ts',
			`import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';`,
		);

		const report = await runHealthcheck(tree, scaffoldIntegrityHealthcheck, '@spartan-ng/helm');

		expect(report.status).toBe(HealthcheckStatus.Success);
	});

	it('ignores subpath imports that are not known primitives', async () => {
		writeJson(tree, 'tsconfig.base.json', { compilerOptions: { paths: {} } });
		tree.write('libs/ui/foo/src/index.ts', `import { thing } from '@spartan-ng/helm/not-a-primitive';`);

		const report = await runHealthcheck(tree, scaffoldIntegrityHealthcheck, '@spartan-ng/helm');

		expect(report.status).toBe(HealthcheckStatus.Success);
	});
});
