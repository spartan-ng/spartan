import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmH4 } from '@spartan-ng/helm/typography';
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
import { defaultCode, dropdownWithContextCode, dropdownWithStateCode } from './dropdown-menu.generated';
import { DropdownPreview, defaultImports, defaultSkeleton } from './dropdown-menu.preview';
import { DropdownWithContextPreview } from './dropdown-with-context.preview';
import { DropdownWithStatePreview } from './dropdown-with-state.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Dropdown', api: 'menu' },
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
				<spartan-code secondTab [code]="_defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs class="mt-4" nxCode="npx nx g @spartan-ng/cli:ui menu" ngCode="ng g @spartan-ng/cli:ui menu" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__stateful" class="${hlmH4} mb-2 mt-6">Stateful</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dropdown-with-state />
				</div>
				<spartan-code secondTab [code]="_dropdownWithStateCode" />
			</spartan-tabs>

			<h3 id="examples__context" class="${hlmH4} mb-2 mt-6">Passing context to menu</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dropdown-with-context />
				</div>
				<spartan-code secondTab [code]="_dropdownWithContextCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="hover-card" label="Hover Card" />
				<spartan-page-bottom-nav-link direction="previous" href="dialog" label="Dialog" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class DropdownPage {
	protected readonly _defaultCode = defaultCode;
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
	protected readonly _dropdownWithStateCode = dropdownWithStateCode;
	protected readonly _dropdownWithContextCode = dropdownWithContextCode;
}
