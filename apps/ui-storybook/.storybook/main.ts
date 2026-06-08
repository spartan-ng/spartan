import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const config = {
	stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
	addons: [getAbsolutePath('@storybook/addon-themes')],

	framework: {
		name: getAbsolutePath('@storybook/angular'),
		options: {},
	},
	//👈 Configures the static asset folder in Storybook
	staticDirs: ['../public'],
	docs: {},
};

export default config;

function getAbsolutePath(value: string): any {
	return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
