import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { CodePreviewDirective } from '../../../../shared/code/code-preview.directive';
import { CodeComponent } from '../../../../shared/code/code.component';
import { MainSectionDirective } from '../../../../shared/layout/main-section.directive';
import { PageBottomNavPlaceholderComponent } from '../../../../shared/layout/page-bottom-nav-placeholder.component';
import { PageBottomNavLinkComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../../shared/layout/section-sub-heading.component';
import { TabsCliComponent } from '../../../../shared/layout/tabs-cli.component';
import { TabsComponent } from '../../../../shared/layout/tabs.component';
import { metaWith } from '../../../../shared/meta/meta.util';
import { HoverCardPreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './hover-card.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Hover Card' },
	meta: metaWith('spartan/ui - Hover Card', 'For sighted users to preview content available behind a link.'),
	title: 'spartan/ui - Hover Card',
};

@Component({
	selector: 'spartan-hover-card',
	imports: [
		MainSectionDirective,
		CodeComponent,
		SectionIntroComponent,
		SectionSubHeadingComponent,
		TabsComponent,
		TabsCliComponent,
		CodePreviewDirective,
		PageNavComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		PageBottomNavPlaceholderComponent,
		HoverCardPreviewComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Hover Card" lead="For sighted users to preview content available behind a link." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-hover-card-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui hovercard"
				ngCode="ng g @spartan-ng/cli:ui hovercard"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="defaultSkeleton" />
			</div>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="icon" label="Icon" />
				<spartan-page-bottom-nav-link direction="previous" href="dropdown-menu" label="Dropdown" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class CardPageComponent {
	protected readonly defaultCode = defaultCode;
	protected readonly defaultSkeleton = defaultSkeleton;
	protected readonly defaultImports = defaultImports;
}
