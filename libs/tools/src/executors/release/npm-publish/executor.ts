import type { ExecutorContext } from '@nx/devkit';
import { execFileSync } from 'node:child_process';

import { getRoot } from '../helpers/projects.helpers';

import * as process from 'node:process';
import type { NpmPublishExecutorSchema } from './schema';

export default async function runExecutor(_options: NpmPublishExecutorSchema, context: ExecutorContext) {
	const tag = process.env.TAG;

	if (!tag) {
		console.error(
			'npm-publish: the TAG environment variable is not set; skipping publish. Set TAG (e.g. "nightly" or "latest") to publish.',
		);
		return {
			success: false,
		};
	}

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
