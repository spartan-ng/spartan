import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { RtlHeader } from '@spartan-ng/app/app/shared/code/rtl-header';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
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
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { link } from '../../../../shared/typography/link';
import { TableActions } from './table--actions.preview';
import { TableFooter } from './table--footer.preview';
import { TableRtl } from './table--rtl.preview';
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
		InstallTabs,
		Code,
		SectionIntro,
		SectionSubHeading,
		SectionSubSubHeading,
		Tabs,

		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		RouterLink,
		RtlHeader,
		CodeRtlPreview,
		TablePreview,
		TableFooter,
		TableActions,
		TableRtl,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Table" lead="Apply responsive styles to a native HTML table." showThemeToggle />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-table-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="table" [showOnlyVega]="false" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__footer" spartanH4>Footer</h3>
			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">&lt;tfoot hlmTableFooter&gt;</code>
				to add a footer to the table.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-table-footer />
				</div>
				<spartan-code secondTab [code]="_footerCode()" />
			</spartan-tabs>

			<h3 id="examples__actions" spartanH4>Actions</h3>
			<p class="${hlmP}">
				A table showing actions for each row using a
				<code class="${hlmCode}">Dropdown</code>
				component.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-table-actions />
				</div>
				<spartan-code secondTab [code]="_actionsCode()" />
			</spartan-tabs>

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
				<a class="${link}" routerLink="/" fragment="tasks">Tasks</a>
				demo.
			</p>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-table-rtl />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
			</spartan-tabs>

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
	protected readonly _footerCode = computed(() => this._snippets()['footer']);
	protected readonly _actionsCode = computed(() => this._snippets()['actions']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
