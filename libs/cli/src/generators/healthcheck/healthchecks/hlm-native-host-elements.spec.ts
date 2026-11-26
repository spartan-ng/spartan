import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { HealthcheckStatus } from '../healthchecks';
import { runHealthcheck } from '../utils/runner';
import { hlmNativeHostElementsHealthcheck } from './hlm-native-host-elements';

describe('hlm-native-host-elements healthcheck', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it('should detect legacy wrapper elements and fix them', async () => {
		tree.write(
			'libs/my-lib/src/legacy.component.html',
			`
				<hlm-select-trigger class="w-56"><hlm-select-value /></hlm-select-trigger>
				<hlm-pagination-next link="/next" />
			`,
		);

		const report = await runHealthcheck(tree, hlmNativeHostElementsHealthcheck, '@spartan-ng/helm');

		expect(report.status).toBe(HealthcheckStatus.Failure);
		expect(report.fixable).toBe(true);

		if (!('fix' in hlmNativeHostElementsHealthcheck)) {
			throw new Error('Expected hlmNativeHostElementsHealthcheck to be fixable.');
		}

		await hlmNativeHostElementsHealthcheck.fix(tree, { importAlias: '@spartan-ng/helm' });

		const content = tree.read('libs/my-lib/src/legacy.component.html', 'utf-8');
		expect(content).toContain('<button hlmSelectTrigger class="w-56"><hlm-select-value /></button>');
		expect(content).toContain('<a hlmPaginationNext link="/next"></a>');

		const rerun = await runHealthcheck(tree, hlmNativeHostElementsHealthcheck, '@spartan-ng/helm');
		expect(rerun.status).toBe(HealthcheckStatus.Success);
	});

	it('should not flag already migrated or unrelated code', async () => {
		tree.write(
			'libs/my-lib/src/current.component.ts',
			`
				import { HlmSelectTrigger } from './lib/hlm-select-trigger';

				@Component({
					template: \`
						<button hlmSelectTrigger><hlm-select-value /></button>
						<hlm-select-content />
						<a hlmPaginationPrevious link="/prev"></a>
					\`,
				})
				export class CurrentComponent {}
			`,
		);

		const report = await runHealthcheck(tree, hlmNativeHostElementsHealthcheck, '@spartan-ng/helm');

		expect(report.status).toBe(HealthcheckStatus.Success);
		expect(report.fixable).toBe(false);
	});
});
