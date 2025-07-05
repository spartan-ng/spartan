import { applicationGenerator, E2eTestRunner, setupTailwindGenerator, UnitTestRunner } from '@nx/angular/generators';
import { readProjectConfiguration, Tree, updateJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from 'nx/src/devkit-testing-exports';
import { addThemeToApplicationStyles } from './libs/add-theme-to-application-styles';

jest.mock('@nx/devkit', () => {
	const original = jest.requireActual('@nx/devkit');
	return {
		...original,
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		ensurePackage: () => {},
		createProjectGraphAsync: jest.fn().mockResolvedValue({
			nodes: {},
			dependencies: {},
		}),
	};
});

describe('Theme generator', () => {
	let tree: Tree;

	beforeEach(async () => {
		tree = createTreeWithEmptyWorkspace();
		await applicationGenerator(tree, {
			directory: 'website',
			e2eTestRunner: E2eTestRunner.None,
			linter: 'none',
			name: 'website',
			skipFormat: true,
			unitTestRunner: UnitTestRunner.None,
			skipTests: true,
		});
	});

	describe('Tailwind v3', () => {
		beforeEach(async () => {
			await setupTailwindGenerator(tree, {
				project: 'website',
				skipFormat: true,
			});
		});

		it('should not add the Tailwind 4 preset global stylesheet', async () => {
			const project = readProjectConfiguration(tree, 'website');

			addThemeToApplicationStyles(tree, { theme: 'zinc', project: 'website', addCdkStyles: true }, project);

			const styles = tree.read('website/src/styles.css', 'utf8');

			expect(styles).not.toContain('@import "@spartan-ng/brain/hlm-tailwind-preset.css";');
		});

		it('should add the neutral theme styles to the global stylesheet', async () => {
			const project = readProjectConfiguration(tree, 'website');
			addThemeToApplicationStyles(tree, { theme: 'neutral', project: 'website', addCdkStyles: true }, project);
			const styles = tree.read('website/src/styles.css', 'utf8');
			expect(styles).toMatchSnapshot();
		});

		it('should add the zinc theme styles to the global stylesheet', async () => {
			const project = readProjectConfiguration(tree, 'website');
			addThemeToApplicationStyles(tree, { theme: 'zinc', project: 'website', addCdkStyles: true }, project);
			const styles = tree.read('website/src/styles.css', 'utf8');
			expect(styles).toMatchSnapshot();
		});

		it('should add the slate theme styles to the global stylesheet', async () => {
			const project = readProjectConfiguration(tree, 'website');
			addThemeToApplicationStyles(tree, { theme: 'slate', project: 'website', addCdkStyles: true }, project);
			const styles = tree.read('website/src/styles.css', 'utf8');
			expect(styles).toMatchSnapshot();
		});

		it('should add the stone theme styles to the global stylesheet', async () => {
			const project = readProjectConfiguration(tree, 'website');
			addThemeToApplicationStyles(tree, { theme: 'stone', project: 'website', addCdkStyles: true }, project);
			const styles = tree.read('website/src/styles.css', 'utf8');
			expect(styles).toMatchSnapshot();
		});

		it('should add the gray theme styles to the global stylesheet', async () => {
			const project = readProjectConfiguration(tree, 'website');
			addThemeToApplicationStyles(tree, { theme: 'gray', project: 'website', addCdkStyles: true }, project);
			const styles = tree.read('website/src/styles.css', 'utf8');
			expect(styles).toMatchSnapshot();
		});

		it('should add the custom prefix to the theme styles', async () => {
			const project = readProjectConfiguration(tree, 'website');
			addThemeToApplicationStyles(
				tree,
				{ theme: 'zinc', project: 'website', addCdkStyles: true, prefix: 'theme-zinc' },
				project,
			);
			const styles = tree.read('website/src/styles.css', 'utf8');
			expect(styles).toContain('.theme-zinc');
		});
	});

	describe('Tailwind v4', () => {
		beforeEach(async () => {
			updateJson(tree, 'package.json', (json) => {
				json.devDependencies = {
					...json.devDependencies,
					tailwindcss: '^4.0.0',
				};
				return json;
			});

			tree.write('website/src/styles.css', '@import "tailwindcss";');
		});

		it('should add the Tailwind 4 preset global stylesheet', async () => {
			const project = readProjectConfiguration(tree, 'website');
			addThemeToApplicationStyles(tree, { theme: 'zinc', project: 'website', addCdkStyles: true }, project);
			const styles = tree.read('website/src/styles.css', 'utf8');
			expect(styles).toContain('@import "@spartan-ng/brain/hlm-tailwind-preset.css";');
		});

		it('should add the neutral theme styles to the global stylesheet', async () => {
			const project = readProjectConfiguration(tree, 'website');
			addThemeToApplicationStyles(tree, { theme: 'neutral', project: 'website', addCdkStyles: true }, project);
			const styles = tree.read('website/src/styles.css', 'utf8');
			expect(styles).toMatchSnapshot();
		});

		it('should add the zinc theme styles to the global stylesheet', async () => {
			const project = readProjectConfiguration(tree, 'website');
			addThemeToApplicationStyles(tree, { theme: 'zinc', project: 'website', addCdkStyles: true }, project);
			const styles = tree.read('website/src/styles.css', 'utf8');
			expect(styles).toMatchSnapshot();
		});

		it('should add the slate theme styles to the global stylesheet', async () => {
			const project = readProjectConfiguration(tree, 'website');
			addThemeToApplicationStyles(tree, { theme: 'slate', project: 'website', addCdkStyles: true }, project);
			const styles = tree.read('website/src/styles.css', 'utf8');
			expect(styles).toMatchSnapshot();
		});

		it('should add the stone theme styles to the global stylesheet', async () => {
			const project = readProjectConfiguration(tree, 'website');
			addThemeToApplicationStyles(tree, { theme: 'stone', project: 'website', addCdkStyles: true }, project);
			const styles = tree.read('website/src/styles.css', 'utf8');
			expect(styles).toMatchSnapshot();
		});

		it('should add the gray theme styles to the global stylesheet', async () => {
			const project = readProjectConfiguration(tree, 'website');
			addThemeToApplicationStyles(tree, { theme: 'gray', project: 'website', addCdkStyles: true }, project);
			const styles = tree.read('website/src/styles.css', 'utf8');
			expect(styles).toMatchSnapshot();
		});

		it('should add the custom prefix to the theme styles', async () => {
			const project = readProjectConfiguration(tree, 'website');
			addThemeToApplicationStyles(
				tree,
				{ theme: 'zinc', project: 'website', addCdkStyles: true, prefix: 'theme-zinc' },
				project,
			);
			const styles = tree.read('website/src/styles.css', 'utf8');
			expect(styles).toContain('.theme-zinc');
		});
	});
});
