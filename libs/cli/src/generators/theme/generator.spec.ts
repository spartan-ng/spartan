import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import { readProjectConfiguration, type Tree, updateJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from 'nx/src/devkit-testing-exports';
import addThemeToApplicationGenerator from './generator';
import { addThemeToApplicationStyles } from './libs/add-theme-to-application-styles';
import type { ThemeName } from './libs/colors';

jest.mock('enquirer');
jest.mock('@nx/devkit', () => {
	const original = jest.requireActual('@nx/devkit');
	return {
		...original,
		ensurePackage: (pkg: string) => jest.requireActual(pkg),
		createProjectGraphAsync: jest.fn().mockResolvedValue({
			nodes: {},
			dependencies: {},
		}),
		addDependenciesToPackageJson: jest.fn(original.addDependenciesToPackageJson),
	};
});

describe('Theme generator', () => {
	let tree: Tree;

	beforeEach(async () => {
		tree = createTreeWithEmptyWorkspace();
		await applicationGenerator(tree, {
			name: 'website',
			directory: 'website',
			skipFormat: true,
			e2eTestRunner: E2eTestRunner.None,
			unitTestRunner: UnitTestRunner.None,
			skipPackageJson: true,
			skipTests: true,
		});

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
		await addThemeToApplicationStyles(tree, { theme: 'zinc', project: 'website', addCdkStyles: true }, project);
		const styles = tree.read('website/src/styles.css', 'utf8');
		expect(styles).toContain('@import "@spartan-ng/brain/hlm-tailwind-preset.css";');
	});

	it('should add the neutral theme styles to the global stylesheet', async () => {
		const project = readProjectConfiguration(tree, 'website');
		await addThemeToApplicationStyles(tree, { theme: 'neutral', project: 'website', addCdkStyles: true }, project);
		const styles = tree.read('website/src/styles.css', 'utf8');
		expect(styles).toMatchSnapshot();
	});

	it('should add the zinc theme styles to the global stylesheet', async () => {
		const project = readProjectConfiguration(tree, 'website');
		await addThemeToApplicationStyles(tree, { theme: 'zinc', project: 'website', addCdkStyles: true }, project);
		const styles = tree.read('website/src/styles.css', 'utf8');
		expect(styles).toMatchSnapshot();
	});

	it('should add the slate theme styles to the global stylesheet', async () => {
		const project = readProjectConfiguration(tree, 'website');
		await addThemeToApplicationStyles(tree, { theme: 'slate', project: 'website', addCdkStyles: true }, project);
		const styles = tree.read('website/src/styles.css', 'utf8');
		expect(styles).toMatchSnapshot();
	});

	it('should add the stone theme styles to the global stylesheet', async () => {
		const project = readProjectConfiguration(tree, 'website');
		await addThemeToApplicationStyles(tree, { theme: 'stone', project: 'website', addCdkStyles: true }, project);
		const styles = tree.read('website/src/styles.css', 'utf8');
		expect(styles).toMatchSnapshot();
	});

	it('should add the gray theme styles to the global stylesheet', async () => {
		const project = readProjectConfiguration(tree, 'website');
		await addThemeToApplicationStyles(tree, { theme: 'gray', project: 'website', addCdkStyles: true }, project);
		const styles = tree.read('website/src/styles.css', 'utf8');
		expect(styles).toMatchSnapshot();
	});

	it('should add the custom prefix to the theme styles', async () => {
		const project = readProjectConfiguration(tree, 'website');
		await addThemeToApplicationStyles(
			tree,
			{ theme: 'zinc', project: 'website', addCdkStyles: true, prefix: 'theme-zinc' },
			project,
		);
		const styles = tree.read('website/src/styles.css', 'utf8');
		expect(styles).toContain('.theme-zinc');
	});
});

describe('addThemeToApplicationGenerator (non-interactive)', () => {
	let tree: Tree;

	const addApp = (name: string) =>
		applicationGenerator(tree, {
			name,
			directory: name,
			skipFormat: true,
			e2eTestRunner: E2eTestRunner.None,
			unitTestRunner: UnitTestRunner.None,
			skipPackageJson: true,
			skipTests: true,
		});

	beforeEach(async () => {
		jest.clearAllMocks();
		tree = createTreeWithEmptyWorkspace();
		await addApp('website');
		updateJson(tree, 'package.json', (json) => {
			json.devDependencies = { ...json.devDependencies, tailwindcss: '^4.0.0' };
			return json;
		});
		tree.write('website/src/styles.css', '@import "tailwindcss";');
	});

	// Non-interactive mode must not prompt. We assert that indirectly: a stray prompt would (under the
	// enquirer mock) resolve the theme to undefined and no theme variables would be written.
	it('applies the theme when a theme and project are provided', async () => {
		await addThemeToApplicationGenerator(tree, { theme: 'zinc', project: 'website' });
		expect(tree.read('website/src/styles.css', 'utf8')).toContain('--background');
	});

	it('auto-selects the only application when no project is given', async () => {
		await addThemeToApplicationGenerator(tree, { theme: 'zinc' });
		expect(tree.read('website/src/styles.css', 'utf8')).toContain('--background');
	});

	it('throws on an invalid theme', async () => {
		await expect(
			addThemeToApplicationGenerator(tree, { theme: 'not-a-theme' as unknown as ThemeName, project: 'website' }),
		).rejects.toThrow(/not valid/);
	});

	it('throws on an unknown project', async () => {
		await expect(addThemeToApplicationGenerator(tree, { theme: 'zinc', project: 'ghost' })).rejects.toThrow(
			/not an application/,
		);
	});

	it('throws when multiple applications exist and no project is given', async () => {
		await addApp('second');
		await expect(addThemeToApplicationGenerator(tree, { theme: 'zinc' })).rejects.toThrow(/Could not determine/);
	});
});
