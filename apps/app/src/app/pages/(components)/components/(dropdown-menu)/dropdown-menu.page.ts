import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { RtlHeader } from '@spartan-ng/app/app/shared/code/rtl-header';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { link } from '@spartan-ng/app/app/shared/typography/link';
import { hlmP } from '@spartan-ng/helm/typography';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { DropdownBasic } from './dropdown-menu--basic.preview';
import { DropdownCheckboxesIcons } from './dropdown-menu--checkboxes-icons.preview';
import { DropdownCheckboxes } from './dropdown-menu--checkboxes.preview';
import { DropdownDestructive } from './dropdown-menu--destructive.preview';
import { DropdownIcons } from './dropdown-menu--icons.preview';
import { DropdownRadioGroupIcons } from './dropdown-menu--radio-group-icons.preview';
import { DropdownRadioGroup } from './dropdown-menu--radio-group.preview';
import { DropdownRtl } from './dropdown-menu--rtl.preview';
import { DropdownShortcuts } from './dropdown-menu--shortcuts.preview';
import { DropdownSubmenu } from './dropdown-menu--submenu.preview';
import { DropdownWithContextPreview } from './dropdown-menu-with-context.preview';
import { DropdownWithStatePreview } from './dropdown-menu-with-state.preview';
import { DropdownPreview, defaultImports, defaultSkeleton } from './dropdown-menu.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Dropdown', api: 'dropdown-menu' },
	meta: metaWith(
		'spartan/ui - Dropdown',
		'Displays a menu to the user — such as a set of actions or functions — triggered by a button.',
	),
	title: 'spartan/ui - Dropdown',
};
@Component({
	selector: 'spartan-dropdown-menu',
	imports: [
		UIApiDocs,
		MainSection,
		InstallTabs,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,

		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		SectionSubSubHeading,
		RtlHeader,
		CodeRtlPreview,
		DropdownPreview,
		DropdownBasic,
		DropdownSubmenu,
		DropdownShortcuts,
		DropdownIcons,
		DropdownCheckboxes,
		DropdownCheckboxesIcons,
		DropdownRadioGroup,
		DropdownRadioGroupIcons,
		DropdownDestructive,
		DropdownWithStatePreview,
		DropdownWithContextPreview,
		DropdownRtl,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Dropdown"
				lead="Displays a menu to the user — such as a set of actions or functions — triggered by a button."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dropdown-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="about">About</spartan-section-sub-heading>
			<p class="${hlmP}">
				Dropdown Menu is built with the help of
				<a href="https://material.angular.dev/cdk/menu/overview" target="_blank" rel="noreferrer" class="${link}">
					Menu
				</a>
				from Material CDK .
			</p>

			<spartan-install-tabs primitive="dropdown-menu" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="basic" spartanH4>Basic</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dropdown-basic />
				</div>
				<spartan-code secondTab [code]="_basicCode()" />
			</spartan-tabs>

			<h3 id="submenu" spartanH4>Submenu</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dropdown-submenu />
				</div>
				<spartan-code secondTab [code]="_submenuCode()" />
			</spartan-tabs>

			<h3 id="shortcuts" spartanH4>Shortcuts</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dropdown-shortcuts />
				</div>
				<spartan-code secondTab [code]="_shortcutsCode()" />
			</spartan-tabs>

			<h3 id="icons" spartanH4>Icons</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dropdown-icons />
				</div>
				<spartan-code secondTab [code]="_iconsCode()" />
			</spartan-tabs>

			<h3 id="checkboxes" spartanH4>Checkboxes</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dropdown-checkboxes />
				</div>
				<spartan-code secondTab [code]="_checkboxesCode()" />
			</spartan-tabs>

			<h3 id="checkboxes-icons" spartanH4>Checkboxes Icons</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dropdown-checkboxes-icons />
				</div>
				<spartan-code secondTab [code]="_checkboxesIconsCode()" />
			</spartan-tabs>

			<h3 id="radio-group" spartanH4>Radio Group</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dropdown-radio-group />
				</div>
				<spartan-code secondTab [code]="_radioGroupCode()" />
			</spartan-tabs>

			<h3 id="radio-group-icons" spartanH4>Radio Group Icons</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dropdown-radio-group-icons />
				</div>
				<spartan-code secondTab [code]="_radioGroupIconsCode()" />
			</spartan-tabs>

			<h3 id="destructive" spartanH4>Destructive</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dropdown-destructive />
				</div>
				<spartan-code secondTab [code]="_destructiveCode()" />
			</spartan-tabs>

			<h3 id="stateful" spartanH4>Stateful</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dropdown-with-state />
				</div>
				<spartan-code secondTab [code]="_withStateCode()" />
			</spartan-tabs>

			<h3 id="context" spartanH4>Passing context to menu</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dropdown-with-context />
				</div>
				<spartan-code secondTab [code]="_withContextCode()" />
			</spartan-tabs>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-dropdown-rtl />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="empty" label="Empty" />
				<spartan-page-bottom-nav-link direction="previous" href="dialog" label="Dialog" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class DropdownPage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('dropdown-menu');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _basicCode = computed(() => this._snippets()['basic']);
	protected readonly _submenuCode = computed(() => this._snippets()['submenu']);
	protected readonly _shortcutsCode = computed(() => this._snippets()['shortcuts']);
	protected readonly _iconsCode = computed(() => this._snippets()['icons']);
	protected readonly _checkboxesCode = computed(() => this._snippets()['checkboxes']);
	protected readonly _checkboxesIconsCode = computed(() => this._snippets()['checkboxesIcons']);
	protected readonly _radioGroupCode = computed(() => this._snippets()['radioGroup']);
	protected readonly _radioGroupIconsCode = computed(() => this._snippets()['radioGroupIcons']);
	protected readonly _destructiveCode = computed(() => this._snippets()['destructive']);
	protected readonly _withStateCode = computed(() => this._snippets()['withState']);
	protected readonly _withContextCode = computed(() => this._snippets()['withContext']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
