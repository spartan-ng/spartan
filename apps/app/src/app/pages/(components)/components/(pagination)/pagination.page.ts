import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmCode, hlmH4 } from '@spartan-ng/helm/typography';
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
import { UIApiDocsComponent } from '../../../../shared/layout/ui-docs-section/ui-docs-section.component';
import { metaWith } from '../../../../shared/meta/meta.util';
import { PaginationAdvancedQueryComponent } from './pagination--advanced-query.example';
import { PaginationAdvancedComponent } from './pagination--advanced.example';
import { PaginationIconOnlyComponent } from './pagination--icon-only.example';
import { PaginationQueryParamsComponent } from './pagination--query-params.example';
import {
	defaultCode,
	paginationAdvancedCode,
	paginationAdvancedQueryCode,
	paginationIconOnlyCode,
	paginationQueryParamsCode,
} from './pagination.generated';
import { PaginationPreviewComponent, defaultImports, defaultSkeleton } from './pagination.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Pagination', api: 'pagination' },
	meta: metaWith('spartan/ui - Pagination', 'Pagination with page navigation, next and previous links.'),
	title: 'spartan/ui - Pagination',
};

@Component({
	selector: 'spartan-pagination',
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
		PaginationPreviewComponent,
		PaginationQueryParamsComponent,
		PaginationIconOnlyComponent,
		PaginationAdvancedComponent,
		PaginationAdvancedQueryComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Pagination" lead="Pagination with page navigation, next and previous links." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-pagination-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui pagination"
				ngCode="ng g @spartan-ng/cli:ui pagination"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__query_params" class="${hlmH4} mb-2 mt-6">Query Params</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-pagination-query-params />
				</div>
				<spartan-code secondTab [code]="_queryParamsCode" />
			</spartan-tabs>
			<h3 id="examples__icon-only" class="${hlmH4} mb-2 mt-6">Icon Only (Previous/Next)</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-pagination-icon-only />
				</div>
				<spartan-code secondTab [code]="_iconOnlyCode" />
			</spartan-tabs>
			<h3 id="examples__advanced" class="${hlmH4} mb-2 mt-6">Advanced Pagination</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-pagination-advanced />
				</div>
				<spartan-code secondTab [code]="_advancedCode" />
			</spartan-tabs>
			<h3 id="examples__advanced" class="${hlmH4} mb-2 mt-6">Advanced Pagination - Query Params</h3>
			<p class="py-2">
				Use
				<code class="${hlmCode}">hlm-numbered-pagination-query-params</code>
				instead of
				<code class="${hlmCode}">hlm-numbered-pagination</code>
				to synchronize pagination state with query params.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-pagination-advanced-query-params />
				</div>
				<spartan-code secondTab [code]="_advancedQueryParamsCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="popover" label="Popover" />
				<spartan-page-bottom-nav-link direction="previous" href="menubar" label="Menubar" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class PaginationPageComponent {
	protected readonly _defaultCode = defaultCode;
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;

	protected readonly _queryParamsCode = paginationQueryParamsCode;
	protected readonly _iconOnlyCode = paginationIconOnlyCode;
	protected readonly _advancedCode = paginationAdvancedCode;
	protected readonly _advancedQueryParamsCode = paginationAdvancedQueryCode;
}
