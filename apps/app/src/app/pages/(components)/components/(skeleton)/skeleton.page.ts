import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { CodePreviewDirective } from '../../../../shared/code/code-preview.directive';
import { CodeComponent } from '../../../../shared/code/code.component';
import { MainSectionDirective } from '../../../../shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../../shared/layout/section-sub-heading.component';
import { TabsCliComponent } from '../../../../shared/layout/tabs-cli.component';
import { TabsComponent } from '../../../../shared/layout/tabs.component';
import { UIApiDocsComponent } from '../../../../shared/layout/ui-docs-section/ui-docs-section.component';
import { metaWith } from '../../../../shared/meta/meta.util';
import { SkeletonPreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './skeleton.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Skeleton', api: 'skeleton' },
	meta: metaWith('spartan/ui - Skeleton', 'Use to show a placeholder while content is loading.'),
	title: 'spartan/ui - Skeleton',
};
@Component({
	selector: 'spartan-skeleton',
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
		SkeletonPreviewComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Skeleton" lead="Use to show a placeholder while content is loading." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-skeleton-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui skeleton"
				ngCode="ng g @spartan-ng/cli:ui skeleton"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="slider" label="Slider" />
				<spartan-page-bottom-nav-link direction="previous" href="sheet" label="Sheet" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class SkeletonPageComponent {
	protected readonly defaultCode = defaultCode;
	protected readonly defaultSkeleton = defaultSkeleton;
	protected readonly defaultImports = defaultImports;
}
