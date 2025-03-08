/* eslint-disable @typescript-eslint/no-require-imports */
const nx = require('@nx/eslint-plugin');

module.exports = [
	...nx.configs['flat/base'],
	...nx.configs['flat/typescript'],
	...nx.configs['flat/javascript'],
	{
		ignores: ['**/dist', '**/vite.config.ts', '**/vite.config.*.timestamp*', '**/vitest.config.*.timestamp*'],
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: process.cwd(),
			},
		},
		rules: {
			'@nx/enforce-module-boundaries': [
				'error',
				{
					enforceBuildableLibDependency: true,
					allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
					depConstraints: [
						{
							sourceTag: '*',
							onlyDependOnLibsWithTags: ['*'],
						},
					],
				},
			],
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					args: 'after-used',
					argsIgnorePattern: '^_',
					caughtErrors: 'none',
					caughtErrorsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					ignoreRestSiblings: true,
				},
			],
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-unused-expressions': 'off',
			'@typescript-eslint/prefer-readonly': 'error',
			'@typescript-eslint/explicit-member-accessibility': [
				'error',
				{
					overrides: {
						accessors: 'explicit',
						constructors: 'no-public',
						methods: 'off',
						properties: 'explicit',
						parameterProperties: 'off',
					},
				},
			],
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'classProperty',
					modifiers: ['private'],
					format: ['camelCase'],
					leadingUnderscore: 'require',
				},
				{
					selector: 'variable',
					format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
				},
			],
			'@angular-eslint/prefer-output-readonly': ['error'],
			// this should be enabled when we move to signals
			'@nx/workspace-prefer-signals': 'off',
			'@nx/workspace-prefer-rxjs-operator-compat': 'error',
		},
	},
	{
		files: ['**/*.spec.ts', '**/tests/**/*.ts'],
		// Override or add rules here
		rules: {
			'@nx/workspace-prefer-signals': 'off',
		},
	},
	{
		files: ['**/*.json'],
		rules: {
			'@nx/dependency-checks': [
				'error',
				{
					ignoredFiles: [
						'{projectRoot}/eslint.config.{js,cjs,mjs}',
						'{projectRoot}/**/test-setup.ts',
						'{projectRoot}/**/*.spec.ts',
						'{projectRoot}/**/*.stories.ts',
					],
				},
			],
		},
		languageOptions: {
			parser: require('jsonc-eslint-parser'),
		},
	},
];
