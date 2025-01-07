const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('node:path');

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class', '[data-mode="dark"]'],
	presets: [require('../../../libs/brain/hlm-tailwind-preset.js')],
	content: [join(__dirname, '../**/!(*.spec).{ts,html}'), ...createGlobPatternsForDependencies(__dirname)],
	theme: {
		extend: {},
	},
	plugins: [],
};
