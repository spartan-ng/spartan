import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
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
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { DropdownMenuCheckboxes } from './dropdown-menu--checkboxes.preview';
import { DropdownMenuRadioGroup } from './dropdown-menu--radio-group.preview';
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
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		DropdownPreview,
		DropdownPreview,
		DropdownWithStatePreview,
		DropdownWithContextPreview,
		SectionSubSubHeading,
		DropdownMenuCheckboxes,
		DropdownMenuRadioGroup,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Dropdown"
				lead="Displays a menu to the user — such as a set of actions or functions — triggered by a button."
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

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui dropdown-menu"
				ngCode="ng g @spartan-ng/cli:ui dropdown-menu"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__checkboxes" spartanH4>Checkboxes</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dropdown-menu-checkboxes />
				</div>
				<spartan-code secondTab [code]="_checkboxesCode()" />
			</spartan-tabs>

			<h3 id="examples__radio_group" spartanH4>Radio Group</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dropdown-menu-radio-group />
				</div>
				<spartan-code secondTab [code]="_radioGroupCode()" />
			</spartan-tabs>

			<h3 id="examples__stateful" spartanH4>Stateful</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dropdown-with-state />
				</div>
				<spartan-code secondTab [code]="_withStateCode()" />
			</spartan-tabs>

			<h3 id="examples__context" spartanH4>Passing context to menu</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dropdown-with-context />
				</div>
				<spartan-code secondTab [code]="_withContextCode()" />
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
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('dropdown-menu');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _checkboxesCode = computed(() => this._snippets()['checkboxes']);
	protected readonly _radioGroupCode = computed(() => this._snippets()['radioGroup']);
	protected readonly _withStateCode = computed(() => this._snippets()['withState']);
	protected readonly _withContextCode = computed(() => this._snippets()['withContext']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
