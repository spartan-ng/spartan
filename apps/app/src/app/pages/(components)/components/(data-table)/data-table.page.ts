import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmP } from '@spartan-ng/ui-typography-helm';
import { defaultImports, defaultSkeleton } from '../(context-menu)/context-menu.preview';
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
import { DataTablePreviewComponent, defaultCode } from './data-table.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Data Table' },
	meta: metaWith('spartan/ui - Data Table', 'Powerful table and datagrids similar to Angular Material Tables.'),
	title: 'spartan/ui - Data Table',
};

@Component({
	selector: 'spartan-data-table',
	standalone: true,
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
		DataTablePreviewComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Data Table"
				lead="Powerful table and datagrids similar to Angular Material Tables.."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-data-table-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui table"
				ngCode="ng g @spartan-ng/cli:ui table"
			/>

			<spartan-section-sub-heading id="tutorial">Tutorial</spartan-section-sub-heading>
			<p class="${hlmP} mb-6">Coming soon...</p>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="dialog" label="Dialog" />
				<spartan-page-bottom-nav-link direction="previous" href="context-menu" label="Context Menu" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class DataTablePageComponent {
	protected readonly defaultCode = defaultCode;
	protected readonly defaultSkeleton = defaultSkeleton;
	protected readonly defaultImports = defaultImports;
}
