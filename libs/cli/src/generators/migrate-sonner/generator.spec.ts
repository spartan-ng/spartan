import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import migrateSonnerGenerator from './generator';

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

describe('migrate-sonner generator', () => {
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

	it('should replace ngx-sonner imports with @spartan-ng/brain/sonner (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
							import { Component, signal } from '@angular/core';
							import { toast } from 'ngx-sonner';
		
							@Component({
								template: \`
									<button (click)="showToast()">Show Toast</button>
								\`
							})
							export class AppModule {
								showToast() {
									toast.success('Hello World!');
								}
							}
							`,
		);

		await migrateSonnerGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`import { toast } from 'ngx-sonner';`);
		expect(content).toContain(`import { toast } from '@spartan-ng/brain/sonner';`);
	});
});
