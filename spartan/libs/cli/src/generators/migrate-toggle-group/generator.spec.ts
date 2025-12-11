import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateToggleGroupGenerator } from './generator';

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

describe('migrate-toggle-group generator', () => {
	let tree: Tree;

	beforeEach(async () => {
		tree = await createTreeWithEmptyWorkspace();

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

	it('should replace BrnToggleGroupModule with BrnToggleGroupModule, BrnToggleGroupItemDirective', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
				import { Component } from '@angular/core';
				import { BrnToggleGroupModule, BrnToggleDirective } from '@spartan-ng/brain/toggle';
				import { HlmToggleDirective, HlmToggleGroupModule } from '@spartan-ng/ui-toggle-helm';

				@Component({
					imports: [BrnToggleGroupModule, HlmToggleGroupModule, HlmButtonDirective, FormsModule],
					],
					template: \`
    <brn-toggle-group
        hlm
        [disabled]="disabled"
        [nullable]="nullable"
        [multiple]="multiple"
        [(ngModel)]="selected"
        >
      @for (city of cities; track city;) {
        <button
          variant="outline"
          [value]="city"
          hlm
          brnToggle
          >
          {{ city.name }}
        </button>
      }
    </brn-toggle-group>
    <button hlmBtn size="sm" (click)="setToSyracuse()">Set to Syracuse</button>
    <button hlmBtn size="sm" (click)="addCity()">Add Piraeus</button>
    </div>
					\`
				})
				export class AppModule {}
				`,
		);

		await migrateToggleGroupGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain("import { BrnToggleGroupModule } from '@spartan-ng/brain/toggle'");
		expect(content).toContain(
			"import { BrnToggleGroupComponent, BrnToggleGroupItemDirective } from '@spartan-ng/brain/toggle-group'",
		);
		expect(content).toContain(
			"import { HlmToggleGroupDirective, HlmToggleGroupItemDirective } from '@spartan-ng/ui-toggle-group-helm'",
		);
		expect(content).toContain(
			'imports: [BrnToggleGroupComponent, BrnToggleGroupItemDirective, HlmToggleGroupDirective, HlmToggleGroupItemDirective, HlmButtonDirective, FormsModule],',
		);
	});

	it('should replace brnToggle with hlmToggleGroupItem', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
				import { Component } from '@angular/core';
				import { BrnToggleGroupModule } from '@spartan-ng/brain/toggle';
				import { HlmButtonDirective, FormsModule, } from '@spartan-ng/ui-toggle-group-helm';
				@Component({
					imports: [BrnToggleGroupModule, HlmToggleGroupModule, HlmButtonDirective, FormsModule,],
					template: \`
      <div class="flex space-x-4">
      <brn-toggle-group
        hlm
        [disabled]="disabled"
        [nullable]="nullable"
        [multiple]="multiple"
        [(ngModel)]="selected"
        >
      @for (city of cities; track city;) {
        <button
          variant="outline"
          [value]="city"
          hlm
          brnToggle
          >
          {{ city.name }}
        </button>
      }
    </brn-toggle-group>
    <button hlmBtn size="sm" (click)="setToSyracuse()">
      Set to Syracuse
    </button>
    <button hlmBtn size="sm" (click)="addCity()">Add Piraeus</button>
    </div>
					\`
				})
				export class AppModule {}
				`,
		);

		await migrateToggleGroupGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain('brnToggle');
		expect(content).toContain('hlmToggleGroupItem');
	});
});
