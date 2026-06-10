import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { ScrollAreaHorizontalPreview } from '@spartan-ng/app/app/pages/(components)/components/(scroll-area)/scroll-area--horizontal.preview';
import { ScrollAreaRtlPreview } from '@spartan-ng/app/app/pages/(components)/components/(scroll-area)/scroll-area--rtl.example';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { RtlHeader } from '@spartan-ng/app/app/shared/code/rtl-header';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { link } from '@spartan-ng/app/app/shared/typography/link';
import { hlmP } from '@spartan-ng/helm/typography';
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
import { defaultImports, defaultSkeleton, ScrollAreaPreview } from './scroll-area.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Scroll Area', api: 'scroll-area' },
	meta: metaWith('spartan/ui - Scroll Area', 'Augments native scroll functionality for custom, cross-browser styling.'),
	title: 'spartan/ui - Scroll Area',
};
@Component({
	selector: 'spartan-scroll-area',
	imports: [
		UIApiDocs,
		MainSection,
		InstallTabs,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,

		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		ScrollAreaPreview,
		ScrollAreaHorizontalPreview,
		SectionSubSubHeading,
		InstallTabs,
		RtlHeader,
		CodeRtlPreview,
		ScrollAreaRtlPreview,
	],
	providers: [provideIcons({ lucideTriangleAlert })],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Scroll Area"
				lead="Augments native scroll functionality for custom, cross-browser styling."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-scroll-area-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="about">About</spartan-section-sub-heading>
			<p class="${hlmP}">
				Scroll area is built on top of
				<a href="https://ngx-scrollbar.netlify.app/#/" target="_blank" rel="noreferrer" class="${link}">
					ngx-scrollbar directive
				</a>
				by
				<a href="https://github.com/murhafsousli" target="_blank" rel="noreferrer" class="${link}">&#64;murhafsousli</a>
				.
			</p>

			<spartan-install-tabs primitive="scroll-area" [showOnlyVega]="false" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__horizontal" spartanH4>Horizontal</h3>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-scroll-area-horizontal-preview />
				</div>
				<spartan-code secondTab [code]="_horizontalCode()" />
			</spartan-tabs>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-scroll-area-rtl-preview />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="select" label="Select" />
				<spartan-page-bottom-nav-link direction="previous" href="resizable" label="Resizable" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class ScrollAreaPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('scroll-area');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _horizontalCode = computed(() => this._snippets()['horizontal']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
