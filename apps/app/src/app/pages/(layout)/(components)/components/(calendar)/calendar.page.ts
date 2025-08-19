import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { CodePreview } from '@spartan-ng/app/app/shared/code/code-preview';
import { hlmCode, hlmH4, hlmP } from '@spartan-ng/helm/typography';
import { Code } from '../../../../../shared/code/code';
import { PageBottomNav } from '../../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../../shared/layout/tabs';
import { TabsCli } from '../../../../../shared/layout/tabs-cli';
import { UIApiDocs } from '../../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../../shared/meta/meta.util';
import { CalendarMultipleExample } from './calendar--multiple.example';
import { CalendarPreview, defaultImports, defaultSkeleton } from './calendar.preview';

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
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui calendar"
				ngCode="ng g @spartan-ng/cli:ui calendar"
			/>

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
			<h3 id="examples__multiple_selection" class="${hlmH4} mb-2 mt-6">Multiple Selection</h3>

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

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="carousel" label="Carousel" />
				<spartan-page-bottom-nav-link direction="previous" href="button" label="Button" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class CardPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('calendar');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _multipleCode = computed(() => this._snippets()['multiple']);
	protected readonly _defaultImports = defaultImports;
	protected readonly _defaultSkeleton = defaultSkeleton;
}
