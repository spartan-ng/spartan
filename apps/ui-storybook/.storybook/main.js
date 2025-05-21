const config = {
	stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
	addons: ['@storybook/addon-essentials', '@storybook/addon-a11y', '@storybook/addon-themes'],

	framework: {
		name: '@storybook/angular',
		options: {},
	},

	//👈 Configures the static asset folder in Storybook
	staticDirs: ['../public'],

	docs: {},
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/packages/storybook/documents/custom-builder-configs
