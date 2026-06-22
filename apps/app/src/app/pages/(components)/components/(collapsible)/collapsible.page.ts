import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { CollapsibleAnimatedExample } from '@spartan-ng/app/app/pages/(components)/components/(collapsible)/collapsible--animated.example';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { RtlHeader } from '@spartan-ng/app/app/shared/code/rtl-header';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
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
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { CollapsibleDynamic } from './collapsible--dynamic.example';
import { CollapsibleRtl } from './collapsible--rtl.preview';
import { CollapsibleSettingsPanel } from './collapsible--settings-panel.preview';
import { CollapsiblePreview, defaultImports, defaultSkeleton } from './collapsible.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Collapsible', api: 'collapsible' },
	meta: metaWith('spartan/ui - Collapsible', 'An interactive component which expands/collapses a panel.'),
	title: 'spartan/ui - Collapsible',
};

@Component({
	selector: 'spartan-collapsible',
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
		CollapsiblePreview,
		CollapsibleAnimatedExample,
		CollapsibleSettingsPanel,
		CollapsibleDynamic,
		CollapsibleRtl,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Collapsible"
				lead="An interactive component which expands/collapses a panel."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-collapsible-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="collapsible" [showOnlyVega]="true" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="animated" spartanH4>Animated</h3>
			<p class="py-2">
				You can use the
				<code class="${hlmCode}">data-state</code>
				and Tailwind classes to control the animation of the collapsible.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-collapsible-animated-example />
				</div>
				<spartan-code secondTab [code]="_animatedCode()" />
			</spartan-tabs>

			<h3 id="settings-panel" spartanH4>Settings Panel</h3>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-collapsible-settings-panel />
				</div>
				<spartan-code secondTab [code]="_settingsPanelCode()" />
			</spartan-tabs>

			<h3 id="dynamic" spartanH4>Dynamic content</h3>
			<p class="py-2">
				Animate the height with the
				<code class="${hlmCode}">--brn-collapsible-content-height</code>
				variable. Rows added while the panel is open are measured as they change, so it animates to fit its new height.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-collapsible-dynamic />
				</div>
				<spartan-code secondTab [code]="_dynamicCode()" />
			</spartan-tabs>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-collapsible-rtl />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="combobox" label="Combobox" />
				<spartan-page-bottom-nav-link direction="previous" href="checkbox" label="Checkbox" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class CollapsiblePage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('collapsible');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _animatedCode = computed(() => this._snippets()['animated']);
	protected readonly _settingsPanelCode = computed(() => this._snippets()['settingsPanel']);
	protected readonly _dynamicCode = computed(() => this._snippets()['dynamic']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
