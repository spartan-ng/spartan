import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { HealthcheckStatus } from '../healthchecks';
import { runHealthcheck } from '../utils/runner';
import { brainCollapsibleHealthcheck } from './brn-collapsible';

describe('brain collapsible healthcheck', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it('should flag files that consume the deprecated brn-collapsible', async () => {
		tree.write(
			'libs/my-lib/src/legacy.component.ts',
			`import { BrnCollapsible } from '@spartan-ng/brain/collapsible';`,
		);

		const report = await runHealthcheck(tree, brainCollapsibleHealthcheck, '@spartan-ng/helm');

		expect(report.status).toBe(HealthcheckStatus.Failure);
	});

	it('should not flag the helm collapsible and trace components that wrap the brain directives', async () => {
		tree.write('libs/my-lib/src/hlm-collapsible.ts', `import { BrnCollapsible } from '@spartan-ng/brain/collapsible';`);
		tree.write(
			'libs/my-lib/src/hlm-trace-collapsible.ts',
			`import { BrnCollapsible } from '@spartan-ng/brain/collapsible';`,
		);
		tree.write(
			'libs/my-lib/src/hlm-trace-collapsible-trigger.ts',
			`import { BrnCollapsibleTrigger } from '@spartan-ng/brain/collapsible';`,
		);
		tree.write(
			'libs/my-lib/src/hlm-trace-collapsible-content.ts',
			`import { BrnCollapsibleContent } from '@spartan-ng/brain/collapsible';`,
		);

		const report = await runHealthcheck(tree, brainCollapsibleHealthcheck, '@spartan-ng/helm');

		expect(report.status).toBe(HealthcheckStatus.Success);
	});
});
