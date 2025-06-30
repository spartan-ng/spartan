import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmP } from '@spartan-ng/helm/typography';
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
import { link } from '../../../../shared/typography/link';
import { defaultCode } from './sonner.generated';
import { SonnerPreviewComponent, defaultImports, defaultSkeleton } from './sonner.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Sonner', api: 'sonner' },
	meta: metaWith('spartan/ui - Sonner', 'An opinionated toast component for Angular.'),
	title: 'spartan/ui - Sonner',
};
@Component({
	selector: 'spartan-sonner',
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
		SonnerPreviewComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Sonner" lead="An opin./ionated toast component for Angular." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-sonner-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="about">About</spartan-section-sub-heading>
			<p class="${hlmP} mb-6">
				Sonner is built on top of
				<a
					href="https://tutkli.github.io/ngx-sonner/"
					target="_blank"
					rel="noreferrer"
					hlmBtn
					variant="link"
					class="${link}"
				>
					ngx-sonner
				</a>
				by
				<a href="https://github.com/tutkli" target="_blank" rel="noreferrer" hlmBtn variant="link" class="${link}">
					&#64;tutkli
				</a>
				.
			</p>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui sonner"
				ngCode="ng g @spartan-ng/cli:ui sonner"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="table" label="Table" />
				<spartan-page-bottom-nav-link direction="previous" href="slider" label="Slider" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class SonnerPageComponent {
	protected readonly defaultCode = defaultCode;
	protected readonly defaultSkeleton = defaultSkeleton;
	protected readonly defaultImports = defaultImports;
}
