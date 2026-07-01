import type { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { Code } from '@spartan-ng/app/app/shared/code/code';
import { CodePreview } from '@spartan-ng/app/app/shared/code/code-preview';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { RtlHeader } from '@spartan-ng/app/app/shared/code/rtl-header';
import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { PageBottomNav } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav';
import { SectionIntro } from '@spartan-ng/app/app/shared/layout/section-intro';
import { SectionSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-heading';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { Tabs } from '@spartan-ng/app/app/shared/layout/tabs';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { link } from '@spartan-ng/app/app/shared/typography/link';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { hlmCode, hlmP, hlmUl } from '@spartan-ng/helm/typography';
import { ChartsAxis } from './charts--axis.example';
import { ChartsBasic } from './charts--basic.example';
import { ChartsGrid } from './charts--grid.example';
import { ChartsLegend } from './charts--legend.example';
import { ChartsRtl } from './charts--rtl.example';
import { ChartsTooltip } from './charts--tooltip.example';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Chart' },
	meta: metaWith('spartan/ui - Chart', 'Beautiful charts built with d3 and styled to match shadcn/ui.'),
	title: 'spartan/ui - Chart',
};

@Component({
	selector: 'spartan-charts-page',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		RouterLink,
		MainSection,
		SectionIntro,
		SectionSubHeading,
		SectionSubSubHeading,
		Tabs,
		Code,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		HlmAlertImports,
		NgIcon,
		RtlHeader,
		CodeRtlPreview,
		ChartsBasic,
		ChartsGrid,
		ChartsAxis,
		ChartsTooltip,
		ChartsLegend,
		ChartsRtl,
	],
	providers: [provideIcons({ lucideTriangleAlert })],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Chart"
				lead="Beautiful charts built with d3 and styled to match shadcn/ui. Built to be composed, themed, and copied into your app."
				showThemeToggle
			/>

			<hlm-alert class="mt-2">
				<ng-icon name="lucideTriangleAlert" />
				<h4 hlmAlertTitle>Alpha</h4>
				<p hlmAlertDescription>
					Charts are an experimental package. The API is still evolving, and any release may include breaking changes.
				</p>
			</hlm-alert>

			<p class="${hlmP}">
				Charts live in their own package,
				<span class="${hlmCode}">&#64;spartan-ng/charts</span>
				. Each chart is a container component (such as
				<span class="${hlmCode}">spn-bar-chart</span>
				) that you compose with small configuration components for the series, axes, grid, tooltip and legend. The
				container reads your data and renders the SVG; the children just describe what to draw.
			</p>

			<spartan-section-sub-heading first id="installation">Installation</spartan-section-sub-heading>
			<p class="${hlmP}">Install the charts package from npm.</p>
			<spartan-code language="sh" [code]="_installCommand" />
			<p class="${hlmP}">
				Charts colour their series from the
				<span class="${hlmCode}">--chart-1</span>
				…
				<span class="${hlmCode}">--chart-5</span>
				CSS variables. These are added to your stylesheet by
				<span class="${hlmCode}">&#64;spartan-ng/cli:init</span>
				- if you set your theme up by hand, add them yourself (see
				<a class="${link}" routerLink="." fragment="colors">Colors</a>
				).
			</p>

			<spartan-section-sub-heading id="your-first-chart">Your First Chart</spartan-section-sub-heading>
			<p class="${hlmP}">Let's build a bar chart from scratch, one piece at a time.</p>

			<h3 id="chart-data" spartanH4>Chart data</h3>
			<p class="${hlmP}">
				Charts take a plain array of objects through the
				<span class="${hlmCode}">data</span>
				input. Each key in a row can be plotted as a series or used as an axis category.
			</p>
			<spartan-code [code]="_dataCode" />

			<h3 id="build-the-chart" spartanH4>Build the chart</h3>
			<p class="${hlmP}">
				Wrap the chart in
				<span class="${hlmCode}">spn-bar-chart</span>
				and give it the data. Add a
				<span class="${hlmCode}">spn-x-axis</span>
				bound to the
				<span class="${hlmCode}">month</span>
				key - it defines the category for each bar - then a
				<span class="${hlmCode}">spn-bar</span>
				per series. Size the chart with CSS: set a height and let it fill the available width.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-charts-basic class="w-full max-w-2xl" />
				</div>
				<spartan-code secondTab [code]="_snippets()['basic']" />
			</spartan-tabs>

			<h3 id="add-a-grid" spartanH4>Add a Grid</h3>
			<p class="${hlmP}">
				Add a
				<span class="${hlmCode}">spn-cartesian-grid</span>
				for the horizontal grid lines behind the bars.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-charts-grid class="w-full max-w-2xl" />
				</div>
				<spartan-code secondTab [code]="_snippets()['grid']" />
			</spartan-tabs>

			<h3 id="add-an-axis" spartanH4>Add an Axis</h3>
			<p class="${hlmP}">
				To add an x-axis, add the
				<span class="${hlmCode}">spn-x-axis</span>
				component.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-charts-axis class="w-full max-w-2xl" />
				</div>
				<spartan-code secondTab [code]="_snippets()['axis']" />
			</spartan-tabs>

			<h3 id="add-tooltip" spartanH4>Add Tooltip</h3>
			<p class="${hlmP}">
				Add a
				<span class="${hlmCode}">spn-tooltip</span>
				and project a
				<span class="${hlmCode}">spnTooltipContent</span>
				template. The template receives the hovered
				<span class="${hlmCode}">state</span>
				- its
				<span class="${hlmCode}">label</span>
				and a
				<span class="${hlmCode}">payload</span>
				row per series - so you control exactly how it looks with Tailwind.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-charts-tooltip class="w-full max-w-2xl" />
				</div>
				<spartan-code secondTab [code]="_snippets()['tooltip']" />
			</spartan-tabs>

			<h3 id="add-legend" spartanH4>Add Legend</h3>
			<p class="${hlmP}">
				Charts don't ship a legend element - render your own below the chart so it matches your design exactly. A
				centered row of coloured swatches and labels keeps it consistent with the
				<span class="${hlmCode}">--chart-*</span>
				series colours.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-charts-legend class="w-full max-w-2xl" />
				</div>
				<spartan-code secondTab [code]="_snippets()['legend']" />
			</spartan-tabs>

			<spartan-section-sub-heading id="colors">Colors</spartan-section-sub-heading>
			<p class="${hlmP}">
				Charts reference colours through CSS variables so they adapt to the active theme. The default palette is five
				<span class="${hlmCode}">--chart-*</span>
				tokens, defined for both light and dark mode.
			</p>
			<spartan-code fileName="styles.css" [code]="_themingCss" />
			<p class="${hlmP}">
				Reference them on any series with
				<span class="${hlmCode}">fill</span>
				or
				<span class="${hlmCode}">stroke</span>
				:
			</p>
			<spartan-code [code]="_colorUsageCode" />
			<p class="${hlmP}">
				To colour each datum differently (common for pie and single-series bar charts), add a
				<span class="${hlmCode}">fill</span>
				field to each row and the chart will use it:
			</p>
			<spartan-code [code]="_perDatumCode" />

			<spartan-section-sub-heading id="tooltip">Tooltip</spartan-section-sub-heading>
			<p class="${hlmP}">
				The
				<span class="${hlmCode}">spnTooltipContent</span>
				template's
				<span class="${hlmCode}">state</span>
				exposes everything needed to render a tooltip:
			</p>
			<ul class="${hlmUl}">
				<li>
					<span class="${hlmCode}">state.label</span>
					- the active category (e.g. the month).
				</li>
				<li>
					<span class="${hlmCode}">state.payload</span>
					- one entry per series, each with
					<span class="${hlmCode}">name</span>
					,
					<span class="${hlmCode}">value</span>
					,
					<span class="${hlmCode}">color</span>
					and
					<span class="${hlmCode}">dataKey</span>
					.
				</li>
			</ul>

			<spartan-section-sub-heading id="legend">Legend</spartan-section-sub-heading>
			<p class="${hlmP}">
				Legends are plain markup rather than a chart element, so you keep full control over their look. Render a row of
				items below (or above) the chart, each with a small swatch coloured from the same
				<span class="${hlmCode}">--chart-*</span>
				token as its series:
			</p>
			<spartan-code [code]="_legendMarkup" />

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-charts-rtl class="w-full max-w-2xl" />
				</div>
				<spartan-code secondTab [code]="_snippets()['rtl']" />
			</spartan-tabs>

			<spartan-section-sub-heading id="more-examples">More examples</spartan-section-sub-heading>
			<p class="${hlmP}">
				Browse the full gallery - bar, area, line, pie, radar and radial charts with dozens of variations - in the
				<a class="${link}" routerLink="/charts">charts showcase</a>
				.
			</p>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="/components/checkbox" label="Checkbox" />
				<spartan-page-bottom-nav-link direction="previous" href="/components/carousel" label="Carousel" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class ChartsDocsPage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippetService = inject(PrimitiveSnippetsService).getSnippets('charts');
	protected readonly _snippets = computed(() => this._snippetService());

	protected readonly _installCommand = 'npm install @spartan-ng/charts';

	protected readonly _dataCode = `export class BarChartExample {
	protected readonly data = [
		{ month: 'January', desktop: 186, mobile: 80 },
		{ month: 'February', desktop: 305, mobile: 200 },
		{ month: 'March', desktop: 237, mobile: 120 },
		{ month: 'April', desktop: 73, mobile: 190 },
		{ month: 'May', desktop: 209, mobile: 130 },
		{ month: 'June', desktop: 214, mobile: 140 },
	];
}`;

	protected readonly _themingCss = `:root {
	--chart-1: oklch(0.646 0.222 41.116);
	--chart-2: oklch(0.6 0.118 184.704);
	--chart-3: oklch(0.398 0.07 227.392);
	--chart-4: oklch(0.828 0.189 84.429);
	--chart-5: oklch(0.769 0.188 70.08);
}

.dark {
	--chart-1: oklch(0.488 0.243 264.376);
	--chart-2: oklch(0.696 0.17 162.48);
	--chart-3: oklch(0.769 0.188 70.08);
	--chart-4: oklch(0.627 0.265 303.9);
	--chart-5: oklch(0.645 0.246 16.439);
}`;

	protected readonly _colorUsageCode = `<spn-bar dataKey="desktop" name="Desktop" fill="var(--chart-1)" />
<spn-bar dataKey="mobile" name="Mobile" fill="var(--chart-2)" />`;

	protected readonly _perDatumCode = `protected readonly data = [
	{ browser: 'chrome', visitors: 275, fill: 'var(--chart-1)' },
	{ browser: 'safari', visitors: 200, fill: 'var(--chart-2)' },
	{ browser: 'firefox', visitors: 187, fill: 'var(--chart-3)' },
];`;

	protected readonly _legendMarkup = `<div class="flex items-center justify-center gap-4 pt-3">
	<div class="flex items-center gap-1.5">
		<span class="size-2 shrink-0 rounded-[2px] bg-[var(--chart-1)]"></span>
		<span class="text-foreground text-xs leading-none">Desktop</span>
	</div>
	<div class="flex items-center gap-1.5">
		<span class="size-2 shrink-0 rounded-[2px] bg-[var(--chart-2)]"></span>
		<span class="text-foreground text-xs leading-none">Mobile</span>
	</div>
</div>`;
}
