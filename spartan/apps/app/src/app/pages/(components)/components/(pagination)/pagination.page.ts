import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { hlmCode } from '@spartan-ng/helm/typography';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { PaginationAdvancedQuery } from './pagination--advanced-query.example';
import { PaginationAdvanced } from './pagination--advanced.example';
import { PaginationIconOnly } from './pagination--icon-only.example';
import { PaginationQueryParams } from './pagination--query-params.example';
import { PaginationPreview, defaultImports, defaultSkeleton } from './pagination.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Pagination', api: 'pagination' },
	meta: metaWith('spartan/ui - Pagination', 'Pagination with page navigation, next and previous links.'),
	title: 'spartan/ui - Pagination',
};

@Component({
	selector: 'spartan-pagination',
	imports: [
		UIApiDocs,
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		PaginationPreview,
		PaginationQueryParams,
		PaginationIconOnly,
		PaginationAdvanced,
		PaginationAdvancedQuery,
		SectionSubSubHeading,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Pagination" lead="Pagination with page navigation, next and previous links." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-pagination-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui pagination" ngCode="ng g @spartan-ng/cli:ui pagination" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__query_params" spartanH4>Query Params</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-pagination-query-params />
				</div>
				<spartan-code secondTab [code]="_queryParamsCode()" />
			</spartan-tabs>
			<h3 id="examples__icon-only" spartanH4>Icon Only (Previous/Next)</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-pagination-icon-only />
				</div>
				<spartan-code secondTab [code]="_iconOnlyCode()" />
			</spartan-tabs>
			<h3 id="examples__advanced" spartanH4>Advanced Pagination</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-pagination-advanced />
				</div>
				<spartan-code secondTab [code]="_advancedCode()" />
			</spartan-tabs>
			<h3 id="examples__advanced_query_params" spartanH4>Advanced Pagination - Query Params</h3>
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
				<spartan-code secondTab [code]="_advancedQueryCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="popover" label="Popover" />
				<spartan-page-bottom-nav-link direction="previous" href="navigation-menu" label="Navigation Menu" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class PaginationPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('pagination');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _queryParamsCode = computed(() => this._snippets()['queryParams']);
	protected readonly _iconOnlyCode = computed(() => this._snippets()['iconOnly']);
	protected readonly _advancedCode = computed(() => this._snippets()['advanced']);
	protected readonly _advancedQueryCode = computed(() => this._snippets()['advancedQuery']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
