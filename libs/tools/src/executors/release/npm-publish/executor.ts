import type { ExecutorContext } from '@nx/devkit';
import { execFileSync } from 'node:child_process';

import { getRoot } from '../helpers/projects.helpers';

import * as process from 'node:process';
import type { NpmPublishExecutorSchema } from './schema';

export default async function runExecutor(_options: NpmPublishExecutorSchema, context: ExecutorContext) {
	// semantic-release passes the channel as TAG: "beta"/"alpha" on prerelease branches, and an
	// empty string on the stable (main) channel, which maps to the default "latest" dist-tag.
	const tag = process.env.TAG?.trim() || 'latest';

	if (!/^[A-Za-z0-9._-]+$/.test(tag)) {
		throw new Error(
			`npm-publish: invalid TAG "${tag}". A dist-tag may only contain letters, numbers, dots, hyphens, and underscores.`,
		);
	}

	const sourceRoot = `./dist/${getRoot(context)}`;

	console.log('running npm publish at ' + sourceRoot);

	execFileSync('npm', ['publish', '--tag', tag], { cwd: sourceRoot });
	return {
		success: true,
	};
}
