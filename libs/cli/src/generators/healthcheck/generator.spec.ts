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

		// add a file with the module imports

		tree.write(
			'libs/my-lib/src/modules-legacy.component.ts',
			`
import { BrnAccordionModule } from '@spartan-ng/brain/accordion';
import { BrnAlertDialogModule } from '@spartan-ng/brain/alertDialog';
import { BrnAutocompleteModule } from '@spartan-ng/brain/autocomplete';
import { BrnAvatarModule } from '@spartan-ng/brain/avatar';
import { BrnButtonModule } from '@spartan-ng/brain/button';
import { BrnCalendarModule } from '@spartan-ng/brain/calendar';
import { BrnCheckboxModule } from '@spartan-ng/brain/checkbox';
import { BrnCollapsibleModule } from '@spartan-ng/brain/collapsible';
import { BrnCommandModule } from '@spartan-ng/brain/command';
import { BrnDialogModule } from '@spartan-ng/brain/dialog';
import { BrnHoverCardModule } from '@spartan-ng/brain/hoverCard';
import { BrnInputOtpModule } from '@spartan-ng/brain/inputOtp';
import { BrnLabelModule } from '@spartan-ng/brain/label';
import {
  BrnMenuItemImports,
  BrnMenuBarImports,
  BrnContextMenuImports,
  BrnMenuItemModule,
  BrnMenuModule,
  BrnMenuBarModule,
  BrnContextMenuModule
} from '@spartan-ng/brain/menu';
import { BrnPopoverModule } from '@spartan-ng/brain/popover';
import { BrnProgressModule } from '@spartan-ng/brain/progress';
import { BrnRadioGroupModule } from '@spartan-ng/brain/radioGroup';
import { BrnSelectModule } from '@spartan-ng/brain/select';
import { BrnSeparatorModule } from '@spartan-ng/brain/separator';
import { BrnSheetModule } from '@spartan-ng/brain/sheet';
import { BrnSwitchModule } from '@spartan-ng/brain/switch';
import { BrnTabsModule } from '@spartan-ng/brain/tabs';
import { BrnToggleModule } from '@spartan-ng/brain/toggle';
import {
  BrnToggleGroupModule,
  BrnToggleGroupItemModule
} from '@spartan-ng/brain/toggleGroup';
import { BrnTooltipModule } from '@spartan-ng/brain/tooltip';

@Component({
  imports: [
    BrnAccordionModule,
    BrnAlertDialogModule,
    BrnAutocompleteModule,
    BrnAvatarModule,
    BrnButtonModule,
    BrnCalendarModule,
    BrnCheckboxModule,
    BrnCollapsibleModule,
    BrnCommandModule,
    BrnDialogModule,
    BrnHoverCardModule,
    BrnInputOtpModule,
    BrnLabelModule,
    BrnMenuItemImports,
    BrnMenuBarImports,
    BrnContextMenuImports,
    BrnMenuItemModule,
    BrnMenuModule,
    BrnMenuBarModule,
    BrnContextMenuModule,
    BrnPopoverModule,
    BrnProgressModule,
    BrnRadioGroupModule,
    BrnSelectModule,
    BrnSeparatorModule,
    BrnSheetModule,
    BrnSwitchModule,
    BrnTabsModule,
    BrnToggleModule,
    BrnToggleGroupModule,
    BrnToggleGroupItemModule,
    BrnTooltipModule,
  ]
})
export class BrnDemoComponent {}
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

		// add a file with legacy output conventions
		tree.write('libs/my-lib/src/switch-legacy.component.ts', `<brn-switch (changed)="onChange($event)"/>`);

		// add a file with legacy output conventions
		tree.write('libs/my-lib/src/checkbox-legacy.component.ts', `<brn-checkbox (changed)="onChange($event)"/>`);

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

	it('should update brn-switch output conventions', () => {
		const contents = tree.read('libs/my-lib/src/switch-legacy.component.ts', 'utf-8');

		expect(contents).toContain('<brn-switch (checkedChange)="onChange($event)"/>');
		expect(contents).not.toContain('<brn-switch (changed)="onChange($event)"/>');
	});

	it('should update brn-checkbox output conventions', () => {
		const contents = tree.read('libs/my-lib/src/checkbox-legacy.component.ts', 'utf-8');

		expect(contents).toContain('<brn-checkbox (checkedChange)="onChange($event)"/>');
		expect(contents).not.toContain('<brn-checkbox (changed)="onChange($event)"/>');
	});

	it('should update module imports to const imports', () => {
		const contents = tree.read('libs/my-lib/src/modules-legacy.component.ts', 'utf-8');

		expect(contents).not.toContain('BrnAccordionModule');
		expect(contents).toContain('BrnAccordionImports');
		expect(contents).not.toContain('BrnAlertDialogModule');
		expect(contents).toContain('BrnAlertDialogImports');
		expect(contents).not.toContain('BrnAutocompleteModule');
		expect(contents).toContain('BrnAutocompleteImports');
		expect(contents).not.toContain('BrnAvatarModule');
		expect(contents).toContain('BrnAvatarImports');
		expect(contents).not.toContain('BrnButtonModule');
		expect(contents).toContain('BrnButtonImports');
		expect(contents).not.toContain('BrnCalendarModule');
		expect(contents).toContain('BrnCalendarImports');
		expect(contents).not.toContain('BrnCheckboxModule');
		expect(contents).toContain('BrnCheckboxImports');
		expect(contents).not.toContain('BrnCollapsibleModule');
		expect(contents).toContain('BrnCollapsibleImports');
		expect(contents).not.toContain('BrnCommandModule');
		expect(contents).toContain('BrnCommandImports');
		expect(contents).not.toContain('BrnDialogModule');
		expect(contents).toContain('BrnDialogImports');
		expect(contents).not.toContain('BrnHoverCardModule');
		expect(contents).toContain('BrnHoverCardImports');
		expect(contents).not.toContain('BrnInputOtpModule');
		expect(contents).toContain('BrnInputOtpImports');
		expect(contents).not.toContain('BrnLabelModule');
		expect(contents).toContain('BrnLabelImports');
		expect(contents).not.toContain('BrnMenuItemImports');
		expect(contents).not.toContain('BrnMenuBarImports');
		expect(contents).not.toContain('BrnContextMenuImports');
		expect(contents).not.toContain('BrnMenuItemModule');
		expect(contents).not.toContain('BrnMenuModule');
		expect(contents).not.toContain('BrnMenuBarModule');
		expect(contents).not.toContain('BrnContextMenuModule');
		expect(contents).toContain('BrnMenuImports');
		expect(contents).not.toContain('BrnPopoverModule');
		expect(contents).toContain('BrnPopoverImports');
		expect(contents).not.toContain('BrnProgressModule');
		expect(contents).toContain('BrnProgressImports');
		expect(contents).not.toContain('BrnRadioGroupModule');
		expect(contents).toContain('BrnRadioGroupImports');
		expect(contents).not.toContain('BrnSelectModule');
		expect(contents).toContain('BrnSelectImports');
		expect(contents).not.toContain('BrnSeparatorModule');
		expect(contents).toContain('BrnSeparatorImports');
		expect(contents).not.toContain('BrnSheetModule');
		expect(contents).toContain('BrnSheetImports');
		expect(contents).not.toContain('BrnSwitchModule');
		expect(contents).toContain('BrnSwitchImports');
		expect(contents).not.toContain('BrnTabsModule');
		expect(contents).toContain('BrnTabsImports');
		expect(contents).not.toContain('BrnToggleModule');
		expect(contents).toContain('BrnToggleImports');
		expect(contents).not.toContain('BrnToggleGroupModule');
		expect(contents).toContain('BrnToggleGroupImports');
		expect(contents).not.toContain('BrnToggleGroupItemModule');
		expect(contents).toContain('BrnToggleGroupImports');
		expect(contents).not.toContain('BrnTooltipModule');
		expect(contents).toContain('BrnTooltipImports');

		// should only import every import once in the import from
		const importStatements = contents.match(/import {([^}]+)} from '@spartan-ng\/brain\/[^']+';/g) || [];
		const allImports = importStatements.flatMap((statement) => statement.match(/Brn\w+/g) || []);

		const uniqueImports = new Set(allImports);
		expect(allImports.length).toEqual(uniqueImports.size);

		// should have only one import from everyone in the imports array inside the @Component decorator
		const componentImportsMatch = contents.match(/@Component\(\s*{[^}]*imports:\s*\[([^\]]+)\][^}]*}\s*\)/s);
		expect(componentImportsMatch).toBeTruthy();
		const componentImports = componentImportsMatch ? componentImportsMatch[1].split(',').map((s) => s.trim()) : [];
		const uniqueComponentImports = new Set(componentImports);
		expect(componentImports.length).toEqual(uniqueComponentImports.size);
	});
});
