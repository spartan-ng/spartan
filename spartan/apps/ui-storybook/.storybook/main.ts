const config = {
	stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
	addons: ['@storybook/addon-themes'],

	framework: {
		name: '@storybook/angular',
		options: {},
	},
	//👈 Configures the static asset folder in Storybook
	staticDirs: ['../public'],
	docs: {},
};

export default config;
