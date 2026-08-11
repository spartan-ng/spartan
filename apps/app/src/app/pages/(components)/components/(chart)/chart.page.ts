import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
import { link } from '@spartan-ng/app/app/shared/typography/link';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { hlmCode, hlmP, hlmUl } from '@spartan-ng/helm/typography';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { SectionSubSubHeading } from '../../../../shared/layout/section-sub-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { ChartLegend } from './chart--legend.example';
import { ChartLine } from './chart--line.example';
import { ChartPreview, defaultImports, defaultSkeleton } from './chart.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Chart', api: 'chart' },
	meta: metaWith('spartan/ui - Chart', 'Accessible charts powered by TanStack Charts with Spartan theming.'),
	title: 'spartan/ui - Chart',
};

@Component({
	selector: 'spartan-chart',
	imports: [
		MainSection,
		InstallTabs,
		Code,
		SectionIntro,
		SectionSubHeading,
		SectionSubSubHeading,
		Tabs,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		ChartPreview,
		ChartLine,
		ChartLegend,
		HlmAlertImports,
		UIApiDocs,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Chart"
				lead="Accessible charts powered by TanStack Charts with Spartan theming."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="about">About</spartan-section-sub-heading>
			<p class="${hlmP}">
				Chart integrates the official
				<a href="https://tanstack.com/charts/latest" target="_blank" rel="noreferrer" class="${link}">
					TanStack Charts
				</a>
				Angular adapter. TanStack owns the chart grammar, rendering, interaction, focus, and accessibility; Spartan
				provides semantic colors, dark-mode integration, and tooltip styling.
			</p>

			<div class="mt-6" hlmAlert>
				<div hlmAlertDescription>
					TanStack Charts is currently pre-alpha. Its API can change between releases, so keep
					<code class="${hlmCode}">&#64;tanstack/charts</code>
					and
					<code class="${hlmCode}">&#64;tanstack/angular-charts</code>
					on matching versions.
				</div>
			</div>

			<spartan-install-tabs primitive="chart">
				<p class="${hlmP}">
					The generator installs both TanStack packages and copies the Spartan chart integration into your project.
				</p>
			</spartan-install-tabs>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<p class="${hlmP}">
				Apply
				<code class="${hlmCode}">hlmChart</code>
				to the official
				<code class="${hlmCode}">tanstack-chart</code>
				component. Add
				<code class="${hlmCode}">HLM_CHART_THEME</code>
				to the definition and enable tooltips with
				<code class="${hlmCode}">hlmChartTooltip()</code>
				as shown in the complete example above.
			</p>

			<spartan-section-sub-heading id="theme">Theme</spartan-section-sub-heading>
			<p class="${hlmP}">
				The integration maps TanStack's foreground, muted, grid, palette, and tooltip surfaces to Spartan's semantic
				tokens. Override the categorical palette at any theme boundary:
			</p>
			<spartan-code
				class="mt-6"
				fileName="styles.css"
				code=".analytics-theme {
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
}"
			/>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__line" spartanH4>Line</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-line />
				</div>
				<spartan-code secondTab [code]="_lineCode()" />
			</spartan-tabs>

			<h3 id="examples__legend" spartanH4>Multiple series and legend</h3>
			<p class="${hlmP}">
				TanStack's
				<code class="${hlmCode}">colorLegend</code>
				uses the same resolved palette and typography as the chart.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-legend />
				</div>
				<spartan-code secondTab [code]="_legendCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="accessibility">Accessibility and SSR</spartan-section-sub-heading>
			<ul class="${hlmUl}">
				<li>
					Always provide a meaningful
					<code class="${hlmCode}">ariaLabel</code>
					.
				</li>
				<li>
					Use
					<code class="${hlmCode}">ariaDescription</code>
					for a concise summary of the current data.
				</li>
				<li>Provide an adjacent table or text summary when readers need exact values.</li>
				<li>Do not use color as the only way to communicate meaning.</li>
			</ul>
			<p class="${hlmP}">
				The Angular adapter currently verifies browser mounting, immutable updates, and teardown. Application SSR and
				hydration are not yet part of its tested public contract. These examples use an
				<code class="${hlmCode}">&#64;defer</code>
				block so Angular instantiates the adapter only in the browser; use the same pattern in SSR applications.
			</p>

			<p class="${hlmP}">
				For chart composition and scale APIs, see TanStack's
				<a
					href="https://tanstack.com/charts/latest/docs/concepts/grammar-of-graphics"
					target="_blank"
					rel="noreferrer"
					class="${link}"
				>
					grammar of graphics
				</a>
				and
				<a
					href="https://tanstack.com/charts/latest/docs/framework/angular/adapter"
					target="_blank"
					rel="noreferrer"
					class="${link}"
				>
					Angular adapter
				</a>
				documentation.
			</p>

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
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('chart');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _lineCode = computed(() => this._snippets()['line']);
	protected readonly _legendCode = computed(() => this._snippets()['legend']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
