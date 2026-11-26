import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import {
	CLOSE_THRESHOLD_MESSAGE,
	DIRECTION_MANUAL_MESSAGE,
	DIRECTION_MESSAGE,
	LEGACY_API_MESSAGE,
	LEGACY_HELM_MESSAGE,
} from '../../migrate-drawer/utils';
import type { HealthcheckFailureFn } from '../healthchecks';
import { helmDrawerHealthcheck } from './hlm-drawer';

describe('drawer healthcheck', () => {
	let tree: Tree;
	let failures: Array<{ message: string; fixable: boolean }>;

	const detect = () =>
		helmDrawerHealthcheck.detect(
			tree,
			((message, _severity, fixable) => failures.push({ message, fixable })) as HealthcheckFailureFn,
			() => undefined,
			{ importAlias: '@spartan-ng/helm' },
		);

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
		failures = [];
	});

	it('does not report a migrated drawer', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`<hlm-drawer swipeDirection="up"><button hlmDrawerTrigger>Open</button></hlm-drawer>`,
		);
		tree.write(
			'libs/ui/drawer/src/lib/hlm-drawer-content.ts',
			"import { BrnDrawerPopup, BrnDrawerViewport } from '@spartan-ng/brain/drawer';",
		);

		await detect();

		expect(failures).toEqual([]);
	});

	it('reports a helm drawer built on the removed brain drawer as fixable', async () => {
		tree.write(
			'libs/ui/drawer/src/lib/hlm-drawer-overlay.ts',
			"import { BrnDrawerOverlay } from '@spartan-ng/brain/drawer';",
		);

		await detect();

		expect(failures).toEqual([
			{ message: `libs/ui/drawer/src/lib/hlm-drawer-overlay.ts: ${LEGACY_HELM_MESSAGE}`, fixable: true },
		]);
	});

	it('reports direction on a trigger, fixable when every trigger agrees', async () => {
		tree.write('app/a.html', `<hlm-drawer><button hlmDrawerTrigger direction="top">Open</button></hlm-drawer>`);
		tree.write(
			'app/b.html',
			`<hlm-drawer><button hlmDrawerTrigger direction="top">A</button><button hlmDrawerTrigger direction="left">B</button></hlm-drawer>`,
		);

		await detect();

		expect(failures).toEqual([
			{ message: `app/a.html: ${DIRECTION_MESSAGE}`, fixable: true },
			{ message: `app/b.html: ${DIRECTION_MANUAL_MESSAGE}`, fixable: false },
		]);
	});

	it('reports closeThreshold on the drawer content', async () => {
		tree.write(
			'app/a.html',
			`<hlm-drawer-content *hlmDrawerPortal="let ctx" closeThreshold="0.5"></hlm-drawer-content>`,
		);

		await detect();

		expect(failures).toEqual([{ message: `app/a.html: ${CLOSE_THRESHOLD_MESSAGE}`, fixable: true }]);
	});

	it.each([
		'BrnDrawerHandle',
		'BrnDrawerOverlay',
		'hlmDrawerHandle',
		'*brnDrawerContent',
		'data-vaul-drawer-direction',
	])('reports %s in app code for a manual migration', async (api) => {
		tree.write('app/a.ts', `const usage = '${api}';`);

		await detect();

		expect(failures).toEqual([{ message: `app/a.ts: ${LEGACY_API_MESSAGE}`, fixable: false }]);
	});
});
