import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { HlmCalendarComponent } from '@spartan-ng/ui-calendar-helm';
import { CodeComponent } from '../../../../shared/code/code.component';
import { PageBottomNavLinkComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../../shared/layout/section-sub-heading.component';
import { TabsCliComponent } from '../../../../shared/layout/tabs-cli.component';
import { TabsComponent } from '../../../../shared/layout/tabs.component';
import { metaWith } from '../../../../shared/meta/meta.util';
import { CalendarPreviewComponent, codeSkeleton, defaultCode, defaultImports } from './calendar.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Calendar' },
	meta: metaWith('spartan/ui - Calendar', 'A date field component that allows users to enter and edit date.'),
	title: 'spartan/ui - Calendar',
};

@Component({
	selector: 'spartan-calendar',
	standalone: true,
	imports: [
		HlmCalendarComponent,
		CalendarPreviewComponent,
		SectionIntroComponent,
		TabsComponent,
		CodeComponent,
		SectionSubHeadingComponent,
		TabsCliComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		PageNavComponent,
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
			<spartan-cli-tabs class="mt-4" nxCode="npx nx g @spartan-ng/cli:ui calendar" ngCode="ng g @spartan-ng/cli:ui calendar" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="codeSkeleton" />
			</div>

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
}
