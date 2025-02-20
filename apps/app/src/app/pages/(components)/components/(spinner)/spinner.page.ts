import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmH4 } from '@spartan-ng/ui-typography-helm';
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
import { metaWith } from '../../../../shared/meta/meta.util';
import { SpinnerPreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './spinner.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Spinner' },
	meta: metaWith(
		'spartan/ui - Spinner',
		'Shows a Loading spinner to indicate that the app is busy or the page is still loading.',
	),
	title: 'spartan/ui - Spinner',
};
@Component({
	selector: 'spartan-spinner',
	imports: [
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
		SpinnerPreviewComponent,
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
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui spinner"
				ngCode="ng g @spartan-ng/cli:ui spinner"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="usage">Variants</spartan-section-sub-heading>
			The spinner component has the following variants:

			<h3 id="variants__size" class="${hlmH4} mb-2 mt-6">size</h3>
			The size of the spinner. (default: w-8)
			<!-- <code [innerHTML]="'<hlm-spinner size="xl" />'"></code> -->

			<ul class="list-disc pl-8">
				<li>
					<code>xs: w-4</code>
				</li>
				<li>
					<code>sm: w-6</code>
				</li>
				<li>
					<code>lg: w-12</code>
				</li>
				<li>
					<code>xl: w-16</code>
				</li>
			</ul>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="switch" label="Switch" />
				<spartan-page-bottom-nav-link direction="previous" href="skeleton" label="Skeleton" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class SpinnerPageComponent {
	protected readonly defaultCode = defaultCode;
	protected readonly defaultSkeleton = defaultSkeleton;
	protected readonly defaultImports = defaultImports;
}
