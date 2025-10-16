import type { ExecutorContext } from '@nx/devkit';
import { execSync } from 'node:child_process';

import { getProjectName } from '../helpers/projects.helpers';
import npmPublish from '../npm-publish/executor';

import type { BuildUpdatePublishExecutorSchema } from './schema';

export default async function runExecutor(_options: BuildUpdatePublishExecutorSchema, context: ExecutorContext) {
	execSync(`nx build --project ${getProjectName(context)}`);

	await npmPublish({}, context);

	return {
		success: true,
	};
}
