import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { RtlHeader } from '@spartan-ng/app/app/shared/code/rtl-header';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
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
import { SeparatorListPreview } from './separator--list.preview';
import { SeparatorMenuPreview } from './separator--menu.preview';
import { SeparatorRtlPreview } from './separator--rtl.preview';
import { SeparatorVerticalPreview } from './separator--vertical.preview';
import { SeparatorPreview, defaultImports, defaultSkeleton } from './separator.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Separator', api: 'separator' },
	meta: metaWith('spartan/ui - Separator', 'Visually or semantically separates content.'),
	title: 'spartan/ui - Separator',
};
@Component({
	selector: 'spartan-separator',
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
		RtlHeader,
		CodeRtlPreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		SeparatorPreview,
		SeparatorVerticalPreview,
		SeparatorMenuPreview,
		SeparatorListPreview,
		SeparatorRtlPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Separator" lead="Visually or semantically separates content." showThemeToggle />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-separator-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="separator" />
			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__vertical" spartanH4>Vertical</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-separator-vertical />
				</div>
				<spartan-code secondTab [code]="_verticalCode()" />
			</spartan-tabs>

			<h3 id="examples__menu" spartanH4>Menu</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-separator-menu />
				</div>
				<spartan-code secondTab [code]="_menuCode()" />
			</spartan-tabs>

			<h3 id="examples__list" spartanH4>List</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-separator-list />
				</div>
				<spartan-code secondTab [code]="_listCode()" />
			</spartan-tabs>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-separator-rtl />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="sheet" label="Sheet" />
				<spartan-page-bottom-nav-link direction="previous" href="select" label="Select" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class SeparatorPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('separator');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _verticalCode = computed(() => this._snippets()['vertical']);
	protected readonly _menuCode = computed(() => this._snippets()['menu']);
	protected readonly _listCode = computed(() => this._snippets()['list']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
