// semantic-release drives versioning, changelog, npm publish and GitHub Releases.
//
// Branch -> channel -> npm dist-tag:
//   main  -> (stable) -> latest
//   beta  -> beta      -> beta
//   alpha -> alpha     -> alpha
//
// The actual build + npm publish is delegated to our nx executors via the exec plugin
// (publishCmd -> `pnpm run release`), because we publish three packages (brain, cli, mcp)
// in lockstep off a single computed version. The version is fanned out into every
// package.json and the CLI's generated files by `pnpm run pre-manual-release`, which
// reads the VERSION env var.

const conventionalConfig = {
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
};

export default {
	branches: ['main', { name: 'beta', prerelease: true }, { name: 'alpha', prerelease: true }],
	plugins: [
		[
			'@semantic-release/commit-analyzer',
			{
				...conventionalConfig,
				releaseRules: [{ type: 'refactor', release: 'patch' }],
			},
		],
		['@semantic-release/release-notes-generator', conventionalConfig],
		['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
		[
			'@semantic-release/exec',
			{
				// Fan the computed version out into every package.json + the CLI's generated files.
				prepareCmd: 'VERSION=${nextRelease.version} pnpm run pre-manual-release',
				// Build + publish brain/cli/mcp. TAG is the channel (empty on main -> defaults to "latest").
				publishCmd: 'TAG=${nextRelease.channel} pnpm run release',
			},
		],
		[
			'@semantic-release/git',
			{
				assets: [
					'libs/brain/package.json',
					'libs/cli/package.json',
					'libs/mcp/package.json',
					'libs/cli/src/generators/base/versions.ts',
					'libs/cli/src/generators/ui/**',
					'CHANGELOG.md',
				],
				message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
			},
		],
		'@semantic-release/github',
	],
};
