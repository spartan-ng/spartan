import { readJson, Tree, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { healthcheckGenerator } from './generator';

describe('healthcheck generator', () => {
	let tree: Tree;

	beforeEach(async () => {
		tree = createTreeWithEmptyWorkspace();

		writeJson(tree, 'package.json', {
			dependencies: {
				'@spartan-ng/brain': '0.0.1-alpha.300',
				'@spartan-ng/ui-checkbox-brain': '0.0.1-alpha.300',
			},
			devDependencies: {
				'@spartan-ng/cli': '0.0.1-alpha.300',
			},
		});

		// add a file with legacy imports
		tree.write(
			'libs/my-lib/src/index.ts',
			`
			import { BrnCheckbox } from '@spartan-ng/ui-checkbox-brain';
			import { hlm } from '@spartan-ng/ui-core';
			import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
		`,
		);

		// add a file with a helm icon
		tree.write(
			'libs/my-lib/src/app.component.html',
			`
			<hlm-icon />
			<hlm-scroll-area />
		`,
		);

		// add a file with legacy naming conventions
		tree.write(
			'libs/my-lib/src/legacy.component.ts',
			`			import { HlmMenuItemRadioComponent } from '@spartan-ng/helm/menu';
			import { BrnTooltipContentDirective } from '@spartan-ng/brain/tooltip';
			import { BrnSelectValueDirective } from '@spartan-ng/brain/select';
			`,
		);

		// add a file with legacy output conventions
		tree.write(
			'libs/my-lib/src/date-picker-legacy.component.ts',
			`<hlm-date-picker (changed)="onDateChange($event)"/>
		   <hlm-date-picker-multi (changed)="onDateChange($event)">;`,
		);

		// add a html file with legacy brain accordion trigger
		tree.write(
			'libs/my-lib/src/brn-accordion-trigger-legacy.component.html',
			`
			<div hlmAccordion>
			<div hlmAccordionItem>
					<button hlmAccordionTrigger>
						Product Information
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
				<hlm-accordion-content>
					<p>
						Our flagship product combines cutting-edge technology with sleek design. Built with premium materials, it
						offers unparalleled performance and reliability.
					</p>

					<p>
						Key features include advanced processing capabilities, and an intuitive user interface designed for both
						beginners and experts.
					</p>
				</hlm-accordion-content>
			</div>


			<div hlmAccordionItem>
					<button brnAccordionTrigger>
						Product Information
					</button>
					<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
				<hlm-accordion-content>
					<p>
						Our flagship product combines cutting-edge technology with sleek design. Built with premium materials, it
						offers unparalleled performance and reliability.
					</p>

					<p>
						Key features include advanced processing capabilities, and an intuitive user interface designed for both
						beginners and experts.
					</p>
				</hlm-accordion-content>
			</div>
			</div>
		`,
		);

		await healthcheckGenerator(tree, { skipFormat: true, autoFix: true });
	});

	it('should update to latest dependencies', () => {
		const packageJson = readJson(tree, 'package.json');

		expect(packageJson.dependencies['@spartan-ng/brain']).not.toEqual('0.0.1-alpha.300');
		expect(packageJson.devDependencies['@spartan-ng/cli']).not.toEqual('0.0.1-alpha.300');
	});

	it('should update brain imports', () => {
		const contents = tree.read('libs/my-lib/src/index.ts', 'utf-8');

		expect(contents).not.toContain('@spartan-ng/ui-checkbox-brain');
		expect(contents).toContain('@spartan-ng/brain/checkbox');

		// check if package.json was updated
		const packageJson = readJson(tree, 'package.json');
		expect(packageJson.dependencies['@spartan-ng/ui-checkbox-brain']).toBeUndefined();
	});

	it('should update core imports', () => {
		const contents = tree.read('libs/my-lib/src/index.ts', 'utf-8');

		expect(contents).not.toContain('@spartan-ng/ui-core');
		expect(contents).toContain('@spartan-ng/brain/core');
	});

	it('should update helm imports', () => {
		const contents = tree.read('libs/my-lib/src/index.ts', 'utf-8');

		expect(contents).not.toContain('@spartan-ng/ui-button-helm');
		expect(contents).toContain('@spartan-ng/helm/button');
	});

	it('should update helm icons', () => {
		const contents = tree.read('libs/my-lib/src/app.component.html', 'utf-8');

		expect(contents).not.toContain('<hlm-icon');
		expect(contents).toContain('<ng-icon hlm');
	});

	it('should update helm scroll areas', () => {
		const contents = tree.read('libs/my-lib/src/app.component.html', 'utf-8');

		expect(contents).not.toContain('<hlm-scroll-area');
		expect(contents).toContain('<ng-scrollbar hlm');
	});

	it('should update naming conventions', () => {
		const contents = tree.read('libs/my-lib/src/legacy.component.ts', 'utf-8');

		expect(contents).toContain('HlmMenuItemRadioIndicator');
		expect(contents).not.toContain('BrnTooltipContentDirective');
		expect(contents).toContain('BrnTooltipContentTemplate');
		expect(contents).not.toContain('BrnSelectValueDirective');
		expect(contents).toContain('BrnSelectValueTemplate');
	});

	it('should update helm date-picker output conventions', () => {
		const contents = tree.read('libs/my-lib/src/date-picker-legacy.component.ts', 'utf-8');

		expect(contents).toContain('<hlm-date-picker (dateChange)="onDateChange($event)"/>');
		expect(contents).not.toContain('<hlm-date-picker (changed)="onDateChange($event)"/>');
		expect(contents).toContain('<hlm-date-picker-multi (dateChange)="onDateChange($event)">');
		expect(contents).not.toContain('<hlm-date-picker-multi (changed)="onDateChange($event)">');
	});

	it('should update brn accordion triggers', () => {
		const contents = tree.read('libs/my-lib/src/brn-accordion-trigger-legacy.component.html', 'utf-8');

		expect(contents).toContain(`<h3 class="contents"><button hlmAccordionTrigger>`);
		expect(contents).toContain(`</button></h3>`);

		expect(contents).toContain(`<h3 class="contents"><button brnAccordionTrigger>`);
		expect(contents).toContain(`</button></h3>`);
	});
});
