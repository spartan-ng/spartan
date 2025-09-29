import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateHlmGenerator } from './generator';

import { getOrCreateConfig } from '../../utils/config';
import { createPrimitiveLibraries } from '../ui/generator';

// patch some imports to avoid running the actual code
jest.mock('enquirer');
jest.mock('@nx/devkit', () => {
	const original = jest.requireActual('@nx/devkit');
	return {
		...original,
		ensurePackage: (pkg: string) => jest.requireActual(pkg),
		createProjectGraphAsync: jest.fn().mockResolvedValue({
			nodes: {},
			dependencies: {},
		}),
	};
});

jest.mock('../ui/generator', () => ({
	createPrimitiveLibraries: jest.fn(),
}));
jest.mock('../../utils/config', () => ({
	getOrCreateConfig: jest.fn().mockResolvedValue({}),
}));

describe('migrate-hlm', () => {
	describe('migrate-hlm generator (imports)', () => {
		let tree: Tree;

		beforeEach(async () => {
			tree = createTreeWithEmptyWorkspace();

			await applicationGenerator(tree, {
				name: 'app',
				directory: 'app',
				skipFormat: true,
				e2eTestRunner: E2eTestRunner.None,
				unitTestRunner: UnitTestRunner.None,
				skipPackageJson: true,
				skipTests: true,
			});
		});

		it('should move hlm when it is the only import', async () => {
			tree.write(
				'app/src/app/button.ts',
				`
        import { hlm } from '@spartan-ng/brain/core';
      `,
			);

			await migrateHlmGenerator(tree, { skipFormat: true, angularCli: false });

			const content = tree.read('app/src/app/button.ts', 'utf-8');

			expect(content).toContain(`import { hlm } from '@spartan-ng/helm/utils';`);
			expect(content).not.toContain(`import { hlm } from '@spartan-ng/brain/core';`);
		});

		it('should remove hlm but keep other imports', async () => {
			tree.write(
				'app/src/app/button.ts',
				`
        import { hlm, somethingElse } from '@spartan-ng/brain/core';
      `,
			);

			await migrateHlmGenerator(tree, { skipFormat: true, angularCli: false });

			const content = tree.read('app/src/app/button.ts', 'utf-8');

			expect(content).toContain(`import { somethingElse } from '@spartan-ng/brain/core';`);
			expect(content).toContain(`import { hlm } from '@spartan-ng/helm/utils';`);
		});

		it('should keep import if hlm is not present', async () => {
			tree.write(
				'app/src/app/button.ts',
				`
        import { somethingElse } from '@spartan-ng/brain/core';
      `,
			);

			await migrateHlmGenerator(tree, { skipFormat: true, angularCli: false });

			const content = tree.read('app/src/app/button.ts', 'utf-8');

			expect(content).toContain(`import { somethingElse } from '@spartan-ng/brain/core';`);
			expect(content).not.toContain(`import { hlm } from '@spartan-ng/helm/utils';`);
		});

		it('should handle hlm in the middle of imports', async () => {
			tree.write(
				'app/src/app/button.ts',
				`
        import { one, hlm, two } from '@spartan-ng/brain/core';
      `,
			);

			await migrateHlmGenerator(tree, { skipFormat: true, angularCli: false });

			const content = tree.read('app/src/app/button.ts', 'utf-8');

			expect(content).toContain(`import { one, two } from '@spartan-ng/brain/core';`);
			expect(content).toContain(`import { hlm } from '@spartan-ng/helm/utils';`);
		});

		it('should handle multiple import statements', async () => {
			tree.write(
				'app/src/app/button.ts',
				`
        import { hlm } from '@spartan-ng/brain/core';
        import { foo } from './foo';
        import { hlm, bar } from '@spartan-ng/brain/core';
      `,
			);

			await migrateHlmGenerator(tree, { skipFormat: true, angularCli: false });

			const content = tree.read('app/src/app/button.ts', 'utf-8');

			expect(content).toContain(`import { foo } from './foo';`);
			expect(content).toContain(`import { bar } from '@spartan-ng/brain/core';`);
			expect(content.match(/import { hlm } from '@spartan-ng\/helm\/utils';/g)).toHaveLength(2);
		});
	});

	describe('migrate-hlm generator (utils generation)', () => {
		let tree: Tree;

		beforeEach(() => {
			tree = createTreeWithEmptyWorkspace();
			jest.clearAllMocks();
		});

		it('should not generate utils if path already exists in tsconfig.base.json', async () => {
			tree.write(
				'tsconfig.base.json',
				JSON.stringify({
					compilerOptions: {
						paths: {
							'@spartan-ng/helm/utils': ['libs/helm-utils/src/index.ts'],
						},
					},
				}),
			);

			await migrateHlmGenerator(tree, { skipFormat: true, angularCli: false });

			expect(createPrimitiveLibraries).not.toHaveBeenCalled();
		});

		it('should generate utils if not present in tsconfig.base.json', async () => {
			tree.write(
				'tsconfig.base.json',
				JSON.stringify({
					compilerOptions: {
						paths: {},
					},
				}),
			);

			await migrateHlmGenerator(tree, { skipFormat: true, angularCli: false });

			expect(getOrCreateConfig).toHaveBeenCalled();
			expect(createPrimitiveLibraries).toHaveBeenCalledWith(
				{ primitives: ['utils'] },
				expect.any(Array),
				expect.any(Object),
				tree,
				{ angularCli: false, installPeerDependencies: true },
				{},
			);
		});

		it('should generate utils if not present in tsconfig.json', async () => {
			tree.write(
				'tsconfig.json',
				JSON.stringify({
					compilerOptions: {
						paths: {},
					},
				}),
			);

			await migrateHlmGenerator(tree, { skipFormat: true, angularCli: true });

			expect(createPrimitiveLibraries).toHaveBeenCalled();
			expect(createPrimitiveLibraries).toHaveBeenCalledWith(
				expect.anything(),
				expect.anything(),
				expect.anything(),
				tree,
				expect.objectContaining({ angularCli: true }),
				expect.anything(),
			);
		});
	});
});
