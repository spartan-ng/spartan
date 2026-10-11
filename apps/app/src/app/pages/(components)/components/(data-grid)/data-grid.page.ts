import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { UIApiDocs } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
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
import { metaWith } from '../../../../shared/meta/meta.util';
import { DataGridGraphQLPreview } from './data-grid-graphql.preview';
import { DataGridODataPreview } from './data-grid-odata.preview';
import { DataGridServerPreview } from './data-grid-server.preview';
import { DataGridPreview, defaultImports, defaultSkeleton } from './data-grid.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Data Grid', api: 'data-grid' },
	meta: metaWith(
		'spartan/ui - Data Grid',
		'Server-driven datagrid with REST, OData, and GraphQL adapters built on TanStack Table.',
	),
	title: 'spartan/ui - Data Grid',
};

@Component({
	selector: 'spartan-data-grid',
	imports: [
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		DataGridPreview,
		DataGridServerPreview,
		DataGridODataPreview,
		DataGridGraphQLPreview,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		UIApiDocs,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Data Grid"
				lead="Server-driven datagrid with REST, OData, and GraphQL adapters built on TanStack Table."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-data-grid-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui data-grid"
				ngCode="ng g @spartan-ng/cli:ui data-grid"
			/>
			<p class="${hlmP}">
				The generator copies the
				<code class="${hlmCode}">hlm-data-grid</code>
				shell into your project and installs
				<code class="${hlmCode}">&#64;tanstack/angular-table</code>
				alongside it. Pair it with
				<code class="${hlmCode}">&#64;spartan-ng/brain/data-grid</code>
				for the headless adapters below.
			</p>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_imports" />
				<spartan-code [code]="_codeSkeleton" />
			</div>

			<spartan-section-sub-heading id="server-pagination">Server pagination (REST)</spartan-section-sub-heading>
			<p class="${hlmP}">
				Point
				<code class="${hlmCode}">createRestAdapter</code>
				at your endpoint and
				<code class="${hlmCode}">injectBrnDataGrid</code>
				maps page, page size, sorting, and filters to query params (
				<code class="${hlmCode}">page</code>
				,
				<code class="${hlmCode}">pageSize</code>
				,
				<code class="${hlmCode}">sortBy/sortDir</code>
				,
				<code class="${hlmCode}">filter[id]</code>
				,
				<code class="${hlmCode}">q</code>
				). Override the mapping with
				<code class="${hlmCode}">mapSort/mapFilter</code>
				, or bring your own transport with
				<code class="${hlmCode}">fetchFn</code>
				. Fetches run through Angular
				<code class="${hlmCode}">resource</code>
				(including SSR); filter keystrokes are debounced by
				<code class="${hlmCode}">debounceMs</code>
				(default 300ms) while page and sort apply immediately, and
				<code class="${hlmCode}">serverFetch</code>
				is reserved for a future opt-in fetch mode.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-data-grid-server-preview />
				</div>
				<spartan-code secondTab [code]="_serverCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="odata">OData</spartan-section-sub-heading>
			<p class="${hlmP}">
				<code class="${hlmCode}">createODataAdapter</code>
				translates the same grid state to
				<code class="${hlmCode}">$top/$skip</code>
				pagination with
				<code class="${hlmCode}">$orderby</code>
				,
				<code class="${hlmCode}">$filter</code>
				, and
				<code class="${hlmCode}">$count=true</code>
				, reading rows from
				<code class="${hlmCode}">value</code>
				and the total from
				<code class="${hlmCode}">&#64;odata.count</code>
				. Filter values escape
				<code class="${hlmCode}">'</code>
				as
				<code class="${hlmCode}">''</code>
				so names like O'Brien keep returning rows instead of a 400.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-data-grid-odata-preview />
				</div>
				<spartan-code secondTab [code]="_odataCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="graphql">GraphQL</spartan-section-sub-heading>
			<p class="${hlmP}">
				<code class="${hlmCode}">createGraphQLAdapter</code>
				builds query variables (
				<code class="${hlmCode}">offset/limit</code>
				,
				<code class="${hlmCode}">orderBy</code>
				,
				<code class="${hlmCode}">where</code>
				,
				<code class="${hlmCode}">search</code>
				— or
				<code class="${hlmCode}">first/after</code>
				with
				<code class="${hlmCode}">mode: 'cursor'</code>
				) and hands them to your
				<code class="${hlmCode}">fetchFn</code>
				, so any client or codegen'd query works without a normalized cache.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-data-grid-graphql-preview />
				</div>
				<spartan-code secondTab [code]="_graphqlCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link direction="previous" href="context-menu" label="Context Menu" />
				<spartan-page-bottom-nav-link href="data-table" label="Data Table" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class DataGridPage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('data-grid');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _serverCode = computed(() => this._snippets()['server']);
	protected readonly _odataCode = computed(() => this._snippets()['odata']);
	protected readonly _graphqlCode = computed(() => this._snippets()['graphql']);
	protected readonly _imports = defaultImports;
	protected readonly _codeSkeleton = defaultSkeleton;
}
