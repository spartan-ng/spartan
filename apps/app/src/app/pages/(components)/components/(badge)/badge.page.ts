import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { hlmH4 } from '@spartan-ng/helm/typography';
import { CodePreviewDirective } from '../../../../shared/code/code-preview.directive';
import { CodeComponent } from '../../../../shared/code/code.component';
import { MainSectionDirective } from '../../../../shared/layout/main-section.directive';

import { PrimitiveSnippetsService } from '../../../../core/services/primitive-snippets.service';
import { PageBottomNavLinkComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../../shared/layout/section-sub-heading.component';
import { TabsCliComponent } from '../../../../shared/layout/tabs-cli.component';
import { TabsComponent } from '../../../../shared/layout/tabs.component';
import { UIApiDocsComponent } from '../../../../shared/layout/ui-docs-section/ui-docs-section.component';
import { metaWith } from '../../../../shared/meta/meta.util';
import { BadgeLinkComponent } from './badge--link.example';
import { BadgePreviewComponent, defaultImports, defaultSkeleton } from './badge.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Badge', api: 'badge' },
	meta: metaWith('spartan/ui - Badge', 'Makes a component look like a badge.'),
	title: 'spartan/ui - Badge',
};

@Component({
	selector: 'spartan-badge',
	imports: [
		UIApiDocsComponent,
		MainSectionDirective,
		CodeComponent,
		SectionIntroComponent,
		SectionSubHeadingComponent,
		TabsComponent,
		TabsCliComponent,
		CodePreviewDirective,
		PageNavComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		BadgePreviewComponent,
		BadgeLinkComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Badge" lead="Makes a component look like a badge." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-badge-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui badge"
				ngCode="ng g @spartan-ng/cli:ui badge"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__link" class="${hlmH4} mb-2 mt-6">Link</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-badge-link />
				</div>
				<spartan-code secondTab [code]="_badgeLinkCode()" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="breadcrumb" label="Breadcrumb" />
				<spartan-page-bottom-nav-link direction="previous" href="avatar" label="Avatar" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class BadgePageComponent {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('badge');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
	protected readonly _badgeLinkCode = computed(() => this._snippets()['link']);
}
