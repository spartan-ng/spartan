const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../eslint.config.cjs');

// The charts library is a vendored port (from ng-primitives-charts). It is intentionally NOT held to
// spartan's internal authoring conventions (explicit member accessibility, leading-underscore naming,
// metadata key order, inline-style ban), which would require rewriting ~10k lines for zero behavioural
// gain. We keep the genuinely useful checks (correctness, unused vars, template safety) and relax the
// cosmetic ones for this project only.
module.exports = [
	...baseConfig,
	...nx.configs['flat/angular'],
	...nx.configs['flat/angular-template'],
	{
		files: ['**/*.ts'],
		rules: {
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'spn',
					style: 'camelCase',
				},
			],
			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'spn',
					style: 'kebab-case',
				},
			],
			// Relaxed for the vendored port (see file header).
			'@typescript-eslint/explicit-member-accessibility': 'off',
			'@typescript-eslint/naming-convention': 'off',
			'@nx/workspace-component-directive-key-order': 'off',
			'@nx/workspace-avoid-component-styles': 'off',
			'@angular-eslint/component-class-suffix': 'off',
			'@angular-eslint/directive-class-suffix': 'off',
			'@angular-eslint/no-input-rename': 'off',
			'@angular-eslint/no-output-rename': 'off',
			'@angular-eslint/prefer-on-push-component-change-detection': 'off',
			'@angular-eslint/prefer-signals': 'off',
		},
	},
	{
		files: ['**/*.html'],
		rules: {
			'@angular-eslint/template/click-events-have-key-events': 'off',
			'@angular-eslint/template/interactive-supports-focus': 'off',
			'@angular-eslint/template/label-has-associated-control': 'off',
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
						'{projectRoot}/vite.config.{ts,mts}',
						'{projectRoot}/**/*.spec.ts',
					],
				},
			],
		},
		languageOptions: {
			parser: require('jsonc-eslint-parser'),
		},
	},
];
