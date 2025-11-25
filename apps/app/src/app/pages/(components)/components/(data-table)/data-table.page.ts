import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { link } from '@spartan-ng/app/app/shared/typography/link';
import { hlmCode, hlmP, hlmUl } from '@spartan-ng/helm/typography';
import { defaultImports, defaultSkeleton } from '../(context-menu)/context-menu.preview';
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
import { DataTablePreview } from './data-table.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Data Table' },
	meta: metaWith('spartan/ui - Data Table', 'Powerful table and datagrids similar to Angular Material Tables.'),
	title: 'spartan/ui - Data Table',
};

@Component({
	selector: 'spartan-data-table',
	imports: [
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
		DataTablePreview,
		RouterLink,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Data Table" lead="Powerful table and datagrids similar powered by TanStack Table" />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-data-table-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="about">About</spartan-section-sub-heading>
			<p class="${hlmP}">
				Data-Table is built on top of
				<a href="https://tanstack.com/table" target="_blank" rel="noreferrer" class="${link}">TanStack-Table</a>
				by
				<a href="https://github.com/tannerlinsley" target="_blank" rel="noreferrer" class="${link}">
					&#64;tannerlinsley
				</a>
				and the
				<a class="${link}" routerLink="/components/table">Table</a>
				directives.
			</p>
			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>

			<p class="${hlmP}">
				Add the
				<a class="${link}" routerLink="/components/table">Table</a>
				directives to your project.
			</p>

			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui table"
				ngCode="ng g @spartan-ng/cli:ui table"
			/>

			<p class="${hlmP} mb-6">
				Add
				<code class="${hlmCode}">&#64;tanstack/angular-table</code>
				to your project, more information in the
				<a
					href="https://tanstack.com/table/v8/docs/installation#angular-table"
					target="_blank"
					rel="noreferrer"
					class="${link}"
				>
					TanStack Table
				</a>
				documentation.
			</p>

			<spartan-code [code]="'npm install @tanstack/angular-table'" />

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<p class="${hlmP}">
				For more information you can check out our
				<a class="${link}" routerLink="/examples/tasks">Tasks</a>
				example and have a look at the documentation of
				<a
					href="https://tanstack.com/table/v8/docs/framework/angular/angular-table"
					target="_blank"
					rel="noreferrer"
					class="${link}"
				>
					TanStack Table
				</a>
				. TanStack Table provides multiple examples on
				<a
					href="https://github.com/TanStack/table/tree/main/examples/angular"
					target="_blank"
					rel="noreferrer"
					class="${link}"
				>
					GitHub
				</a>
				and interactive examples on the documentation site. These examples are unstyled and can be used as a foundation
				for your own implementations using the
				<a class="${link}" routerLink="/components/table">Table</a>
				directives to apply consistent styling. Here are some examples to get you started:
			</p>

			<ul class="${hlmUl}">
				@for (example of _tanstackExamples; track $index) {
					<li>
						<a [href]="example.link" target="_blank" rel="noreferrer" class="${link}">{{ example.label }}</a>
						-
						{{ example.description }}
					</li>
				}
			</ul>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="date-picker" label="Date Picker" />
				<spartan-page-bottom-nav-link direction="previous" href="context-menu" label="Context Menu" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class DataTablePage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('data-table');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;

	protected readonly _tanstackExamples: { label: string; description: string; link: string }[] = [
		{
			label: 'Basic',
			description: 'A basic table example with multiple columns',
			link: 'https://tanstack.com/table/v8/docs/framework/angular/examples/basic',
		},
		{
			label: 'Column Visibility',
			description: 'An example of how to implement column visibility',
			link: 'https://tanstack.com/table/v8/docs/framework/angular/examples/column-visibility',
		},
		{
			label: 'Column Filters',
			description: 'An example of how to implement column filters',
			link: 'https://tanstack.com/table/v8/docs/framework/angular/examples/filters',
		},
		{
			label: 'Row Selection',
			description: 'An example of how to implement row selection',
			link: 'https://tanstack.com/table/v8/docs/framework/angular/examples/row-selection',
		},
	];
}
