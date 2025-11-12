import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { CollapsibleAnimatedExample } from '@spartan-ng/app/app/pages/(components)/components/(collapsible)/collapsible--animated.example';
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
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
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
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		CollapsiblePreview,
		SectionSubSubHeading,
		CollapsibleAnimatedExample,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Collapsible" lead="An interactive component which expands/collapses a panel." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-collapsible-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui collapsible" ngCode="ng g @spartan-ng/cli:ui collapsible" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__sizes" spartanH4>Animated</h3>
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
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
