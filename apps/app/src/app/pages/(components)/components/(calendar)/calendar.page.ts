import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { CalendarRangeExample } from '@spartan-ng/app/app/pages/(components)/components/(calendar)/calendar--range.example';
import { CalendarYearAndMonthExample } from '@spartan-ng/app/app/pages/(components)/components/(calendar)/calendar--year-and-month.example';
import { CodePreview } from '@spartan-ng/app/app/shared/code/code-preview';
import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { Code } from '../../../../shared/code/code';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { CalendarMultipleExample } from './calendar--multiple.example';
import { CalendarPreview, defaultImports, defaultSkeleton, i18nProviders, i18nRuntimeChange } from './calendar.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Calendar', api: 'calendar' },
	meta: metaWith('spartan/ui - Calendar', 'A date field component that allows users to enter and edit date.'),
	title: 'spartan/ui - Calendar',
};

@Component({
	selector: 'spartan-calendar',
	imports: [
		UIApiDocs,
		CalendarPreview,
		SectionIntro,
		Tabs,
		Code,
		CodePreview,
		SectionSubHeading,
		TabsCli,
		PageBottomNav,
		PageBottomNavLink,
		PageNav,
		CalendarMultipleExample,
		CalendarRangeExample,
		CalendarYearAndMonthExample,
		MainSection,
		SectionSubSubHeading,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Calendar" lead="A date field component that allows users to enter and edit date." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-calendar-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui calendar" ngCode="ng g @spartan-ng/cli:ui calendar" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="i18n">Internationalization</spartan-section-sub-heading>

			<p class="${hlmP} mb-6">
				The calendar supports internationalization (i18n) via the
				<code class="${hlmCode}">BrnCalendarI18nService</code>
				. By default, weekday names and month headers are rendered in English. You can provide a custom configuration
				globally or swap it at runtime to support multiple locales.
			</p>

			<h3 id="i18n__global_config" spartanH4>Global Configuration</h3>

			<p class="${hlmP} mb-6">
				Use
				<code class="${hlmCode}">provideBrnCalendarI18n</code>
				in your app bootstrap to configure labels and formats globally:
			</p>

			<spartan-code [code]="_i18nProviders" />

			<h3 id="i18n__runtime_config" spartanH4>Runtime Configuration</h3>

			<p class="${hlmP} mb-6">
				You can dynamically switch calendar language at runtime by injecting
				<code class="${hlmCode}">BrnCalendarI18nService</code>
				and calling
				<code class="${hlmCode}">use()</code>
				:
			</p>
			<spartan-code [code]="_i18nRuntimeChange" />

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__multiple_selection" spartanH4>Multiple Selection</h3>

			<p class="${hlmP} mb-6">
				Use
				<code class="${hlmCode}">hlm-calendar-multi</code>
				for multiple date selection. Limit the selectable dates using
				<code class="${hlmCode}">minSelection</code>
				and
				<code class="${hlmCode}">maxSelection</code>
				inputs.
			</p>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-calendar-multiple />
				</div>
				<spartan-code secondTab [code]="_multipleCode()" />
			</spartan-tabs>

			<h3 id="examples__range_selection" spartanH4>Range Selection</h3>

			<p class="${hlmP} mb-6">
				Use
				<code class="${hlmCode}">hlm-calendar-range</code>
				for range date selection. Set the range by using
				<code class="${hlmCode}">startDate</code>
				and
				<code class="${hlmCode}">endDate</code>
				inputs.
			</p>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-calendar-range />
				</div>
				<spartan-code secondTab [code]="_rangeCode()" />
			</spartan-tabs>

			<h3 id="examples__month_and_year_selection" spartanH4>Month and Year Selector</h3>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-calendar-year-and-month />
				</div>
				<spartan-code secondTab [code]="_yearAndMonthCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="carousel" label="Carousel" />
				<spartan-page-bottom-nav-link direction="previous" href="button-group" label="Button Group" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class CardPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('calendar');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _multipleCode = computed(() => this._snippets()['multiple']);
	protected readonly _rangeCode = computed(() => this._snippets()['range']);
	protected readonly _yearAndMonthCode = computed(() => this._snippets()['yearAndMonth']);
	protected readonly _defaultImports = defaultImports;
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _i18nProviders = i18nProviders;
	protected readonly _i18nRuntimeChange = i18nRuntimeChange;
}
