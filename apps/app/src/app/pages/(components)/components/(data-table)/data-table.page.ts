import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { DataTableRtl } from '@spartan-ng/app/app/pages/(components)/components/(data-table)/data-table--rtl.preview';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { RtlHeader } from '@spartan-ng/app/app/shared/code/rtl-header';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { link } from '@spartan-ng/app/app/shared/typography/link';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
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
import { metaWith } from '../../../../shared/meta/meta.util';
import { DataTablePreview } from './data-table.preview';
import {
	actionDropdownCode,
	basicTableCode,
	cellFormattingCode,
	columnHeaderCode,
	columnHeaderUsageCode,
	columnsCode,
	featuresCode,
	filteringCode,
	paginationCode,
	paymentsCode,
	renderTableCode,
	reusablePaginationCode,
	reusablePaginationUsageCode,
	rowActionsColumnCode,
	rowSelectionCode,
	rowSelectionStateCode,
	selectedRowsCode,
	selectionColumnCode,
	sortHeaderButtonCode,
	sortingColumnCode,
	sortingStateCode,
	viewOptionsCode,
	viewOptionsUsageCode,
	visibilityCode,
} from './data-table.snippets';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Data Table' },
	meta: metaWith('spartan/ui - Data Table', 'Powerful table and datagrids built using TanStack Table.'),
	title: 'spartan/ui - Data Table',
};

@Component({
	selector: 'spartan-data-table',
	imports: [
		MainSection,
		InstallTabs,
		Code,
		HlmAlertImports,
		SectionIntro,
		SectionSubHeading,
		SectionSubSubHeading,
		Tabs,

		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		DataTablePreview,
		RouterLink,
		RtlHeader,
		CodeRtlPreview,
		DataTableRtl,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Data Table"
				lead="Powerful table and datagrids built using TanStack Table."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-data-table-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="introduction">Introduction</spartan-section-sub-heading>
			<p class="${hlmP}">
				Every data table or datagrid tends to be unique. They all behave differently, have specific sorting and
				filtering requirements, and work with different data sources.
			</p>
			<p class="${hlmP}">
				It doesn't make sense to combine all of these variations into a single component. If we do that, we'll lose the
				flexibility that
				<a
					href="https://tanstack.com/table/latest/docs/overview#what-is-headless-ui"
					target="_blank"
					rel="noreferrer"
					class="${link}"
				>
					headless UI
				</a>
				provides.
			</p>
			<p class="${hlmP}">
				So instead of a data-table component, this page is a guide on how to build your own. We'll start with the basic
				<a class="${link}" routerLink="/components/table">Table</a>
				directives and build a complex data table from scratch using
				<a href="https://tanstack.com/table" target="_blank" rel="noreferrer" class="${link}">TanStack Table</a>
				.
			</p>
			<div class="mt-6" hlmAlert>
				<div hlmAlertDescription>
					<p>
						<span class="font-semibold">Tip:</span>
						If you find yourself using the same table in multiple places in your app, you can always extract it into a
						reusable component.
					</p>
				</div>
			</div>

			<spartan-install-tabs primitive="table">
				<p class="${hlmP}">
					Add the
					<a class="${link}" routerLink="/components/table">Table</a>
					directives to your project.
				</p>
			</spartan-install-tabs>

			<p class="${hlmP} mb-6">
				Then add the
				<code class="${hlmCode}">&#64;tanstack/angular-table</code>
				dependency. This guide uses
				<a href="https://tanstack.com/table/v9/docs/framework/angular" target="_blank" rel="noreferrer" class="${link}">
					TanStack Table v9.
				</a>
			</p>

			<spartan-code [code]="'npm install @tanstack/angular-table'" />

			<spartan-section-sub-heading id="prerequisites">Prerequisites</spartan-section-sub-heading>
			<p class="${hlmP} mb-6">
				We are going to build a table to show recent payments. Here's what our data looks like:
			</p>
			<spartan-code fileName="payments.ts" [code]="_paymentsCode" />

			<spartan-section-sub-heading id="table-features">Set up Table Features</spartan-section-sub-heading>
			<p class="${hlmP} mb-6">
				TanStack Table v9 is feature-based: you opt into the behavior you want — sorting, filtering, pagination, and so
				on — by declaring it with
				<code class="${hlmCode}">tableFeatures()</code>
				. Anything you don't list is tree-shaken out of your bundle. That includes the built-in filter and sort
				functions: register the ones your columns rely on under
				<code class="${hlmCode}">filterFns</code>
				and
				<code class="${hlmCode}">sortFns</code>
				(our email filter uses
				<code class="${hlmCode}">includesString</code>
				, and string columns sort with
				<code class="${hlmCode}">text</code>
				/
				<code class="${hlmCode}">alphanumeric</code>
				).
			</p>
			<spartan-code fileName="data-table-features.ts" [code]="_featuresCode" />
			<div class="mt-6" hlmAlert>
				<div hlmAlertDescription>
					<p>
						<span class="font-semibold">Note:</span>
						The core row model is always included, so you never register it yourself. Row models for optional features
						are created with
						<code class="${hlmCode}">create*RowModel()</code>
						and registered on the features object — there are no more
						<code class="${hlmCode}">get*RowModel</code>
						table options.
					</p>
				</div>
			</div>

			<spartan-section-sub-heading id="basic-table">Basic Table</spartan-section-sub-heading>
			<p class="${hlmP}">Let's start by building a basic table.</p>

			<h3 id="column-definitions" spartanH4>Column definitions</h3>
			<p class="${hlmP} mb-6">First, we'll define our columns.</p>
			<spartan-code fileName="columns.ts" [code]="_columnsCode" />
			<div class="mt-6" hlmAlert>
				<div hlmAlertDescription>
					<p>
						<span class="font-semibold">Note:</span>
						Columns are where you define the core of what your table will look like. They define the data that will be
						displayed, how it will be formatted, sorted and filtered.
					</p>
				</div>
			</div>

			<h3 id="data-table-component" spartanH4>Data table component</h3>
			<p class="${hlmP} mb-6">
				Next, we'll create a
				<code class="${hlmCode}">DataTable</code>
				component that receives the
				<code class="${hlmCode}">columns</code>
				and
				<code class="${hlmCode}">data</code>
				as inputs. We create the table instance with
				<code class="${hlmCode}">injectTable()</code>
				, passing it our features together with those inputs, and render headers and cells with the
				<code class="${hlmCode}">*flexRender</code>
				directive.
			</p>
			<spartan-code fileName="data-table.ts" [code]="_basicTableCode" />
			<div class="mt-6" hlmAlert>
				<div hlmAlertDescription>
					<p>
						<span class="font-semibold">Rendering with FlexRender:</span>
						A column's
						<code class="${hlmCode}">header</code>
						and
						<code class="${hlmCode}">cell</code>
						definitions can return a plain string, an HTML string (rendered above via
						<code class="${hlmCode}">[innerHTML]</code>
						) or an Angular component class — we'll use components for the sorting button, the selection checkboxes and
						the actions dropdown later in this guide.
					</p>
				</div>
			</div>

			<h3 id="render-the-table" spartanH4>Render the table</h3>
			<p class="${hlmP} mb-6">Finally, we'll render our table in our page component.</p>
			<spartan-code fileName="demo-page.ts" [code]="_renderTableCode" />
			<p class="${hlmP}">
				The page component owns the data: fetch it from your API (e.g. with
				<code class="${hlmCode}">httpResource</code>
				or a service) and pass it to the table through the
				<code class="${hlmCode}">data</code>
				input. Inputs are signals and the
				<code class="${hlmCode}">injectTable()</code>
				options callback is reactive, so the table updates automatically whenever the data changes.
			</p>

			<spartan-section-sub-heading id="cell-formatting">Cell Formatting</spartan-section-sub-heading>
			<p class="${hlmP} mb-6">
				Let's format the amount cell to display the dollar amount. We'll also align the cell to the right. Update the
				<code class="${hlmCode}">header</code>
				and
				<code class="${hlmCode}">cell</code>
				definitions for amount as follows:
			</p>
			<spartan-code fileName="columns.ts" [code]="_cellFormattingCode" />
			<p class="${hlmP}">You can use the same approach to format other cells and headers.</p>

			<spartan-section-sub-heading id="row-actions">Row Actions</spartan-section-sub-heading>
			<p class="${hlmP} mb-6">
				Let's add row actions to our table. We'll use a
				<a class="${link}" routerLink="/components/dropdown-menu">Dropdown Menu</a>
				for this and create a component that renders it inside a cell. The component receives the
				<code class="${hlmCode}">row</code>
				as an input, so you can access the row data using
				<code class="${hlmCode}">row().original</code>
				— use this to handle actions for your row, e.g. use the
				<code class="${hlmCode}">id</code>
				to make a DELETE call to your API.
			</p>
			<spartan-code fileName="action-dropdown.ts" [code]="_actionDropdownCode" />
			<p class="${hlmP} mb-6">
				Then update our columns definition to add a new
				<code class="${hlmCode}">actions</code>
				display column that renders the component:
			</p>
			<spartan-code fileName="columns.ts" [code]="_rowActionsColumnCode" />

			<spartan-section-sub-heading id="pagination">Pagination</spartan-section-sub-heading>
			<p class="${hlmP} mb-6">
				Because our features object includes
				<code class="${hlmCode}">rowPaginationFeature</code>
				and
				<code class="${hlmCode}">createPaginatedRowModel()</code>
				, the table automatically paginates rows into pages of 10 — there's nothing to add to
				<code class="${hlmCode}">injectTable</code>
				. We can add pagination controls to our table using the
				<a class="${link}" routerLink="/components/button">Button</a>
				component and the
				<code class="${hlmCode}">table.previousPage()</code>
				and
				<code class="${hlmCode}">table.nextPage()</code>
				API methods.
			</p>
			<spartan-code fileName="data-table.ts" [code]="_paginationCode" />
			<p class="${hlmP}">
				See the
				<a
					href="https://tanstack.com/table/latest/docs/framework/angular/guide/pagination"
					target="_blank"
					rel="noreferrer"
					class="${link}"
				>
					pagination docs
				</a>
				for more information on customizing page size and implementing manual pagination.
			</p>

			<spartan-section-sub-heading id="sorting">Sorting</spartan-section-sub-heading>
			<p class="${hlmP}">
				Let's make the email column sortable. The
				<code class="${hlmCode}">rowSortingFeature</code>
				and sorted row model are already registered in our features object, so all that's left is wiring up the sorting
				state.
			</p>

			<h3 id="sorting-state" spartanH4>Wire up the sorting state</h3>
			<p class="${hlmP} mb-6">
				We hold the sorting state in a signal and connect it to the table via
				<code class="${hlmCode}">state</code>
				and
				<code class="${hlmCode}">onSortingChange</code>
				:
			</p>
			<spartan-code fileName="data-table.ts" [code]="_sortingStateCode" />

			<h3 id="sorting-header" spartanH4>Make header cell sortable</h3>
			<p class="${hlmP} mb-6">We create a header button component that toggles sorting for its column:</p>
			<spartan-code fileName="sort-header-button.ts" [code]="_sortHeaderButtonCode" />
			<p class="${hlmP} mb-6">
				And render it as the
				<code class="${hlmCode}">email</code>
				column's header:
			</p>
			<spartan-code fileName="columns.ts" [code]="_sortingColumnCode" />
			<p class="${hlmP}">
				This will automatically sort the table (asc and desc) when the user toggles on the header cell.
			</p>

			<spartan-section-sub-heading id="filtering">Filtering</spartan-section-sub-heading>
			<p class="${hlmP} mb-6">
				Let's add a search input to filter emails in our table. The
				<code class="${hlmCode}">columnFilteringFeature</code>
				and filtered row model are already part of our features object, so we only need to wire up the filter state and
				render an
				<a class="${link}" routerLink="/components/input">Input</a>
				.
			</p>
			<spartan-code fileName="data-table.ts" [code]="_filteringCode" />
			<p class="${hlmP}">
				Filtering is now enabled for the
				<code class="${hlmCode}">email</code>
				column. You can add filters to other columns as well. See the
				<a
					href="https://tanstack.com/table/latest/docs/framework/angular/guide/column-filtering"
					target="_blank"
					rel="noreferrer"
					class="${link}"
				>
					filtering docs
				</a>
				for more information on customizing filters.
			</p>

			<spartan-section-sub-heading id="visibility">Visibility</spartan-section-sub-heading>
			<p class="${hlmP} mb-6">
				Adding column visibility is fairly simple using the visibility API. We add a
				<a class="${link}" routerLink="/components/dropdown-menu">Dropdown Menu</a>
				that toggles the visibility of every column that can be hidden:
			</p>
			<spartan-code fileName="data-table.ts" [code]="_visibilityCode" />
			<p class="${hlmP}">This adds a dropdown menu that you can use to toggle column visibility.</p>

			<spartan-section-sub-heading id="row-selection">Row Selection</spartan-section-sub-heading>
			<p class="${hlmP}">Next, we're going to add row selection to our table.</p>

			<h3 id="row-selection-column" spartanH4>Create selection components</h3>
			<p class="${hlmP} mb-6">
				We create two small
				<a class="${link}" routerLink="/components/checkbox">Checkbox</a>
				components: one for the header to select all rows on the page and one for each row.
			</p>
			<spartan-code fileName="selection-column.ts" [code]="_selectionColumnCode" />
			<p class="${hlmP} mb-6">
				Then add a
				<code class="${hlmCode}">select</code>
				display column that renders them:
			</p>
			<spartan-code fileName="columns.ts" [code]="_rowSelectionCode" />

			<h3 id="row-selection-state" spartanH4>Wire up the selection state</h3>
			<spartan-code class="mt-6" fileName="data-table.ts" [code]="_rowSelectionStateCode" />
			<p class="${hlmP}">This adds a checkbox to each row and a checkbox in the header to select all rows.</p>

			<h3 id="row-selection-count" spartanH4>Show selected rows</h3>
			<p class="${hlmP} mb-6">
				You can show the number of selected rows using the
				<code class="${hlmCode}">table.getSelectedRowModel()</code>
				API.
			</p>
			<spartan-code [code]="_selectedRowsCode" />

			<spartan-section-sub-heading id="reusable-components">Reusable Components</spartan-section-sub-heading>
			<p class="${hlmP}">
				Here are some components you can use to build your data tables. Components rendered inside a column (like the
				column header) receive their context from
				<code class="${hlmCode}">*flexRender</code>
				. Components rendered outside the table (pagination, column toggle) read the table instance from DI with
				<code class="${hlmCode}">injectTableContext()</code>
				, which is provided by wrapping them in the
				<code class="${hlmCode}">[tanStackTable]</code>
				directive. Since no table input or generics are involved, the same components work with any of your tables.
			</p>

			<h3 id="column-header" spartanH4>Column header</h3>
			<p class="${hlmP} mb-6">Make any column header sortable and hideable.</p>
			<spartan-code fileName="data-table-column-header.ts" [code]="_columnHeaderCode" />
			<p class="${hlmP} mb-6">
				Since the component needs a
				<code class="${hlmCode}">title</code>
				on top of the
				<code class="${hlmCode}">column</code>
				from the flex-render context, register it with
				<code class="${hlmCode}">flexRenderComponent()</code>
				, which lets you pass extra inputs:
			</p>
			<spartan-code fileName="columns.ts" [code]="_columnHeaderUsageCode" />

			<h3 id="pagination-controls" spartanH4>Pagination</h3>
			<p class="${hlmP} mb-6">
				Add pagination controls to your table including page size and selection count. The current page index and size
				are read from the signal-backed
				<code class="${hlmCode}">table.atoms.pagination</code>
				atom, so the component stays in sync with the table.
			</p>
			<spartan-code fileName="data-table-pagination.ts" [code]="_reusablePaginationCode" />
			<p class="${hlmP} mb-6">
				Add
				<code class="${hlmCode}">TanStackTable</code>
				to the imports of the component that owns the table and wrap the pagination in the
				<code class="${hlmCode}">[tanStackTable]</code>
				directive:
			</p>
			<spartan-code [code]="_reusablePaginationUsageCode" />

			<h3 id="column-toggle" spartanH4>Column toggle</h3>
			<p class="${hlmP} mb-6">
				A component to toggle column visibility. Like the pagination component, it reads the table from the nearest
				<code class="${hlmCode}">[tanStackTable]</code>
				directive.
			</p>
			<spartan-code fileName="data-table-view-options.ts" [code]="_viewOptionsCode" />
			<spartan-code class="mt-6" [code]="_viewOptionsUsageCode" />

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-data-table-rtl />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="date-picker" label="Date Picker" />
				<spartan-page-bottom-nav-link direction="previous" href="context-menu" label="Context Menu" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class DataTablePage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('data-table');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);

	protected readonly _paymentsCode = paymentsCode;
	protected readonly _renderTableCode = renderTableCode;
	protected readonly _columnHeaderCode = columnHeaderCode;
	protected readonly _columnHeaderUsageCode = columnHeaderUsageCode;
	protected readonly _reusablePaginationCode = reusablePaginationCode;
	protected readonly _reusablePaginationUsageCode = reusablePaginationUsageCode;
	protected readonly _viewOptionsCode = viewOptionsCode;
	protected readonly _viewOptionsUsageCode = viewOptionsUsageCode;
	protected readonly _featuresCode = featuresCode;
	protected readonly _columnsCode = columnsCode;
	protected readonly _basicTableCode = basicTableCode;
	protected readonly _cellFormattingCode = cellFormattingCode;
	protected readonly _actionDropdownCode = actionDropdownCode;
	protected readonly _rowActionsColumnCode = rowActionsColumnCode;
	protected readonly _paginationCode = paginationCode;
	protected readonly _sortingStateCode = sortingStateCode;
	protected readonly _sortHeaderButtonCode = sortHeaderButtonCode;
	protected readonly _sortingColumnCode = sortingColumnCode;
	protected readonly _filteringCode = filteringCode;
	protected readonly _visibilityCode = visibilityCode;
	protected readonly _selectionColumnCode = selectionColumnCode;
	protected readonly _rowSelectionCode = rowSelectionCode;
	protected readonly _rowSelectionStateCode = rowSelectionStateCode;
	protected readonly _selectedRowsCode = selectedRowsCode;
}
