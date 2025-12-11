import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
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
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { link } from '../../../../shared/typography/link';
import { TablePreview, defaultImports, defaultSkeleton } from './table.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Table', api: 'table' },
	meta: metaWith('spartan/ui - Table', 'A responsive table component.'),
	title: 'spartan/ui - Table',
};

@Component({
	selector: 'spartan-table',
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
		TablePreview,
		RouterLink,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Table" lead="Apply responsive styles to a native HTML table. " />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-table-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui table"
				ngCode="ng g @spartan-ng/cli:ui table"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="data-table">Data Table</spartan-section-sub-heading>
			<p class="${hlmP}">
				For more complex tables, have a look at the data table , which is powered by the incredible work of
				<code class="${hlmCode} mr-0.5">TanStack-Table</code>
				.
			</p>
			<p class="${hlmP}">
				See the
				<a class="${link}" routerLink="/components/data-table">Data Table</a>
				documentation for more information.
			</p>
			<p class="${hlmP}">
				You can also see an example of a data table in the
				<a class="${link}" routerLink="/examples/tasks">Tasks</a>
				demo.
			</p>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="tabs" label="Tabs" />
				<spartan-page-bottom-nav-link direction="previous" href="switch" label="Switch" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class SkeletonPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('table');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
