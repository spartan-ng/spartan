const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('node:path');

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	presets: [require('../../libs/brain/hlm-tailwind-preset.js')],
	content: [
		join(__dirname, 'index.html'),
		join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
		...createGlobPatternsForDependencies(__dirname),
	],
};
