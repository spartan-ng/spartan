import type { RouteMeta } from '@analogjs/router';
import { Component, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import {} from '@spartan-ng/helm/icon';
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
import { ScrollAreaPreview, defaultImports, defaultSkeleton } from './scroll-area.preview';

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
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		ScrollAreaPreview,
	],
	providers: [provideIcons({ lucideTriangleAlert })],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Scroll Area"
				lead="Augments native scroll functionality for custom, cross-browser styling."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-scroll-area-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui scrollarea"
				ngCode="ng g @spartan-ng/cli:ui scrollarea"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="select" label="Select" />
				<spartan-page-bottom-nav-link direction="previous" href="radio-group" label="Radio Group" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class LabelPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('scroll-area')();
	protected readonly _defaultCode = this._snippets['default'];
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
