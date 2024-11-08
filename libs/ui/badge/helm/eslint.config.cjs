const { FlatCompat } = require('@eslint/eslintrc');
const baseConfig = require('../../../../eslint.config.cjs');
const js = require('@eslint/js');

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
});

module.exports = [
	...baseConfig,
	...compat
		.config({ extends: ['plugin:@nx/angular', 'plugin:@angular-eslint/template/process-inline-templates'] })
		.map((config) => ({
			...config,
			files: ['**/*.ts'],
			rules: {
				'@angular-eslint/no-host-metadata-property': 0,
				'@angular-eslint/directive-selector': [
					'error',
					{
						type: 'attribute',
						prefix: 'hlm',
						style: 'camelCase',
					},
				],
				'@angular-eslint/component-selector': [
					'error',
					{
						type: 'element',
						prefix: 'hlm',
						style: 'kebab-case',
					},
				],
			},
		})),
	...compat.config({ extends: ['plugin:@nx/angular-template'] }).map((config) => ({
		...config,
		files: ['**/*.html'],
		rules: {},
	})),
];
