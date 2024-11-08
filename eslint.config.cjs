const { FlatCompat } = require('@eslint/eslintrc');
const nxEslintPlugin = require('@nx/eslint-plugin');
const js = require('@eslint/js');

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
});

module.exports = [
	{ plugins: { '@nx': nxEslintPlugin } },
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		rules: {
			'@nx/enforce-module-boundaries': [
				'error',
				{
					enforceBuildableLibDependency: true,
					allowCircularSelfDependency: true,
					allow: [],
					depConstraints: [
						{
							sourceTag: '*',
							onlyDependOnLibsWithTags: ['*'],
						},
					],
				},
			],
		},
	},
	...compat.config({ extends: ['plugin:@nx/typescript'] }).map((config) => ({
		...config,
		files: ['**/*.ts', '**/*.tsx'],
		rules: {},
	})),
	...compat.config({ extends: ['plugin:@nx/javascript'] }).map((config) => ({
		...config,
		files: ['**/*.js', '**/*.jsx'],
		rules: {},
	})),
	...compat.config({ env: { jest: true } }).map((config) => ({
		...config,
		files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
		rules: {},
	})),
	...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
		...config,
		files: ['**/*.json'],
		rules: {
			'@nx/dependency-checks': [
				'warn',
				{
					buildTargets: ['build'],
					checkMissingDependencies: true,
					checkObsoleteDependencies: true,
					checkVersionMismatches: true,
					ignoredDependencies: [
						'jest-preset-angular',
						'jest-axe',
						'@testing-library/jest-dom',
						'rxjs',
						'@spartan-ng/ui-icon-helm',
						'@spartan-ng/ui-button-helm',
						'@spartan-ng/ui-avatar-brain',
					],
				},
			],
		},
	})),
];
