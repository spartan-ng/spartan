import type { ProjectConfiguration, Tree } from '@nx/devkit';
import { prompt } from 'enquirer';
import { getProjectsAndNames } from '../../utils/get-project-names';
import { addThemeToApplicationStyles } from './libs/add-theme-to-application-styles';
import { ThemeName, themeNames } from './libs/colors';

export default async function addThemeToApplicationGenerator(tree: Tree) {
	const { projects, projectNames } = getProjectsAndNames(tree);

	const response: { app: string } = await prompt({
		type: 'select',
		required: true,
		name: 'app',
		message: 'Choose which application you want to add the theme to:',
		choices: projectNames,
	});
	const project: ProjectConfiguration | undefined = projects.get(response.app);

	if (!project) return;

	const themeOptions: {
		theme: ThemeName;
		addCdkStyles: boolean;
		stylesEntryPoint?: string;
		prefix?: string;
	} = await prompt([
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

	addThemeToApplicationStyles(
		tree,
		{
			project: project.name,
			theme: themeOptions.theme,
			addCdkStyles: themeOptions.addCdkStyles,
			stylesEntryPoint: themeOptions.stylesEntryPoint,
			prefix: themeOptions.prefix,
		},
		project,
	);
}
