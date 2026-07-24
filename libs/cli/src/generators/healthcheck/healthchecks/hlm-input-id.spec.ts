import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { HealthcheckStatus } from '../healthchecks';
import { runHealthcheck } from '../utils/runner';
import { hlmInputIdHealthcheck } from './hlm-input-id';

describe('hlm-input-id healthcheck', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it('should detect legacy id inputs and fix them', async () => {
		tree.write(
			'libs/my-lib/src/legacy.component.html',
			`
				<hlm-checkbox id="checkbox-id" />
				<hlm-switch [id]="switchId" />
				<hlm-radio bind-id="radioId" value="monthly" />
				<hlm-command-input id="command-id" />
			`,
		);

		const report = await runHealthcheck(tree, hlmInputIdHealthcheck, '@spartan-ng/helm');

		expect(report.status).toBe(HealthcheckStatus.Failure);
		expect(report.fixable).toBe(true);

		if (!('fix' in hlmInputIdHealthcheck)) {
			throw new Error('Expected hlmInputIdHealthcheck to be fixable.');
		}

		await hlmInputIdHealthcheck.fix(tree, { importAlias: '@spartan-ng/helm' });

		const content = tree.read('libs/my-lib/src/legacy.component.html', 'utf-8');
		expect(content).toContain('<hlm-checkbox inputId="checkbox-id" />');
		expect(content).toContain('<hlm-switch [inputId]="switchId" />');
		expect(content).toContain('<hlm-radio bind-inputId="radioId" value="monthly" />');
		expect(content).toContain('<hlm-command-input inputId="command-id" />');
	});

	it('should not flag native ids, attr bindings, or already migrated inputs', async () => {
		tree.write(
			'libs/my-lib/src/current.component.ts',
			`
				@Component({
					template: \`
						<input id="native-input" />
						<hlm-checkbox [attr.id]="checkboxAttrId" />
						<hlm-combobox-input id="combobox-id" />
						<hlm-switch inputId="switch-id" />
					\`,
				})
				export class CurrentComponent {}
			`,
		);

		const report = await runHealthcheck(tree, hlmInputIdHealthcheck, '@spartan-ng/helm');

		expect(report.status).toBe(HealthcheckStatus.Success);
		expect(report.fixable).toBe(false);
	});
});
