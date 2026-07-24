import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateBrnInputOtpMaxLength } from './generator';

// patch some imports to avoid running the actual code
vi.mock('enquirer');
vi.mock('@nx/devkit', async (importOriginal) => {
	const original = await importOriginal<typeof import('@nx/devkit')>();
	return {
		...original,
		ensurePackage: (pkg: string) => require(pkg),
		createProjectGraphAsync: vi.fn().mockResolvedValue({
			nodes: {},
			dependencies: {},
		}),
	};
});

describe('migrate-brn-input-otp-max-length generator', () => {
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

	it('should rename maxLength to length on brn-input-otp elements', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`
				<brn-input-otp [maxLength]="6"></brn-input-otp>
				<brn-input-otp maxLength="6"></brn-input-otp>
				<!-- This is not a brn-input-otp, so it should not be changed -->
				<input [maxLength]="6" />
			`,
		);

		await migrateBrnInputOtpMaxLength(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toBe(`
				<brn-input-otp [length]="6"></brn-input-otp>
				<brn-input-otp length="6"></brn-input-otp>
				<!-- This is not a brn-input-otp, so it should not be changed -->
				<input [maxLength]="6" />
			`);
	});
});
