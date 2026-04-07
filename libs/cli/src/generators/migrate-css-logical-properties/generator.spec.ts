import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateCssLogicalPropertiesGenerator } from './generator';

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

describe('migrate-css-logical-properties generator', () => {
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

	it('should replace padding-left/right with padding-start/end', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
@Component({
  template: '<div class="pl-4 pr-8 pt-2">content</div>'
})
export class AppComponent {}
`,
		);

		await migrateCssLogicalPropertiesGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain('ps-4');
		expect(content).toContain('pe-8');
		expect(content).toContain('pt-2'); // vertical should not change
		expect(content).not.toContain('pl-4');
		expect(content).not.toContain('pr-8');
	});

	it('should replace margin-left/right with margin-start/end', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
import { Component } from '@angular/core';
import { HlmInput } from '@spartan-ng/helm/input';
@Component({
  template: '<div class="ml-4 mr-auto mb-2">content</div>'
})
export class AppComponent {}
`,
		);

		await migrateCssLogicalPropertiesGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain('ms-4');
		expect(content).toContain('me-auto');
		expect(content).toContain('mb-2'); // vertical should not change
	});

	it('should handle negative margins', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
import { Component } from '@angular/core';
import { HlmCard } from '@spartan-ng/helm/card';
@Component({
  template: '<div class="-ml-4 -mr-2">content</div>'
})
export class AppComponent {}
`,
		);

		await migrateCssLogicalPropertiesGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain('-ms-4');
		expect(content).toContain('-me-2');
	});

	it('should handle responsive prefixes', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
@Component({
  template: '<div class="sm:pl-4 md:pr-8 lg:ml-2 xl:mr-auto">content</div>'
})
export class AppComponent {}
`,
		);

		await migrateCssLogicalPropertiesGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain('sm:ps-4');
		expect(content).toContain('md:pe-8');
		expect(content).toContain('lg:ms-2');
		expect(content).toContain('xl:me-auto');
	});

	it('should replace border-left/right with border-start/end', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
import { Component } from '@angular/core';
import { HlmSeparator } from '@spartan-ng/helm/separator';
@Component({
  template: '<div class="border-l-2 border-r-4 border-t-2">content</div>'
})
export class AppComponent {}
`,
		);

		await migrateCssLogicalPropertiesGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain('border-s-2');
		expect(content).toContain('border-e-4');
		expect(content).toContain('border-t-2'); // vertical should not change
	});

	it('should replace rounded corners', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
import { Component } from '@angular/core';
import { HlmCard } from '@spartan-ng/helm/card';
@Component({
  template: '<div class="rounded-l-md rounded-r-lg rounded-tl-sm rounded-br-xl">content</div>'
})
export class AppComponent {}
`,
		);

		await migrateCssLogicalPropertiesGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain('rounded-s-md');
		expect(content).toContain('rounded-e-lg');
		expect(content).toContain('rounded-ss-sm');
		expect(content).toContain('rounded-ee-xl');
	});

	it('should replace text-left/right with text-start/end', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
@Component({
  template: '<div class="text-left">content</div><div class="text-right">other</div>'
})
export class AppComponent {}
`,
		);

		await migrateCssLogicalPropertiesGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain('text-start');
		expect(content).toContain('text-end');
		expect(content).not.toContain('text-left');
		expect(content).not.toContain('text-right');
	});

	it('should NOT replace left-/right- positional classes (too context-dependent)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
@Component({
  template: '<div class="absolute left-0 right-2 -left-12 group-data-[side=right]:left-0">content</div>'
})
export class AppComponent {}
`,
		);

		await migrateCssLogicalPropertiesGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain('left-0');
		expect(content).toContain('right-2');
		expect(content).toContain('-left-12');
		expect(content).toContain('group-data-[side=right]:left-0');
	});

	it('should handle arbitrary values', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
import { Component } from '@angular/core';
import { HlmInput } from '@spartan-ng/helm/input';
@Component({
  template: '<div class="pl-[2rem] mr-[-0.5rem]">content</div>'
})
export class AppComponent {}
`,
		);

		await migrateCssLogicalPropertiesGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain('ps-[2rem]');
		expect(content).toContain('me-[-0.5rem]');
	});

	it('should handle HTML files with spartan selectors', async () => {
		tree.write('app/src/app/app.component.html', '<hlm-card class="pl-4 mr-2 border-l-2 text-left">content</hlm-card>');

		await migrateCssLogicalPropertiesGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toContain('ps-4');
		expect(content).toContain('me-2');
		expect(content).toContain('border-s-2');
		expect(content).toContain('text-start');
	});

	it('should handle data attribute variant prefixes', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
import { HlmDropdownMenu } from '@spartan-ng/helm/dropdown-menu';
const classes = 'data-[inset]:pl-8 data-[state=open]:mr-2';
`,
		);

		await migrateCssLogicalPropertiesGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain('data-[inset]:ps-8');
		expect(content).toContain('data-[state=open]:me-2');
	});

	it('should not modify files without spartan markers', async () => {
		const original = `
import { Component } from '@angular/core';
@Component({
  template: '<div class="pl-4 mr-2 border-l-2">content</div>'
})
export class AppComponent {}
`;
		tree.write('app/src/app/app.component.ts', original);

		await migrateCssLogicalPropertiesGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toBe(original);
	});

	it('should not modify files without physical properties', async () => {
		const original = `
import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
@Component({
  template: '<div class="flex items-center gap-4 pt-2 pb-4">content</div>'
})
export class AppComponent {}
`;
		tree.write('app/src/app/app.component.ts', original);

		await migrateCssLogicalPropertiesGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toBe(original);
	});

	it('should handle negative margin values', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
import { HlmCarousel } from '@spartan-ng/helm/carousel';
const classes = '-ml-12 -mr-4';
`,
		);

		await migrateCssLogicalPropertiesGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain('-ms-12');
		expect(content).toContain('-me-4');
	});

	it('should replace float-left/right', async () => {
		tree.write('app/src/app/app.component.html', '<hlm-card class="float-left">content</hlm-card>');

		await migrateCssLogicalPropertiesGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toContain('float-start');
	});

	it('should handle scroll padding/margin', async () => {
		tree.write('app/src/app/app.component.html', '<brn-select class="scroll-pl-4 scroll-mr-2">content</brn-select>');

		await migrateCssLogicalPropertiesGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toContain('scroll-ps-4');
		expect(content).toContain('scroll-me-2');
	});

	it('should detect spartan files via hlm directive attributes', async () => {
		tree.write('app/src/app/app.component.html', '<button hlmBtn class="pl-4 mr-2">Click</button>');

		await migrateCssLogicalPropertiesGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toContain('ps-4');
		expect(content).toContain('me-2');
	});
});
