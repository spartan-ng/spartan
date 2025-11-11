import { withThemeByClassName } from '@storybook/addon-themes';

export const decorators = [
	withThemeByClassName({
		themes: {
			light: 'light',
			dark: 'dark',
		},
		defaultTheme: 'light',
	}),
];

const preview = {
	decorators,

	parameters: {
		options: {
			storySort: {
				method: 'alphabetical',
			},
		},
	},

	tags: ['autodocs'],
};

export default preview;
