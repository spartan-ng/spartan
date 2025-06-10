import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmCode, hlmH4, hlmP } from '@spartan-ng/helm/typography';
import { CodeComponent } from '../../../../shared/code/code.component';
import { PageBottomNavLinkComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../../shared/layout/section-sub-heading.component';
import { TabsCliComponent } from '../../../../shared/layout/tabs-cli.component';
import { TabsComponent } from '../../../../shared/layout/tabs.component';
import { UIApiDocsComponent } from '../../../../shared/layout/ui-docs-section/ui-docs-section.component';
import { metaWith } from '../../../../shared/meta/meta.util';
import { calendarMultipleCode, CalendarMultipleExampleComponent } from './calendar--multiple.example';
import { CalendarPreviewComponent, codeSkeleton, defaultCode, defaultImports } from './calendar.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Calendar', api: 'calendar' },
	meta: metaWith('spartan/ui - Calendar', 'A date field component that allows users to enter and edit date.'),
	title: 'spartan/ui - Calendar',
};

@Component({
	selector: 'spartan-calendar',
	imports: [
		UIApiDocsComponent,
		CalendarPreviewComponent,
		SectionIntroComponent,
		TabsComponent,
		CodeComponent,
		SectionSubHeadingComponent,
		TabsCliComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		PageNavComponent,
		CalendarMultipleExampleComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Calendar" lead="A date field component that allows users to enter and edit date." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-calendar-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui calendar"
				ngCode="ng g @spartan-ng/cli:ui calendar"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="codeSkeleton" />
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
				<spartan-code secondTab [code]="calendarMultipleCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="carousel" label="Carousel" />
				<spartan-page-bottom-nav-link direction="previous" href="button" label="Button" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class CardPageComponent {
	protected readonly defaultCode = defaultCode;
	protected readonly defaultImports = defaultImports;
	protected readonly codeSkeleton = codeSkeleton;
	protected readonly calendarMultipleCode = calendarMultipleCode;
}
