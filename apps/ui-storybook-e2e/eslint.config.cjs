const { FlatCompat } = require('@eslint/eslintrc');
const baseConfig = require('../../eslint.config.cjs');
const js = require('@eslint/js');

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
});

module.exports = [
	...baseConfig,
	...compat.extends('plugin:cypress/recommended'),
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		rules: {},
	},
];
