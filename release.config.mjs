export default {
	branches: ['main', { name: 'alpha', prerelease: true }],
	preset: 'conventionalcommits',
	presetConfig: {
		types: [
			{ type: 'feat', section: 'Features' },
			{ type: 'fix', section: 'Bug Fixes' },
			{ type: 'chore', section: 'Chores' },
			{ type: 'docs', hidden: true },
			{ type: 'style', hidden: true },
			{ type: 'refactor', section: 'Refactoring' },
			{ type: 'perf', hidden: true },
			{ type: 'test', hidden: true },
		],
	},
	releaseRules: [{ type: 'refactor', release: 'patch' }],
	plugins: [
		'@semantic-release/commit-analyzer',
		[
			'@semantic-release/changelog',
			{
				changelogFile: './CHANGELOG.md',
			},
		],
		[
			'@semantic-release/exec',
			{
				prepareCmd: 'TAG=latest,VERSION=${nextRelease.version} pnpm run pre-release',
				releaseCmd: 'TAG=latest,VERSION=${nextRelease.version} pnpm run release',
			},
		],
		[
			'@semantic-release/git',
			{
				assets: [
					'libs/cli/package.json',
					'libs/cli/src/generators/base/versions.ts',
					'libs/cli/src/generators/ui/supported-ui-libraries.json',
					'libs/ui/**/package.json',
					'CHANGELOG.md',
				],
				message: 'chore: release ${nextRelease.version} [skip ci]',
			},
		],
	],
};
