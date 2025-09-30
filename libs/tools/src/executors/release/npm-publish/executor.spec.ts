import type { ExecutorContext } from '@nx/devkit';
import * as child_process from 'node:child_process';
import * as process from 'node:process';
import * as projectHelpers from '../helpers/projects.helpers';
import executor from './executor';

// Mock the entire child_process module
jest.mock('node:child_process', () => ({
	execSync: jest.fn(), // Mock execSync function
}));

describe('NpmPublish Executor', () => {
	it('should execSync with a default libPath if no libPath was provided', async () => {
		const mockRoot = 'libs/my-domain/foo';
		const context = {} as unknown as ExecutorContext;

		// Mock the getRoot helper
		jest.spyOn(projectHelpers, 'getRoot').mockReturnValue(mockRoot);

		// Set the environment variable for TAG
		process.env.TAG = 'next';

		// Expected command that should be executed
		const expectedCommand = `cd ./dist/${mockRoot} && npm publish --tag next`;

		// Call the executor
		const output = await executor({}, context);

		// Check if execSync was called with the expected command
		expect(child_process.execSync).toHaveBeenCalledWith(expectedCommand);
		expect(output.success).toBe(true);
	});
});
