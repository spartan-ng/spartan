import { type Tree, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import supportedUiLibraries from '../ui/supported-ui-libraries.json';
import { infoGenerator } from './generator';
import { collectSpartanInfo } from './lib/collect-info';

const availableComponents = Object.keys(supportedUiLibraries);

describe('info generator', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();

		writeJson(tree, 'components.json', {
			componentsPath: 'libs/ui',
			buildable: true,
			generateAs: 'entrypoint',
			importAlias: '@spartan-ng/helm',
		});

		writeJson(tree, 'package.json', {
			dependencies: {
				'@angular/core': '^20.0.0',
				'@angular/cdk': '^20.0.0',
				'@spartan-ng/brain': '0.0.1-alpha.704',
				tailwindcss: '^4.0.0',
				'@ng-icons/core': '^29.0.0',
			},
			devDependencies: {
				'@spartan-ng/cli': '0.0.1-alpha.704',
			},
		});

		tree.write('src/styles.css', '@import "tailwindcss";');

		// A component that imports a Helm button and a Brain dialog.
		tree.write(
			'libs/feature/src/example.component.ts',
			`
			import { HlmButton } from '@spartan-ng/helm/button';
			import { BrnDialog } from '@spartan-ng/brain/dialog';
			import { HlmAlertDialog } from '@spartan-ng/helm/alert-dialog';
			`,
		);
	});

	it('reports the resolved config', () => {
		const info = collectSpartanInfo(tree, availableComponents);

		expect(info.config.found).toBe(true);
		expect(info.config.componentsPath).toBe('libs/ui');
		expect(info.config.importAlias).toBe('@spartan-ng/helm');
		expect(info.config.generateAs).toBe('entrypoint');
		expect(info.workspaceType).toBe('nx');
	});

	it('reports dependency versions and tooling', () => {
		const info = collectSpartanInfo(tree, availableComponents);

		expect(info.versions.angular).toBe('^20.0.0');
		expect(info.versions.tailwind).toBe('^4.0.0');
		expect(info.versions.spartanBrain).toBe('0.0.1-alpha.704');
		expect(info.versions.spartanCli).toBe('0.0.1-alpha.704');
		expect(info.iconLibrary).toBe('@ng-icons');
		expect(info.tailwindCssFile).toBe('src/styles.css');
	});

	it('detects installed components from helm and brain imports', () => {
		const info = collectSpartanInfo(tree, availableComponents);

		expect(info.installedComponents).toContain('button');
		expect(info.installedComponents).toContain('dialog');
		expect(info.installedComponents).toContain('alert-dialog');
		expect(info.availableComponents.length).toBeGreaterThan(0);
	});

	it('falls back to defaults when components.json is missing', () => {
		const bareTree = createTreeWithEmptyWorkspace();
		const info = collectSpartanInfo(bareTree, availableComponents);

		expect(info.config.found).toBe(false);
		expect(info.config.componentsPath).toBe('libs/ui');
		expect(info.config.importAlias).toBe('@spartan-ng/helm');
		expect(info.installedComponents).toEqual([]);
	});

	it('runs read-only and does not create or modify components.json', async () => {
		const bareTree = createTreeWithEmptyWorkspace();
		await infoGenerator(bareTree, { json: true });

		expect(bareTree.exists('components.json')).toBe(false);
	});
});
