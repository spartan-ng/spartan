import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { UIApiDocs } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section';
import { hlmCode } from '@spartan-ng/helm/typography';
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
import { metaWith } from '../../../../shared/meta/meta.util';
import { NavigationMenuControlled } from './navigation-menu--controlled.example';
import { NavigationMenuNested } from './navigation-menu--nested.example';
import { NavigationMenuVertical } from './navigation-menu--vertical.example';
import { defaultImports, defaultSkeleton, NavigationMenuPreview } from './navigation-menu.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Navigation Menu', api: 'navigation-menu' },
	meta: metaWith('spartan/ui - Navigation Menu', 'A collection of links for navigating websites'),
	title: 'spartan/ui - Navigation Menu',
};

@Component({
	selector: 'spartan-navigation-menu',
	imports: [
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		NavigationMenuControlled,
		NavigationMenuNested,
		NavigationMenuPreview,
		NavigationMenuVertical,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		UIApiDocs,
		SectionSubSubHeading,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Navigation Menu" lead="A collection of links for navigating websites" />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-navigation-menu-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				nxCode="npx nx g @spartan-ng/cli:ui navigation-menu"
				ngCode="ng g @spartan-ng/cli:ui navigation-menu"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__vertical" spartanH4>Vertical</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="justify-start">
					<spartan-navigation-menu-vertical />
				</div>
				<spartan-code secondTab [code]="_verticalCode()" />
			</spartan-tabs>

			<h3 id="examples__controlled" spartanH4>Controlled</h3>
			<p class="py-2">
				The navigation menu's
				<code class="${hlmCode}">value</code>
				input can be set to the menu item's
				<code class="${hlmCode}">id</code>
				to activate it. Declaratively set navigation menu item stays activated until it is hovered or focused out.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="justify-start">
					<spartan-navigation-menu-controlled />
				</div>
				<spartan-code secondTab [code]="_controlledCode()" />
			</spartan-tabs>

			<h3 id="examples__nested" spartanH4>Nested</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="justify-start">
					<spartan-navigation-menu-nested />
				</div>
				<spartan-code secondTab [code]="_nestedCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="pagination" label="Pagination" />
				<spartan-page-bottom-nav-link direction="previous" href="menubar" label="Menubar" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class NavigationMenuPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('navigation-menu');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _verticalCode = computed(() => this._snippets()['vertical']);
	protected readonly _controlledCode = computed(() => this._snippets()['controlled']);
	protected readonly _nestedCode = computed(() => this._snippets()['nested']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
