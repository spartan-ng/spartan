import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import { readProjectConfiguration, type Tree, updateJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import addThemeToApplicationGenerator from './generator';
import { addThemeToApplicationStyles } from './libs/add-theme-to-application-styles';
import type { ThemeName } from './libs/colors';

vi.mock('enquirer');
vi.mock('@nx/devkit', async (importOriginal) => {
	const original = await importOriginal<typeof import('@nx/devkit')>();
	return {
		...original,
		ensurePackage: (pkg: string) => require(pkg),
		createProjectGraphAsync: vi.fn().mockResolvedValue({
			nodes: {},
			dependencies: {},
		}),
		addDependenciesToPackageJson: vi.fn(original.addDependenciesToPackageJson),
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
		await addThemeToApplicationStyles(tree, { theme: 'zinc', project: 'website' }, project);
		const styles = tree.read('website/src/styles.css', 'utf8');
		expect(styles).toContain('@import "@spartan-ng/brain/hlm-tailwind-preset.css";');
	});

	it('places the preset import after existing imports but before other rules', async () => {
		const project = readProjectConfiguration(tree, 'website');
		tree.write('website/src/styles.css', '@import "tailwindcss";\nbody {\n  margin: 0;\n}\n');
		await addThemeToApplicationStyles(tree, { theme: 'zinc', project: 'website' }, project);
		const styles = tree.read('website/src/styles.css', 'utf8') ?? '';

		const tailwindIdx = styles.indexOf('@import "tailwindcss"');
		const presetIdx = styles.indexOf('@import "@spartan-ng/brain/hlm-tailwind-preset.css"');
		const firstRuleIdx = styles.indexOf('body {');

		// An `@import` after a normal rule is invalid CSS and ignored, so the preset import must come
		// after the existing imports (Tailwind stays first) and before the first style rule.
		expect(tailwindIdx).toBeGreaterThanOrEqual(0);
		expect(presetIdx).toBeGreaterThan(tailwindIdx);
		expect(firstRuleIdx).toBeGreaterThan(presetIdx);
	});

	it('should add the neutral theme styles to the global stylesheet', async () => {
		const project = readProjectConfiguration(tree, 'website');
		await addThemeToApplicationStyles(tree, { theme: 'neutral', project: 'website' }, project);
		const styles = tree.read('website/src/styles.css', 'utf8');
		expect(styles).toMatchSnapshot();
	});

	it('should add the zinc theme styles to the global stylesheet', async () => {
		const project = readProjectConfiguration(tree, 'website');
		await addThemeToApplicationStyles(tree, { theme: 'zinc', project: 'website' }, project);
		const styles = tree.read('website/src/styles.css', 'utf8');
		expect(styles).toMatchSnapshot();
	});

	it('should add the slate theme styles to the global stylesheet', async () => {
		const project = readProjectConfiguration(tree, 'website');
		await addThemeToApplicationStyles(tree, { theme: 'slate', project: 'website' }, project);
		const styles = tree.read('website/src/styles.css', 'utf8');
		expect(styles).toMatchSnapshot();
	});

	it('should add the stone theme styles to the global stylesheet', async () => {
		const project = readProjectConfiguration(tree, 'website');
		await addThemeToApplicationStyles(tree, { theme: 'stone', project: 'website' }, project);
		const styles = tree.read('website/src/styles.css', 'utf8');
		expect(styles).toMatchSnapshot();
	});

	it('should add the gray theme styles to the global stylesheet', async () => {
		const project = readProjectConfiguration(tree, 'website');
		await addThemeToApplicationStyles(tree, { theme: 'gray', project: 'website' }, project);
		const styles = tree.read('website/src/styles.css', 'utf8');
		expect(styles).toMatchSnapshot();
	});

	it('should add the custom prefix to the theme styles', async () => {
		const project = readProjectConfiguration(tree, 'website');
		await addThemeToApplicationStyles(tree, { theme: 'zinc', project: 'website', prefix: 'theme-zinc' }, project);
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
		vi.clearAllMocks();
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
