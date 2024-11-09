import { ExecutorContext } from '@nx/devkit';

import executor from './executor';
import { GenerateUiDocsExecutorSchema } from './schema';

const options: GenerateUiDocsExecutorSchema = {};
const context: ExecutorContext = {
	root: '',
	cwd: process.cwd(),
	isVerbose: false,
};

describe('GenerateUiDocs Executor', () => {
	it('can run', async () => {
		const output = await executor(options, context);
		expect(output.success).toBe(true);
	});
});
