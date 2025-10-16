import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateNamingConventionGenerator } from './generator';

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

describe('migrate-naming-conventions generator', () => {
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

	it('should not replace helm identifiers', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
	HlmAccordionContentComponent,
	HlmAccordionDirective,
	HlmAccordionIconDirective,
	HlmAccordionItemDirective,
	HlmAccordionTriggerDirective,
} from '@spartan-ng/helm/accordion';
import { HlmIconDirective } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-accordion-preview',
	imports: [
		HlmAccordionDirective,
		HlmAccordionItemDirective,
		HlmAccordionTriggerDirective,
		HlmAccordionIconDirective,
		HlmAccordionContentComponent,
		NgIcon,
		HlmIconDirective,
	],
	template: \`
		<div hlmAccordion>
			<div hlmAccordionItem>
				<button hlmAccordionTrigger>
					Product Information
					<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
				</button>
				<hlm-accordion-content>
					Our flagship product combines cutting-edge technology with sleek design. Built with premium materials, it
					offers unparalleled performance and reliability.

					<br />
					<br />

					Key features include advanced processing capabilities, and an intuitive user interface designed for both
					beginners and experts.
				</hlm-accordion-content>
			</div>

			<div hlmAccordionItem>
				<button hlmAccordionTrigger>
					Shipping Details
					<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
				</button>
				<hlm-accordion-content>
					We offer worldwide shipping through trusted courier partners. Standard delivery takes 3-5 business days, while
					express shipping ensures delivery within 1-2 business days.

					<br />
					<br />
					All orders are carefully packaged and fully insured. Track your shipment in real-time through our dedicated
					tracking portal.
				</hlm-accordion-content>
			</div>

			<div hlmAccordionItem>
				<button hlmAccordionTrigger>
					Return Policy
					<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
				</button>
				<hlm-accordion-content>
					We stand behind our products with a comprehensive 30-day return policy. If you're not completely satisfied,
					simply return the item in its original condition.
					<br />
					<br />
					Our hassle-free return process includes free return shipping and full refunds processed within 48 hours of
					receiving the returned item.
				</hlm-accordion-content>
			</div>
		</div>
	\`,
})
export class AccordionPreviewComponent {}`,
		);

		await migrateNamingConventionGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toMatchSnapshot();
	});

	it('should replace brain identifiers', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronsUpDown, lucideSearch } from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnPopoverComponent, BrnPopoverContentDirective, BrnPopoverTriggerDirective } from '@spartan-ng/brain/popover';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { HlmPopoverContentDirective } from '@spartan-ng/helm/popover';

type Framework = { label: string; value: string };

@Component({
	selector: 'spartan-combobox-preview',
	imports: [
		BrnCommandImports,
		HlmCommandImports,
		NgIcon,
		HlmIconDirective,
		HlmButtonDirective,
		BrnPopoverComponent,
		BrnPopoverTriggerDirective,
		HlmPopoverContentDirective,
		BrnPopoverContentDirective,
	],
	providers: [provideIcons({ lucideChevronsUpDown, lucideSearch, lucideCheck })],
	template: \`
		<brn-popover [state]="state()" (stateChanged)="stateChanged($event)" sideOffset="5">
			<button
				class="w-[200px] justify-between"
				id="edit-profile"
				variant="outline"
				brnPopoverTrigger
				(click)="state.set('open')"
				hlmBtn
			>
				{{ currentFramework() ? currentFramework()?.label : 'Select framework...' }}
				<ng-icon hlm size="sm" name="lucideChevronsUpDown" class="opacity-50" />
			</button>
			<hlm-command *brnPopoverContent="let ctx" hlmPopoverContent class="w-[200px] p-0">
				<hlm-command-search>
					<ng-icon hlm name="lucideSearch" />
					<input placeholder="Search framework..." hlm-command-search-input />
				</hlm-command-search>
				<div *brnCommandEmpty hlmCommandEmpty>No results found.</div>
				<hlm-command-list>
					<hlm-command-group>
						@for (framework of frameworks; track framework) {
							<button hlm-command-item [value]="framework.value" (selected)="commandSelected(framework)">
								<span>{{ framework.label }}</span>
								<ng-icon
									hlm
									class="ml-auto"
									[class.opacity-0]="currentFramework()?.value !== framework.value"
									name="lucideCheck"
									hlmCommandIcon
								/>
							</button>
						}
					</hlm-command-group>
				</hlm-command-list>
			</hlm-command>
		</brn-popover>
	\`,
})
export class ComboboxPreviewComponent {
	public frameworks = [
		{
			label: 'AnalogJs',
			value: 'analogjs',
		},
		{
			label: 'Angular',
			value: 'angular',
		},
		{
			label: 'Vue',
			value: 'vue',
		},
		{
			label: 'Nuxt',
			value: 'nuxt',
		},
		{
			label: 'React',
			value: 'react',
		},
		{
			label: 'NextJs',
			value: 'nextjs',
		},
	];
	public currentFramework = signal<Framework | undefined>(undefined);
	public state = signal<'closed' | 'open'>('closed');

	stateChanged(state: 'open' | 'closed') {
		this.state.set(state);
	}

	commandSelected(framework: Framework) {
		this.state.set('closed');
		if (this.currentFramework()?.value === framework.value) {
			this.currentFramework.set(undefined);
		} else {
			this.currentFramework.set(framework);
		}
	}
}
`,
		);

		await migrateNamingConventionGenerator(tree, { skipFormat: true });
		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toMatchSnapshot();
	});

	it('should rename the identifiers that changed name', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`import { Component } from '@angular/core';
import { BrnTooltipContentDirective } from '@spartan-ng/brain/tooltip';
import {HlmMenuItemRadioComponent} from '@spartan-ng/helm/menu';
import { BrnSelectValueDirective } from '@spartan-ng/brain/select';

@Component({
	selector: 'spartan-tooltip-preview',
	imports: [BrnTooltipContentDirective, HlmMenuItemRadioComponent, BrnSelectValueDirective],
	template: \`
		<brn-tooltip>
			<button brnTooltipTrigger>Hover me</button>
			<brn-tooltip-content>
				<p>This is a tooltip!</p>
			</brn-tooltip-content>
		</brn-tooltip>
	\`,
})
export class TooltipPreviewComponent {}`,
		);

		await migrateNamingConventionGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toMatchSnapshot();
	});
});
