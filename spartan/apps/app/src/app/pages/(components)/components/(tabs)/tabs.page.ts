import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert } from '@ng-icons/lucide';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { HlmAlert, HlmAlertDescription } from '@spartan-ng/helm/alert';
import { HlmIcon } from '@spartan-ng/helm/icon';
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
import { TabsPaginatedPreview } from './tabs--paginated.preview';
import { TabsVerticalPreview } from './tabs--vertical.preview';
import { TabsPreview, defaultImports, defaultSkeleton } from './tabs.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Tabs', api: 'tabs' },
	meta: metaWith(
		'spartan/ui - Tabs',
		'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
	),
	title: 'spartan/ui - Tabs',
};
@Component({
	selector: 'spartan-tabs-page',
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
		TabsPreview,
		TabsVerticalPreview,
		TabsPaginatedPreview,
		HlmAlertDescription,
		HlmAlert,
		NgIcon,
		HlmIcon,
		SectionSubSubHeading,
	],
	providers: [provideIcons({ lucideCircleAlert })],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Tabs"
				lead="A set of layered sections of content—known as tab panels—that are displayed one at a time."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-tabs-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs class="mt-4" nxCode="npx nx g @spartan-ng/cli:ui tabs" ngCode="ng g @spartan-ng/cli:ui tabs" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__vertical" spartanH4>Vertical</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-tabs-vertical />
				</div>
				<spartan-code secondTab [code]="_verticalCode()" />
			</spartan-tabs>

			<h3 id="examples__paginated_tabs" spartanH4>Paginated Tabs</h3>

			<p class="pt-2">
				Use
				<code class="${hlmCode}">hlm-paginated-tabs-list</code>
				instead of
				<code class="${hlmCode}">hlm-tabs-list</code>
				for paginated tabs list with next and previous buttons.
			</p>
			<p class="py-2">
				Disable pagination with
				<code class="${hlmCode}">[disablePagination]="true"</code>
				. Hides the pagination buttons and active tab is not scrolled into view.
			</p>

			<div hlmAlert class="my-2">
				<ng-icon hlm hlmAlertIcon name="lucideCircleAlert" />
				<div hlmAlertDescription>
					<p>
						<strong>Padding</strong>
						styles, applied to the tab list (
						<code class="${hlmCode}">listVariants</code>
						), are
						<strong>not</strong>
						taken into account during
						<strong>keyboard scrolling</strong>
						. This affects the active tab's scrolling position and next/previous button remain enabled even when the
						active tab is at the start or end of the tab list.
					</p>
				</div>
			</div>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-tabs-paginated />
				</div>
				<spartan-code secondTab [code]="_paginatedCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="textarea" label="Textarea" />
				<spartan-page-bottom-nav-link direction="previous" href="table" label="Table" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class TabsPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('tabs');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _verticalCode = computed(() => this._snippets()['vertical']);
	protected readonly _paginatedCode = computed(() => this._snippets()['paginated']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
