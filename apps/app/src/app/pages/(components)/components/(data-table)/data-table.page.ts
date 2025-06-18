import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmP } from '@spartan-ng/helm/typography';
import { defaultImports, defaultSkeleton } from '../(context-menu)/context-menu.preview';
import { CodePreviewDirective } from '../../../../shared/code/code-preview.directive';
import { CodeComponent } from '../../../../shared/code/code.component';
import { MainSectionDirective } from '../../../../shared/layout/main-section.directive';

import { link } from '@spartan-ng/app/app/shared/typography/link';
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
		DataTablePreviewComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Data Table" lead="Powerful table and datagrids similar powered by TanStack Table" />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-data-table-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="about">About</spartan-section-sub-heading>
			<p class="${hlmP} mb-6">
				Data-Table is built on top of
				<a href="https://tanstack.com/table" target="_blank" rel="noreferrer" hlmBtn variant="link" class="${link}">
					TanStack-Table
				</a>
				by
				<a
					href="https://github.com/tannerlinsley"
					target="_blank"
					rel="noreferrer"
					hlmBtn
					variant="link"
					class="${link}"
				>
					&#64;tannerlinsley
				</a>
				.
			</p>
			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui table"
				ngCode="ng g @spartan-ng/cli:ui table"
			/>
			<div class="${hlmP} mb-6">
				In order to use Data-Table example, you need to install Tanstack Table. See the installation documetation for
				Angular Table for more information.
				<spartan-code class="mt-4" [code]="'https://tanstack.com/table/v8/docs/installation'" />
			</div>

			<spartan-section-sub-heading id="tutorial">Documentation</spartan-section-sub-heading>
			<p class="${hlmP} mb-6">
				For more information you can check out our Tasks example and have a look at the documentation of TanStack table.
			</p>

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
