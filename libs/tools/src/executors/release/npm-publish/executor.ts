import type { ExecutorContext } from '@nx/devkit';
import { execSync } from 'node:child_process';

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

	const sourceRoot = `./dist/${getRoot(context)}`;

	console.log('running npm publish at ' + sourceRoot);

	execSync(`cd ${sourceRoot} && npm publish${tag ? ` --tag ${tag}` : ''}`);
	return {
		success: true,
	};
}
