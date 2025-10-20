import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
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
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { SheetClosePreview } from './sheet--close.preview';
import { SheetSidePreview } from './sheet--side.preview';
import { SheetSizePreview } from './sheet--size.preview';
import { SheetPreview, defaultImports, defaultSkeleton } from './sheet.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Sheet', api: 'sheet' },
	meta: metaWith(
		'spartan/ui - Sheet',
		'Extends the Dialog component to display content that complements the main content of the screen.',
	),
	title: 'spartan/ui - Sheet',
};
@Component({
	selector: 'spartan-sheet',

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
		SheetPreview,
		SheetSidePreview,
		SheetSizePreview,
		SheetClosePreview,
		SectionSubSubHeading,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Sheet"
				lead="Extends the Dialog component to display content that complements the main content of the screen."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-sheet-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui sheet" ngCode="ng g @spartan-ng/cli:ui sheet" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__sides" spartanH4>Sides</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-sheet-side-preview />
				</div>
				<spartan-code secondTab [code]="_sideCode()" />
			</spartan-tabs>

			<h3 id="examples__size_sheet" spartanH4>Size</h3>
			<p class="${hlmP} mb-6">
				You can adjust the size of the sheet by adding CSS classes to
				<code class="${hlmCode}">hlm-sheet-content</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-sheet-size-preview />
				</div>
				<spartan-code secondTab [code]="_sizeCode()" />
			</spartan-tabs>

			<h3 id="examples__close_sheet" spartanH4>Close Sheet</h3>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-sheet-close-preview />
				</div>
				<spartan-code secondTab [code]="_closeCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="sidebar" label="Sidebar" />
				<spartan-page-bottom-nav-link direction="previous" href="separator" label="Separator" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class LabelPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('sheet');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _sideCode = computed(() => this._snippets()['side']);
	protected readonly _closeCode = computed(() => this._snippets()['close']);
	protected readonly _sizeCode = computed(() => this._snippets()['size']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
