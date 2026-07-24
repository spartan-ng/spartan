import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { RtlHeader } from '@spartan-ng/app/app/shared/code/rtl-header';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
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
import { DrawerDirectionPreview } from './drawer--direction.preview';
import { DrawerNestedPreview } from './drawer--nested.preview';
import { DrawerRtl } from './drawer--rtl.preview';
import { DrawerPreview, defaultImports, defaultSkeleton } from './drawer.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Drawer', api: 'drawer' },
	meta: metaWith('spartan/ui - Drawer', 'A dialog that slides in from the bottom of the screen.'),
	title: 'spartan/ui - Drawer',
};
@Component({
	selector: 'spartan-drawer',

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
		DrawerPreview,
		DrawerDirectionPreview,
		DrawerNestedPreview,
		DrawerRtl,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Drawer"
				showThemeToggle
				lead="A dialog that slides in from the bottom of the screen. Designed after the macOS/iOS bottom sheet pattern."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-drawer-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="drawer" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="direction" spartanH4>Direction</h3>
			<p class="${hlmP} mb-6">
				You can change the direction the drawer slides in from using the
				<code class="${hlmCode}">direction</code>
				input on the trigger.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-drawer-direction-preview />
				</div>
				<spartan-code secondTab [code]="_directionCode()" />
			</spartan-tabs>

			<h3 id="nested" spartanH4>Nested</h3>
			<p class="${hlmP} mb-6">
				Drawers can be nested within each other to create multi-step or drill-down experiences. Use a nested
				<code class="${hlmCode}">hlm-drawer</code>
				inside the content of another drawer.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-drawer-nested-preview />
				</div>
				<spartan-code secondTab [code]="_nestedCode()" />
			</spartan-tabs>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-drawer-rtl />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="dropdown-menu" label="Dropdown Menu" />
				<spartan-page-bottom-nav-link direction="previous" href="dialog" label="Dialog" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class DrawerPage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('drawer');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _directionCode = computed(() => this._snippets()['direction']);
	protected readonly _nestedCode = computed(() => this._snippets()['nested']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
