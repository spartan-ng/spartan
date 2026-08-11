import { withThemeByClassName } from '@storybook/addon-themes';

export const decorators = [
	withThemeByClassName({
		themes: {
			light: 'light style-nova style-pdp',
			dark: 'dark style-nova style-pdp',
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
