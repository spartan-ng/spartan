import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateHelmLibrariesGenerator } from '../migrate-helm-libraries/generator';
import { migrateDrawer, migrateDrawerGenerator } from './generator';

vi.mock('../migrate-helm-libraries/generator');

const LEGACY_HELM_FILE = 'libs/ui/drawer/src/lib/hlm-drawer-content.ts';

describe('migrate-drawer generator', () => {
	let tree: Tree;

	const migrate = async (template: string) => {
		tree.write('app/src/app/app.component.html', template);
		await migrateDrawerGenerator(tree, { skipFormat: true });
		return tree.read('app/src/app/app.component.html', 'utf-8');
	};

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
		tree.write(
			'components.json',
			JSON.stringify({ componentsPath: 'libs/ui', importAlias: '@spartan-ng/helm', generateAs: 'library' }),
		);
		vi.mocked(migrateHelmLibrariesGenerator).mockReset();
	});

	it('moves the direction of the trigger to swipeDirection on the drawer', async () => {
		expect(
			await migrate(`
				<hlm-drawer>
					<button hlmDrawerTrigger direction="top" hlmBtn>Open</button>
				</hlm-drawer>
			`),
		).toBe(`
				<hlm-drawer swipeDirection="up">
					<button hlmDrawerTrigger hlmBtn>Open</button>
				</hlm-drawer>
			`);
	});

	it('replaces direction on the drawer, bound to a string literal or not', async () => {
		expect(
			await migrate(`<hlm-drawer direction="bottom"></hlm-drawer><brn-drawer [direction]="'left'"></brn-drawer>`),
		).toBe(`<hlm-drawer swipeDirection="down"></hlm-drawer><brn-drawer swipeDirection="left"></brn-drawer>`);
	});

	it('uses the trigger direction over the drawer direction, as the trigger set it on open', async () => {
		expect(
			await migrate(
				`<hlm-drawer direction="bottom"><button hlmDrawerTrigger direction="right">Open</button></hlm-drawer>`,
			),
		).toBe(`<hlm-drawer swipeDirection="right"><button hlmDrawerTrigger>Open</button></hlm-drawer>`);
	});

	it('migrates each nested drawer with the direction of its own trigger', async () => {
		expect(
			await migrate(`
				<hlm-drawer>
					<button hlmDrawerTrigger direction="left">Open</button>
					<hlm-drawer-content *hlmDrawerPortal="let ctx">
						<hlm-drawer>
							<button hlmDrawerTrigger direction="top">Open nested</button>
						</hlm-drawer>
					</hlm-drawer-content>
				</hlm-drawer>
			`),
		).toBe(`
				<hlm-drawer swipeDirection="left">
					<button hlmDrawerTrigger>Open</button>
					<hlm-drawer-content *hlmDrawerPortal="let ctx">
						<hlm-drawer swipeDirection="up">
							<button hlmDrawerTrigger>Open nested</button>
						</hlm-drawer>
					</hlm-drawer-content>
				</hlm-drawer>
			`);
	});

	it.each([
		[
			'triggers with different directions',
			'<button hlmDrawerTrigger direction="top">A</button><button hlmDrawerTrigger direction="left">B</button>',
		],
		[
			'a trigger without a direction next to one with it',
			'<button hlmDrawerTrigger direction="top">A</button><button hlmDrawerTrigger>B</button>',
		],
		['a bound direction', '<button hlmDrawerTrigger [direction]="side">A</button>'],
	])('leaves a drawer with %s for a manual migration', async (_, triggers) => {
		const template = `<hlm-drawer>${triggers}</hlm-drawer>`;

		expect(await migrate(template)).toBe(template);
	});

	it('removes closeThreshold from the drawer content', async () => {
		expect(
			await migrate(`<hlm-drawer-content *hlmDrawerPortal="let ctx" [closeThreshold]="0.5"></hlm-drawer-content>`),
		).toBe(`<hlm-drawer-content *hlmDrawerPortal="let ctx"></hlm-drawer-content>`);
	});

	it('migrates inline templates', async () => {
		tree.write(
			'app/src/app/drawer.ts',
			"@Component({ template: `<hlm-drawer><button hlmDrawerTrigger direction='top'>Open</button></hlm-drawer>` })",
		);

		await migrateDrawerGenerator(tree, { skipFormat: true });

		expect(tree.read('app/src/app/drawer.ts', 'utf-8')).toBe(
			"@Component({ template: `<hlm-drawer swipeDirection='up'><button hlmDrawerTrigger>Open</button></hlm-drawer>` })",
		);
	});

	it('keeps the quotes of a template in a double quoted string', async () => {
		tree.write('app/src/app/drawer.ts', `@Component({ template: "<hlm-drawer direction='top'></hlm-drawer>" })`);

		await migrateDrawerGenerator(tree, { skipFormat: true });

		expect(tree.read('app/src/app/drawer.ts', 'utf-8')).toBe(
			`@Component({ template: "<hlm-drawer swipeDirection='up'></hlm-drawer>" })`,
		);
	});

	it('only touches the direction attribute itself', async () => {
		expect(
			await migrate(
				`<hlm-drawer><button data-direction="top" hlmDrawerTrigger direction="top">Open</button></hlm-drawer>`,
			),
		).toBe(`<hlm-drawer swipeDirection="up"><button data-direction="top" hlmDrawerTrigger>Open</button></hlm-drawer>`);
	});

	it('keeps scanning past a less than sign that does not start a tag', async () => {
		tree.write(
			'app/src/app/drawer.ts',
			"if (count<limit) return; // don't\nfor (let i = 0; i<items.length; i++) {}\n" +
				'@Component({ template: `<hlm-drawer direction="top"></hlm-drawer>` })',
		);

		await migrateDrawerGenerator(tree, { skipFormat: true });

		expect(tree.read('app/src/app/drawer.ts', 'utf-8')).toContain('<hlm-drawer swipeDirection="up">');
	});

	it('regenerates a helm drawer built on the removed brain drawer, then migrates the templates', async () => {
		tree.write(LEGACY_HELM_FILE, "import { BrnDrawer, BrnDrawerHandle } from '@spartan-ng/brain/drawer';");
		tree.write('app/src/app/app.component.html', '<hlm-drawer direction="top"></hlm-drawer>');
		vi.mocked(migrateHelmLibrariesGenerator).mockImplementationOnce(async (tree) => {
			tree.write(LEGACY_HELM_FILE, "import { BrnDrawerPopup } from '@spartan-ng/brain/drawer';");
		});

		expect(await migrateDrawer(tree, { skipFormat: true })).toBe(true);

		expect(migrateHelmLibrariesGenerator).toHaveBeenCalledWith(
			tree,
			expect.objectContaining({ libraries: ['drawer'], importAlias: '@spartan-ng/helm' }),
		);
		expect(tree.read('app/src/app/app.component.html', 'utf-8')).toBe('<hlm-drawer swipeDirection="up"></hlm-drawer>');
	});

	it('leaves the templates as they are when the helm drawer could not be regenerated', async () => {
		tree.write(LEGACY_HELM_FILE, "import { BrnDrawer, BrnDrawerHandle } from '@spartan-ng/brain/drawer';");
		tree.write('app/src/app/app.component.html', '<hlm-drawer direction="top"></hlm-drawer>');

		expect(await migrateDrawer(tree, { skipFormat: true })).toBe(false);

		expect(tree.read('app/src/app/app.component.html', 'utf-8')).toBe('<hlm-drawer direction="top"></hlm-drawer>');
	});

	it('keeps an up to date helm drawer', async () => {
		tree.write(
			'libs/ui/drawer/src/lib/hlm-drawer-content.ts',
			"import { BrnDrawerPopup, BrnDrawerViewport } from '@spartan-ng/brain/drawer';",
		);

		await migrateDrawerGenerator(tree, { skipFormat: true });

		expect(migrateHelmLibrariesGenerator).not.toHaveBeenCalled();
	});
});
