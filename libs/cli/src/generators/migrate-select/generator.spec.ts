import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateSelectGenerator } from './generator';

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

describe('migrate-select generator', () => {
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

	it('should rename (openedChange) to (openChange) on select elements', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`
				<brn-select (openedChange)="onOpenedChange($event)"></brn-select>
				<brn-select (openedChange)="onOpenedChange($event)" />
				<brn-select hlm (openedChange)="onOpenedChange($event)"></brn-select>
				<brn-select hlm (openedChange)="onOpenedChange($event)" />
				<hlm-select (openedChange)="onOpenedChange($event)"></hlm-select>
				<hlm-select (openedChange)="onOpenedChange($event)" />

				<!-- This is not a select, so it should not be changed -->
				<div (openedChange)="onOpenedChange($event)"></div>
			`,
		);

		await migrateSelectGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toBe(`
				<brn-select (openChange)="onOpenedChange($event)"></brn-select>
				<brn-select (openChange)="onOpenedChange($event)" />
				<brn-select hlm (openChange)="onOpenedChange($event)"></brn-select>
				<brn-select hlm (openChange)="onOpenedChange($event)" />
				<hlm-select (openChange)="onOpenedChange($event)"></hlm-select>
				<hlm-select (openChange)="onOpenedChange($event)" />

				<!-- This is not a select, so it should not be changed -->
				<div (openedChange)="onOpenedChange($event)"></div>
			`);
	});

	it('should migrate the hlm-select-option classes', () => {
		tree.write(
			'app/src/app/hlm-select-option.component.ts',
			`import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
			import { NgIcon, provideIcons } from '@ng-icons/core';
			import { lucideCheck } from '@ng-icons/lucide';
			import { hlm } from '@spartan-ng/brain/core';
			import { BrnSelectOptionDirective } from '@spartan-ng/brain/select';
			import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
			import type { ClassValue } from 'clsx';

			@Component({
				selector: 'hlm-option',
				standalone: true,
				changeDetection: ChangeDetectionStrategy.OnPush,
				hostDirectives: [{ directive: BrnSelectOptionDirective, inputs: ['disabled', 'value'] }],
				providers: [provideIcons({ lucideCheck })],
				host: {
					'[class]': '_computedClass()',
				},
				template: \`
					<ng-content />
					<span
						[attr.dir]="_brnSelectOption.dir()"
						class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center rtl:left-auto rtl:right-2"
						[attr.data-state]="this._brnSelectOption.checkedState()"
					>
						@if (this._brnSelectOption.selected()) {
							<ng-icon hlm size="sm" aria-hidden="true" name="lucideCheck" />
						}
					</span>
				\`,
				imports: [NgIcon, HlmIconDirective],
			})
			export class HlmSelectOptionComponent {
				protected readonly _brnSelectOption = inject(BrnSelectOptionDirective, { host: true });
				public readonly userClass = input<ClassValue>('', { alias: 'class' });
				protected readonly _computedClass = computed(() =>
					hlm(
						'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 rtl:flex-reverse rtl:pr-8 rtl:pl-2 text-sm outline-none data-[active]:bg-accent data-[active]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
						this.userClass(),
					),
				);
			}
			`,
		);

		migrateSelectGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/hlm-select-option.component.ts', 'utf-8');

		// extract the string literal from the hlm function
		const matches = content.match(/hlm\(\s*(['"])(.*?)\1/s);
		const classes = matches[2];

		expect(classes).toBe(
			'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 rtl:flex-reverse rtl:pr-8 rtl:pl-2 text-sm outline-none data-[active]:bg-accent data-[active]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		);
	});
});
