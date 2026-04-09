import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateIconSelectorGenerator } from './generator';

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

describe('migrate-icon-selector generator', () => {
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

	describe('CSS selector replacement', () => {
		it('should replace [&_ng-icon] with [&_[hlmIcon]]', async () => {
			tree.write(
				'app/src/app/my-button.ts',
				`
				import { Directive } from '@angular/core';

				@Directive({
					host: {
						class: '[&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0',
					},
				})
				export class MyButton {}
				`,
			);

			await migrateIconSelectorGenerator(tree, { skipFormat: true });

			const content = tree.read('app/src/app/my-button.ts', 'utf-8');
			expect(content).toContain('[&_[hlmIcon]]:pointer-events-none');
			expect(content).toContain('[&_[hlmIcon]]:shrink-0');
			expect(content).not.toContain('[&_ng-icon]');
		});

		it('should replace [&>ng-icon] with [&>[hlmIcon]]', async () => {
			tree.write(
				'app/src/app/my-badge.ts',
				`
				import { Directive } from '@angular/core';

				@Directive({
					host: {
						class: '[&>ng-icon]:pointer-events-none',
					},
				})
				export class MyBadge {}
				`,
			);

			await migrateIconSelectorGenerator(tree, { skipFormat: true });

			const content = tree.read('app/src/app/my-badge.ts', 'utf-8');
			expect(content).toContain('[&>[hlmIcon]]:pointer-events-none');
		});

		it('should replace [&>_ng-icon] with [&>_[hlmIcon]]', async () => {
			tree.write(
				'app/src/app/my-sidebar.ts',
				`
				import { Directive } from '@angular/core';

				@Directive({
					host: {
						class: '[&>_ng-icon]:size-4 [&>_ng-icon]:shrink-0',
					},
				})
				export class MySidebar {}
				`,
			);

			await migrateIconSelectorGenerator(tree, { skipFormat: true });

			const content = tree.read('app/src/app/my-sidebar.ts', 'utf-8');
			expect(content).toContain('[&>_[hlmIcon]]:size-4');
			expect(content).toContain('[&>_[hlmIcon]]:shrink-0');
		});

		it('should replace has-[>ng-icon] with has-[>[hlmIcon]]', async () => {
			tree.write(
				'app/src/app/my-input.ts',
				`
				import { Directive } from '@angular/core';

				@Directive({
					host: {
						class: 'has-[>ng-icon]:px-2',
					},
				})
				export class MyInput {}
				`,
			);

			await migrateIconSelectorGenerator(tree, { skipFormat: true });

			const content = tree.read('app/src/app/my-input.ts', 'utf-8');
			expect(content).toContain('has-[>[hlmIcon]]:px-2');
		});

		it('should replace *:[ng-icon] with *:[[hlmIcon]]', async () => {
			tree.write(
				'app/src/app/my-dropdown.ts',
				`
				import { Directive } from '@angular/core';

				@Directive({
					host: {
						class: 'data-[variant=destructive]:*:[ng-icon]:!text-destructive',
					},
				})
				export class MyDropdown {}
				`,
			);

			await migrateIconSelectorGenerator(tree, { skipFormat: true });

			const content = tree.read('app/src/app/my-dropdown.ts', 'utf-8');
			expect(content).toContain('data-[variant=destructive]:*:[[hlmIcon]]:!text-destructive');
		});

		it('should replace group-has-[>ng-icon] with group-has-[>[hlmIcon]]', async () => {
			tree.write(
				'app/src/app/my-alert.ts',
				`
				import { Directive } from '@angular/core';

				@Directive({
					host: {
						class: 'group-has-[>ng-icon]/alert:col-start-2',
					},
				})
				export class MyAlert {}
				`,
			);

			await migrateIconSelectorGenerator(tree, { skipFormat: true });

			const content = tree.read('app/src/app/my-alert.ts', 'utf-8');
			expect(content).toContain('group-has-[>[hlmIcon]]/alert:col-start-2');
			expect(content).not.toContain('group-has-[>ng-icon]');
		});

		it('should replace **:[ng-icon] with **:[[hlmIcon]]', async () => {
			tree.write(
				'app/src/app/my-menu.ts',
				`
				import { Directive } from '@angular/core';

				@Directive({
					host: {
						class: 'data-selected:**:[ng-icon]:text-foreground',
					},
				})
				export class MyMenu {}
				`,
			);

			await migrateIconSelectorGenerator(tree, { skipFormat: true });

			const content = tree.read('app/src/app/my-menu.ts', 'utf-8');
			expect(content).toContain('data-selected:**:[[hlmIcon]]:text-foreground');
			expect(content).not.toContain('**:[ng-icon]');
		});

		it('should replace ng-icon in state-based selectors', async () => {
			tree.write(
				'app/src/app/my-accordion.ts',
				`
				import { Directive } from '@angular/core';

				@Directive({
					host: {
						class: '[&[data-state=open]>ng-icon]:rotate-180',
					},
				})
				export class MyAccordion {}
				`,
			);

			await migrateIconSelectorGenerator(tree, { skipFormat: true });

			const content = tree.read('app/src/app/my-accordion.ts', 'utf-8');
			expect(content).toContain('[&[data-state=open]>[hlmIcon]]:rotate-180');
		});

		it('should replace ng-icon selectors in CSS files', async () => {
			tree.write(
				'app/src/styles.css',
				`
				@layer components {
					.btn {
						@apply [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0;
					}
				}
				`,
			);

			await migrateIconSelectorGenerator(tree, { skipFormat: true });

			const content = tree.read('app/src/styles.css', 'utf-8');
			expect(content).toContain('[&_[hlmIcon]]:pointer-events-none');
			expect(content).toContain('[&_[hlmIcon]]:shrink-0');
		});

		it('should replace ng-icon with :not() modifier', async () => {
			tree.write(
				'app/src/app/my-select.ts',
				`
				import { Directive } from '@angular/core';

				@Directive({
					host: {
						class: "[&_ng-icon:not([class*='text-'])]:text-base",
					},
				})
				export class MySelect {}
				`,
			);

			await migrateIconSelectorGenerator(tree, { skipFormat: true });

			const content = tree.read('app/src/app/my-select.ts', 'utf-8');
			expect(content).toContain("[&_[hlmIcon]:not([class*='text-'])]:text-base");
		});

		it('should NOT replace ng-icon in import statements', async () => {
			tree.write(
				'app/src/app/my-component.ts',
				`
				import { NgIcon } from '@ng-icons/core';
				import { lucideCheck } from '@ng-icons/lucide';
				`,
			);

			await migrateIconSelectorGenerator(tree, { skipFormat: true });

			const content = tree.read('app/src/app/my-component.ts', 'utf-8');
			expect(content).toContain("import { NgIcon } from '@ng-icons/core';");
			expect(content).toContain("import { lucideCheck } from '@ng-icons/lucide';");
		});
	});

	describe('bare ng-icon migration', () => {
		it('should add hlmIcon to bare <ng-icon> elements', async () => {
			tree.write(
				'app/src/app/my-component.ts',
				`
				import { Component } from '@angular/core';
				import { NgIcon, provideIcons } from '@ng-icons/core';
				import { lucideCheck } from '@ng-icons/lucide';

				@Component({
					imports: [NgIcon],
					providers: [provideIcons({ lucideCheck })],
					template: \`
						<ng-icon name="lucideCheck" />
					\`,
				})
				export class MyComponent {}
				`,
			);

			await migrateIconSelectorGenerator(tree, { skipFormat: true });

			const content = tree.read('app/src/app/my-component.ts', 'utf-8');
			expect(content).toContain('<ng-icon hlmIcon name="lucideCheck" />');
			expect(content).toContain("import { HlmIcon } from '@spartan-ng/helm/icon';");
		});

		it('should NOT modify <ng-icon> elements that already have hlm', async () => {
			tree.write(
				'app/src/app/my-component.ts',
				`
				import { Component } from '@angular/core';

				@Component({
					template: \`
						<ng-icon hlm name="lucideCheck" />
					\`,
				})
				export class MyComponent {}
				`,
			);

			await migrateIconSelectorGenerator(tree, { skipFormat: true });

			const content = tree.read('app/src/app/my-component.ts', 'utf-8');
			expect(content).toContain('<ng-icon hlm name="lucideCheck" />');
			expect(content).not.toContain('hlmIcon');
		});

		it('should NOT modify <ng-icon> elements that already have hlmIcon', async () => {
			tree.write(
				'app/src/app/my-component.ts',
				`
				import { Component } from '@angular/core';

				@Component({
					template: \`
						<ng-icon hlmIcon name="lucideCheck" />
					\`,
				})
				export class MyComponent {}
				`,
			);

			await migrateIconSelectorGenerator(tree, { skipFormat: true });

			const content = tree.read('app/src/app/my-component.ts', 'utf-8');
			expect(content.match(/hlmIcon/g)?.length).toBe(1);
		});

		it('should add hlmIcon to bare <ng-icon> in HTML files', async () => {
			tree.write(
				'app/src/app/my-component.html',
				`
				<div>
					<ng-icon name="lucideCheck" />
					<ng-icon hlm name="lucideX" />
				</div>
				`,
			);

			await migrateIconSelectorGenerator(tree, { skipFormat: true });

			const content = tree.read('app/src/app/my-component.html', 'utf-8');
			expect(content).toContain('<ng-icon hlmIcon name="lucideCheck" />');
			expect(content).toContain('<ng-icon hlm name="lucideX" />');
		});

		it('should not add HlmIcon import if already present', async () => {
			tree.write(
				'app/src/app/my-component.ts',
				`
				import { Component } from '@angular/core';
				import { HlmIcon } from '@spartan-ng/helm/icon';

				@Component({
					template: \`
						<ng-icon name="lucideCheck" />
					\`,
				})
				export class MyComponent {}
				`,
			);

			await migrateIconSelectorGenerator(tree, { skipFormat: true });

			const content = tree.read('app/src/app/my-component.ts', 'utf-8');
			expect(content.match(/import.*HlmIcon/g)?.length).toBe(1);
		});

		it('should not add HlmIcon import if already present from a custom alias', async () => {
			tree.write(
				'app/src/app/my-component.ts',
				`
				import { Component } from '@angular/core';
				import { HlmIcon } from '@my-org/ui/icon';

				@Component({
					template: \`
						<ng-icon name="lucideCheck" />
					\`,
				})
				export class MyComponent {}
				`,
			);

			await migrateIconSelectorGenerator(tree, { skipFormat: true });

			const content = tree.read('app/src/app/my-component.ts', 'utf-8');
			expect(content.match(/import.*HlmIcon/g)?.length).toBe(1);
		});
	});

	describe('import alias resolution', () => {
		it('should use custom import alias from components.json', async () => {
			tree.write('components.json', JSON.stringify({ importAlias: '@my-org/ui' }));

			tree.write(
				'app/src/app/my-component.ts',
				`
				import { Component } from '@angular/core';

				@Component({
					template: \`
						<ng-icon name="lucideCheck" />
					\`,
				})
				export class MyComponent {}
				`,
			);

			await migrateIconSelectorGenerator(tree, { skipFormat: true });

			const content = tree.read('app/src/app/my-component.ts', 'utf-8');
			expect(content).toContain("import { HlmIcon } from '@my-org/ui/icon';");
		});

		it('should fall back to default alias if components.json does not exist', async () => {
			tree.write(
				'app/src/app/my-component.ts',
				`
				import { Component } from '@angular/core';

				@Component({
					template: \`
						<ng-icon name="lucideCheck" />
					\`,
				})
				export class MyComponent {}
				`,
			);

			await migrateIconSelectorGenerator(tree, { skipFormat: true });

			const content = tree.read('app/src/app/my-component.ts', 'utf-8');
			expect(content).toContain("import { HlmIcon } from '@spartan-ng/helm/icon';");
		});

		it('should extend existing import from the resolved path', async () => {
			tree.write('components.json', JSON.stringify({ importAlias: '@my-org/ui' }));

			tree.write(
				'app/src/app/my-component.ts',
				`import { Component } from '@angular/core';
import { provideHlmIconConfig } from '@my-org/ui/icon';

@Component({
	template: \`<ng-icon name="lucideCheck" />\`,
})
export class MyComponent {}
`,
			);

			await migrateIconSelectorGenerator(tree, { skipFormat: true });

			const content = tree.read('app/src/app/my-component.ts', 'utf-8');
			expect(content).toContain('provideHlmIconConfig');
			expect(content).toContain('HlmIcon');
			expect(content).toContain("from '@my-org/ui/icon'");
			// Should NOT add a separate import line
			expect(content.match(/from\s*'@my-org\/ui\/icon'/g)?.length).toBe(1);
		});
	});
});
