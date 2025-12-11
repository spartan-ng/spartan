const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../eslint.config.cjs');

module.exports = [
	...baseConfig,
	{
		files: ['**/*.json'],
		rules: {
			'@nx/dependency-checks': [
				'error',
				{
					ignoredFiles: ['{projectRoot}/eslint.config.{js,cjs,mjs}'],
					ignoredDependencies: [
						'@angular/common',
						'@angular/core',
						'@trpc/client',
						'@trpc/server',
						'isomorphic-fetch',
						'superjson',
					],
				},
			],
		},
		languageOptions: {
			parser: require('jsonc-eslint-parser'),
		},
	},
	...nx.configs['flat/angular'],
	...nx.configs['flat/angular-template'],
	{
		files: ['**/*.ts'],
		rules: {
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'spartan-ng',
					style: 'camelCase',
				},
			],
			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'spartan-ng',
					style: 'kebab-case',
				},
			],
		},
	},
	{
		files: ['**/*.html'],
		// Override or add rules here
		rules: {},
	},
];
