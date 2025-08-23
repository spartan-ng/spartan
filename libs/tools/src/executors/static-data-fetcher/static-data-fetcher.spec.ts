import { ExecutorContext } from '@nx/devkit';

import { StaticDataFetcherExecutorSchema } from './schema';
import executor from './static-data-fetcher';

const options: StaticDataFetcherExecutorSchema = {};
const context: ExecutorContext = {
	root: '',
	cwd: process.cwd(),
	isVerbose: false,
	projectGraph: {
		nodes: {},
		dependencies: {},
	},
	projectsConfigurations: {
		projects: {},
		version: 2,
	},
	nxJsonConfiguration: {},
};

describe('StaticDataFetcher Executor', () => {
	it('can run', async () => {
		const output = await executor(options, context);
		expect(output.success).toBe(true);
	});
});
