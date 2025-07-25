import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { hlmH4 } from '@spartan-ng/helm/typography';
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
import { SpartanSpinnerSizePreviewComponent } from './spinner--size.preview';
import { SpinnerPreview, defaultImports, defaultSkeleton } from './spinner.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Spinner', api: 'spinner' },
	meta: metaWith(
		'spartan/ui - Spinner',
		'Shows a Loading spinner to indicate that the app is busy or the page is still loading.',
	),
	title: 'spartan/ui - Spinner',
};
@Component({
	selector: 'spartan-spinner',
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
		SpinnerPreview,
		SpartanSpinnerSizePreviewComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Spinner"
				lead="Shows a Loading spinner to indicate that the app is busy or the page is still loading."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-spinner-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui spinner"
				ngCode="ng g @spartan-ng/cli:ui spinner"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__size" class="${hlmH4} mb-2 mt-6">Sizes</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-spinner-size-preview />
				</div>
				<spartan-code secondTab [code]="_sizeCode()" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="switch" label="Switch" />
				<spartan-page-bottom-nav-link direction="previous" href="skeleton" label="Skeleton" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class SpinnerPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('spinner');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _sizeCode = computed(() => this._snippets()['size']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
