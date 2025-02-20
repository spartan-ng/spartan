import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { hlmCode, hlmP } from '@spartan-ng/ui-typography-helm';
import { CodePreviewDirective } from '../../../../shared/code/code-preview.directive';
import { CodeComponent } from '../../../../shared/code/code.component';
import { MainSectionDirective } from '../../../../shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../../shared/layout/section-sub-heading.component';
import { TabsCliComponent } from '../../../../shared/layout/tabs-cli.component';
import { TabsComponent } from '../../../../shared/layout/tabs.component';
import { metaWith } from '../../../../shared/meta/meta.util';
import { TablePreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './table.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Table' },
	meta: metaWith('spartan/ui - Table', 'A responsive table component.'),
	title: 'spartan/ui - Table',
};
@Component({
	selector: 'spartan-table',
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
		TablePreviewComponent,
		RouterLink,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Table" lead="A responsive table component." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-table-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui table"
				ngCode="ng g @spartan-ng/cli:ui table"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="data-table">Data Table</spartan-section-sub-heading>
			<p class="${hlmP}">
				You can use the
				<code class="${hlmCode} mr-0.5">brn-table</code>
				component to build more complex data tables.
			</p>
			<p class="${hlmP}">
				See the
				<a class="font-semibold underline underline-offset-4" routerLink="/components/data-table">Data Table</a>
				documentation for more information.
			</p>
			<p class="${hlmP}">We are also working on an example using the data table...</p>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="tabs" label="Tabs" />
				<spartan-page-bottom-nav-link direction="previous" href="switch" label="Switch" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class SkeletonPageComponent {
	protected readonly defaultCode = defaultCode;
	protected readonly defaultSkeleton = defaultSkeleton;
	protected readonly defaultImports = defaultImports;
}
