import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { CodePreviewDirective } from '../../../../../shared/code/code-preview.directive';
import { CodeComponent } from '../../../../../shared/code/code.component';
import { MainSectionDirective } from '../../../../../shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '../../../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../../../shared/layout/section-sub-heading.component';
import { TabsCliComponent } from '../../../../../shared/layout/tabs-cli.component';
import { TabsComponent } from '../../../../../shared/layout/tabs.component';
import { UIApiDocsComponent } from '../../../../../shared/layout/ui-docs-section/ui-docs-section.component';
import { metaWith } from '../../../../../shared/meta/meta.util';
import { defaultCode } from './table.generated';
import { TablePreviewComponent, defaultImports, defaultSkeleton } from './table.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Table', api: 'table' },
	meta: metaWith('spartan/ui - Table', 'A responsive table component.'),
	title: 'spartan/ui - Table',
};
@Component({
	selector: 'spartan-table',
	imports: [
		UIApiDocsComponent,
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
			<spartan-section-intro name="Table" lead="Apply responsive styles to a native HTML table. " />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-table-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui table"
				ngCode="ng g @spartan-ng/cli:ui table"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-section-sub-heading id="data-table">Data Table</spartan-section-sub-heading>
			<p class="${hlmP}">
				For more complex tables, have a look at the data table , which is powered by the incredible work of
				<code class="${hlmCode} mr-0.5">TanStack-Table</code>
				.
			</p>
			<p class="${hlmP}">
				See the
				<a class="font-semibold underline underline-offset-4" routerLink="/components/data-table">Data Table</a>
				documentation for more information.
			</p>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="tabs" label="Tabs" />
				<spartan-page-bottom-nav-link direction="previous" href="switch" label="Switch" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class SkeletonPageComponent {
	protected readonly _defaultCode = defaultCode;
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
