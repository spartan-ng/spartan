const { FlatCompat } = require('@eslint/eslintrc');
const baseConfig = require('../../eslint.config.cjs');
const js = require('@eslint/js');

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
});

module.exports = [
	...baseConfig,
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		rules: {},
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		rules: {},
	},
	{
		files: ['**/*.js', '**/*.jsx'],
		rules: {},
	},
	...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
		...config,
		files: ['./package.json', './executors.json'],
		rules: { '@nx/nx-plugin-checks': 'error' },
	})),
];
