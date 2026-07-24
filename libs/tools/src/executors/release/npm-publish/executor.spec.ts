import type { ExecutorContext } from '@nx/devkit';
import * as child_process from 'node:child_process';
import * as process from 'node:process';
import * as projectHelpers from '../helpers/projects.helpers';
import executor from './executor';

// Mock the entire child_process module
vi.mock('node:child_process', () => ({
	execFileSync: vi.fn(), // Mock execFileSync function
}));

describe('NpmPublish Executor', () => {
	it('should publish from the project dist using the TAG as the dist-tag', async () => {
		const mockRoot = 'libs/my-domain/foo';
		const context = {} as unknown as ExecutorContext;

		// Mock the getRoot helper
		vi.spyOn(projectHelpers, 'getRoot').mockReturnValue(mockRoot);

		// Set the environment variable for TAG
		process.env.TAG = 'next';

		// Call the executor
		const output = await executor({}, context);

		// Check if execFileSync was called without a shell, passing the tag as an argument
		expect(child_process.execFileSync).toHaveBeenCalledWith('npm', ['publish', '--tag', 'next'], {
			cwd: `./dist/${mockRoot}`,
		});
		expect(output.success).toBe(true);
	});
});
