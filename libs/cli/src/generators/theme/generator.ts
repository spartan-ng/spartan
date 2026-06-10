import type { ProjectConfiguration, Tree } from '@nx/devkit';
import { prompt } from 'enquirer';
import { getProjectsAndNames } from '../../utils/get-project-names';
import { addThemeToApplicationStyles } from './libs/add-theme-to-application-styles';
import { type ThemeName, themeNames } from './libs/colors';
import type { HlmThemeGeneratorSchema } from './schema';

export default async function addThemeToApplicationGenerator(tree: Tree, options: HlmThemeGeneratorSchema = {}) {
	const setupTailwindCss = options.setupTailwindCss ?? true;
	// Passing a theme opts into non-interactive mode: every remaining answer falls back to a sensible
	// default (auto-detected styles entry point, global theme) instead of prompting. This lets the CLI be
	// driven by flags (`ng g @spartan-ng/cli:ui-theme --theme=zinc`) and scripted in CI.
	const nonInteractive = !!options.theme;

	const { projects, projectNames } = getProjectsAndNames(tree);

	let app = options.project;
	if (app && !projectNames.includes(app)) {
		throw new Error(
			`The provided project "${app}" is not an application in this workspace. Choose one of: ${projectNames.join(', ')}.`,
		);
	}
	if (!app) {
		if (nonInteractive) {
			if (projectNames.length === 1) {
				app = projectNames[0];
			} else {
				throw new Error(
					`Could not determine which application to add the theme to. Pass "--project" to choose one of: ${projectNames.join(
						', ',
					)}.`,
				);
			}
		} else {
			const response: { app: string } = await prompt({
				type: 'select',
				required: true,
				name: 'app',
				message: 'Choose which application you want to add the theme to:',
				choices: projectNames,
			});
			app = response.app;
		}
	}

	const project: ProjectConfiguration | undefined = projects.get(app);
	if (!project) return;

	let theme = options.theme;
	if (theme && !themeNames.includes(theme)) {
		throw new Error(`The provided theme "${theme}" is not valid. Valid themes are: ${themeNames.join(', ')}.`);
	}

	let stylesEntryPoint = options.stylesEntryPoint;
	let prefix = options.prefix;

	if (!nonInteractive) {
		const answers: { theme?: ThemeName; stylesEntryPoint?: string; prefix?: string } = await prompt([
			{
				type: 'select',
				required: true,
				name: 'theme',
				message:
					'Choose which theme to apply. You can always re-run this generator and add a custom prefix to add other themes.',
				choices: themeNames,
			},
			{
				type: 'input',
				name: 'stylesEntryPoint',
				message:
					"Path to the styles entry point relative to the workspace root. If not provided the generator will do its best to find it and it will error if it can't.",
			},
			{
				type: 'input',
				name: 'prefix',
				message:
					"Prefix class name applied to your theme's style definitions: e.g., theme-zinc. Leave empty for global theme.",
			},
		]);

		theme = answers.theme;
		stylesEntryPoint = answers.stylesEntryPoint;
		prefix = answers.prefix;
	}

	await addThemeToApplicationStyles(
		tree,
		{
			setupTailwindCss,
			project: project.name,
			theme: theme as ThemeName,
			stylesEntryPoint,
			prefix,
			acceptTailwindV3: options.acceptTailwindV3 ?? nonInteractive,
		},
		project,
	);
}
