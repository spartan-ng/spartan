import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
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
import { ChartAreaPreview, defaultImports, defaultSkeleton } from './chart--area.preview';
import { ChartBarPreview } from './chart--bar.preview';
import { ChartLinePreview } from './chart--line.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Chart', api: 'chart' },
	meta: metaWith('spartan/ui - Chart', 'Beautiful charts built with @unovis/angular.'),
	title: 'spartan/ui - Chart',
};

@Component({
	selector: 'spartan-chart',
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
		ChartAreaPreview,
		ChartLinePreview,
		ChartBarPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Chart"
				lead="Beautiful charts built with @unovis/angular. Copy and paste into your apps."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-area-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="chart" [showOnlyVega]="false" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="line" spartanH4>Line Chart</h3>
			<p class="${hlmP}">
				A line chart with multiple series using
				<code class="${hlmCode}">vis-line</code>
				with the
				<code class="${hlmCode}">CurveType.MonotoneX</code>
				curve type.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-line-preview />
				</div>
				<spartan-code secondTab [code]="_lineCode()" />
			</spartan-tabs>

			<h3 id="bar" spartanH4>Bar Chart</h3>
			<p class="${hlmP}">
				A grouped bar chart using
				<code class="${hlmCode}">vis-grouped-bar</code>
				with rounded corners.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-bar-preview />
				</div>
				<spartan-code secondTab [code]="_barCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="checkbox" label="Checkbox" />
				<spartan-page-bottom-nav-link direction="previous" href="carousel" label="Carousel" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class ChartPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('chart');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _lineCode = computed(() => this._snippets()['line']);
	protected readonly _barCode = computed(() => this._snippets()['bar']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
