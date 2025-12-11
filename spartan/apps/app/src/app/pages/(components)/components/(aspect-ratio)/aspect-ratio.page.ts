import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '../../../../core/services/primitive-snippets.service';
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
import { AspectRatioPreview, defaultImports, defaultSkeleton } from './aspect-ratio.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Aspect Ratio', api: 'aspect-ratio' },
	meta: metaWith('spartan/ui - Aspect Ratio', 'Displays content within a desired ratio.'),
	title: 'spartan/ui - Aspect Ratio',
};

@Component({
	selector: 'spartan-aspect-ratio',
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
		AspectRatioPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Aspect Ratio" lead="Displays content within a desired ratio." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-aspect-ratio-preview class="h-full w-full" />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui aspectratio" ngCode="ng g @spartan-ng/cli:ui aspectratio" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="autocomplete" label="Autocomplete" />
				<spartan-page-bottom-nav-link direction="previous" href="alert-dialog" label="Alert Dialog" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class AlertPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('aspect-ratio');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
