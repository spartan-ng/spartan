import type { ExecutorContext } from '@nx/devkit';
import { getProjectName, getRoot } from './projects.helpers';

describe('executor project helper', () => {
	it('should return the project name', () => {
		const projectName = 'foo';
		expect(getProjectName({ projectName } as unknown as ExecutorContext)).toBe(projectName);
	});

	it('should get the root of the project', () => {
		const expectedRoot = 'libs/foo';
		const context = {
			projectName: 'foo',
			projectsConfigurations: {
				projects: {
					foo: {
						root: expectedRoot,
					},
				},
			},
		} as unknown as ExecutorContext;

		expect(getRoot(context)).toBe(expectedRoot);
	});
});
