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
import { ChartAreaGradientPreview } from './chart--area-gradient.preview';
import { ChartAreaStackedPreview } from './chart--area-stacked.preview';
import { ChartAreaPreview } from './chart--area.preview';
import { ChartBarHorizontalPreview } from './chart--bar-horizontal.preview';
import { ChartBarLabelPreview } from './chart--bar-label.preview';
import { ChartBarMixedPreview } from './chart--bar-mixed.preview';
import { ChartBarNegativePreview } from './chart--bar-negative.preview';
import { ChartBarStackedPreview } from './chart--bar-stacked.preview';
import { ChartBarPreview } from './chart--bar.preview';
import { ChartDonutPreview } from './chart--donut.preview';
import { ChartLineDotsColorsPreview } from './chart--line-dots-colors.preview';
import { ChartLineDotsPreview } from './chart--line-dots.preview';
import { ChartLineStepPreview } from './chart--line-step.preview';
import { ChartLinePreview } from './chart--line.preview';
import { ChartPieDonutTextPreview } from './chart--pie-donut-text.preview';
import { ChartPieLabelPreview } from './chart--pie-label.preview';
import { ChartPieLegendPreview } from './chart--pie-legend.preview';
import { ChartPiePreview } from './chart--pie.preview';
import { ChartRadarDefaultPreview } from './chart--radar-default.preview';
import { ChartRadarLegendPreview } from './chart--radar-legend.preview';
import { ChartRadarMultiplePreview } from './chart--radar-multiple.preview';
import { ChartTooltipAdvancedPreview } from './chart--tooltip-advanced.preview';
import { ChartPreview, defaultImports, defaultSkeleton } from './chart.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Chart', api: 'chart' },
	meta: metaWith('spartan/ui - Chart', 'Beautiful charts built with Apache ECharts.'),
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
		ChartAreaGradientPreview,
		ChartAreaPreview,
		ChartAreaStackedPreview,
		ChartBarPreview,
		ChartBarLabelPreview,
		ChartBarHorizontalPreview,
		ChartBarMixedPreview,
		ChartBarNegativePreview,
		ChartBarStackedPreview,
		ChartDonutPreview,
		ChartLineDotsColorsPreview,
		ChartLineDotsPreview,
		ChartLinePreview,
		ChartLineStepPreview,
		ChartPieDonutTextPreview,
		ChartPieLegendPreview,
		ChartPieLabelPreview,
		ChartPiePreview,
		ChartRadarDefaultPreview,
		ChartRadarLegendPreview,
		ChartRadarMultiplePreview,
		ChartTooltipAdvancedPreview,
		ChartPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Chart"
				lead="Beautiful charts built with Apache ECharts. Copy and paste into your apps."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="chart" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="bar" spartanH4>Bar Chart</h3>
			<p class="${hlmP}">
				A bar chart with multiple series using
				<code class="${hlmCode}">type: 'bar'</code>
				with rounded corners.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-bar-preview />
				</div>
				<spartan-code secondTab [code]="_barCode()" />
			</spartan-tabs>

			<h3 id="line" spartanH4>Line Chart</h3>
			<p class="${hlmP}">
				A line chart with multiple series using
				<code class="${hlmCode}">type: 'line'</code>
				with smooth curves.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-line-preview />
				</div>
				<spartan-code secondTab [code]="_lineCode()" />
			</spartan-tabs>

			<h3 id="area" spartanH4>Area Chart</h3>
			<p class="${hlmP}">
				An area chart using
				<code class="${hlmCode}">areaStyle</code>
				with gradient fill.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-area-preview />
				</div>
				<spartan-code secondTab [code]="_areaCode()" />
			</spartan-tabs>

			<h3 id="pie" spartanH4>Pie Chart</h3>
			<p class="${hlmP}">
				A donut pie chart using
				<code class="${hlmCode}">type: 'pie'</code>
				with inner radius.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-pie-preview />
				</div>
				<spartan-code secondTab [code]="_pieCode()" />
			</spartan-tabs>

			<h3 id="donut" spartanH4>Donut Chart</h3>
			<p class="${hlmP}">
				A donut chart with center label using
				<code class="${hlmCode}">type: 'pie'</code>
				with a larger inner radius.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-donut-preview />
				</div>
				<spartan-code secondTab [code]="_donutCode()" />
			</spartan-tabs>

			<h3 id="bar-horizontal" spartanH4>Bar Chart - Horizontal</h3>
			<p class="${hlmP}">
				A horizontal bar chart using
				<code class="${hlmCode}">type: 'bar'</code>
				with swapped axes.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-bar-horizontal-preview />
				</div>
				<spartan-code secondTab [code]="_barHorizontalCode()" />
			</spartan-tabs>

			<h3 id="bar-stacked" spartanH4>Bar Chart - Stacked</h3>
			<p class="${hlmP}">
				A stacked bar chart using
				<code class="${hlmCode}">stack</code>
				with a legend.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-bar-stacked-preview />
				</div>
				<spartan-code secondTab [code]="_barStackedCode()" />
			</spartan-tabs>

			<h3 id="bar-mixed" spartanH4>Bar Chart - Mixed</h3>
			<p class="${hlmP}">
				A mixed bar chart using
				<code class="${hlmCode}">type: 'bar'</code>
				with per-item colors.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-bar-mixed-preview />
				</div>
				<spartan-code secondTab [code]="_barMixedCode()" />
			</spartan-tabs>

			<h3 id="bar-negative" spartanH4>Bar Chart - Negative</h3>
			<p class="${hlmP}">
				A bar chart with negative values using
				<code class="${hlmCode}">type: 'bar'</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-bar-negative-preview />
				</div>
				<spartan-code secondTab [code]="_barNegativeCode()" />
			</spartan-tabs>

			<h3 id="bar-label" spartanH4>Bar Chart - Label</h3>
			<p class="${hlmP}">
				A bar chart with data labels using
				<code class="${hlmCode}">label: {{ '{' }} show: true {{ '}' }}</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-bar-label-preview />
				</div>
				<spartan-code secondTab [code]="_barLabelCode()" />
			</spartan-tabs>

			<h3 id="line-dots-colors" spartanH4>Line Chart - Dots Colors</h3>
			<p class="${hlmP}">
				A line chart with colored dot markers using
				<code class="${hlmCode}">symbol: 'circle'</code>
				per series.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-line-dots-colors-preview />
				</div>
				<spartan-code secondTab [code]="_lineDotsColorsCode()" />
			</spartan-tabs>

			<h3 id="area-gradient" spartanH4>Area Chart - Gradient</h3>
			<p class="${hlmP}">
				An area chart with a two-tone gradient fill using
				<code class="${hlmCode}">areaStyle</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-area-gradient-preview />
				</div>
				<spartan-code secondTab [code]="_areaGradientCode()" />
			</spartan-tabs>

			<h3 id="line-step" spartanH4>Line Chart - Step</h3>
			<p class="${hlmP}">
				A step line chart using
				<code class="${hlmCode}">step: 'start'</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-line-step-preview />
				</div>
				<spartan-code secondTab [code]="_lineStepCode()" />
			</spartan-tabs>

			<h3 id="line-dots" spartanH4>Line Chart - Dots</h3>
			<p class="${hlmP}">
				A line chart with dot markers using
				<code class="${hlmCode}">symbol: 'circle'</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-line-dots-preview />
				</div>
				<spartan-code secondTab [code]="_lineDotsCode()" />
			</spartan-tabs>

			<h3 id="area-stacked" spartanH4>Area Chart - Stacked</h3>
			<p class="${hlmP}">
				A stacked area chart using
				<code class="${hlmCode}">stack</code>
				with gradient fills.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-area-stacked-preview />
				</div>
				<spartan-code secondTab [code]="_areaStackedCode()" />
			</spartan-tabs>

			<h3 id="pie-legend" spartanH4>Pie Chart - Legend</h3>
			<p class="${hlmP}">
				A pie chart with a visible legend using
				<code class="${hlmCode}">type: 'pie'</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-pie-legend-preview />
				</div>
				<spartan-code secondTab [code]="_pieLegendCode()" />
			</spartan-tabs>

			<h3 id="pie-label" spartanH4>Pie Chart - Label</h3>
			<p class="${hlmP}">
				A pie chart with visible labels using
				<code class="${hlmCode}">type: 'pie'</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-pie-label-preview />
				</div>
				<spartan-code secondTab [code]="_pieLabelCode()" />
			</spartan-tabs>

			<h3 id="pie-donut-text" spartanH4>Pie Chart - Donut with Text</h3>
			<p class="${hlmP}">
				A donut chart with a formatted center label using
				<code class="${hlmCode}">graphic</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-pie-donut-text-preview />
				</div>
				<spartan-code secondTab [code]="_pieDonutTextCode()" />
			</spartan-tabs>

			<h3 id="radar-legend" spartanH4>Radar Chart - Legend</h3>
			<p class="${hlmP}">
				A radar chart with a visible legend using
				<code class="${hlmCode}">legend: {{ '{' }} show: true {{ '}' }}</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-radar-legend-preview />
				</div>
				<spartan-code secondTab [code]="_radarLegendCode()" />
			</spartan-tabs>

			<h3 id="radar" spartanH4>Radar Chart</h3>
			<p class="${hlmP}">
				A radar chart using
				<code class="${hlmCode}">type: 'radar'</code>
				with multiple indicators.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-radar-default-preview />
				</div>
				<spartan-code secondTab [code]="_radarDefaultCode()" />
			</spartan-tabs>

			<h3 id="radar-multiple" spartanH4>Radar Chart - Multiple</h3>
			<p class="${hlmP}">
				A radar chart with multiple series using
				<code class="${hlmCode}">type: 'radar'</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-radar-multiple-preview />
				</div>
				<spartan-code secondTab [code]="_radarMultipleCode()" />
			</spartan-tabs>

			<h3 id="tooltip-advanced" spartanH4>Tooltip - Advanced</h3>
			<p class="${hlmP}">
				A custom tooltip using ECharts
				<code class="${hlmCode}">formatter</code>
				with totals.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-chart-tooltip-advanced-preview />
				</div>
				<spartan-code secondTab [code]="_tooltipAdvancedCode()" />
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
	protected readonly _barCode = computed(() => this._snippets()['bar']);
	protected readonly _lineCode = computed(() => this._snippets()['line']);
	protected readonly _areaCode = computed(() => this._snippets()['area']);
	protected readonly _pieCode = computed(() => this._snippets()['pie']);
	protected readonly _donutCode = computed(() => this._snippets()['donut']);
	protected readonly _barHorizontalCode = computed(() => this._snippets()['barHorizontal']);
	protected readonly _barStackedCode = computed(() => this._snippets()['barStacked']);
	protected readonly _barMixedCode = computed(() => this._snippets()['barMixed']);
	protected readonly _barNegativeCode = computed(() => this._snippets()['barNegative']);
	protected readonly _barLabelCode = computed(() => this._snippets()['barLabel']);
	protected readonly _lineDotsColorsCode = computed(() => this._snippets()['lineDotsColors']);
	protected readonly _areaGradientCode = computed(() => this._snippets()['areaGradient']);
	protected readonly _pieDonutTextCode = computed(() => this._snippets()['pieDonutText']);
	protected readonly _radarLegendCode = computed(() => this._snippets()['radarLegend']);
	protected readonly _lineStepCode = computed(() => this._snippets()['lineStep']);
	protected readonly _lineDotsCode = computed(() => this._snippets()['lineDots']);
	protected readonly _areaStackedCode = computed(() => this._snippets()['areaStacked']);
	protected readonly _pieLegendCode = computed(() => this._snippets()['pieLegend']);
	protected readonly _pieLabelCode = computed(() => this._snippets()['pieLabel']);
	protected readonly _radarDefaultCode = computed(() => this._snippets()['radarDefault']);
	protected readonly _radarMultipleCode = computed(() => this._snippets()['radarMultiple']);
	protected readonly _tooltipAdvancedCode = computed(() => this._snippets()['tooltipAdvanced']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
