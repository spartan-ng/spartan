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
import { ProgressIndeterminatePreviewComponent, indeterminateCode } from './progress--indeterminate.preview';
import { ProgressPreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './progress.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Progress' },
	meta: metaWith(
		'spartan/ui - Progress',
		'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
	),
	title: 'spartan/ui - Progress',
};
@Component({
	selector: 'spartan-progress',
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
		ProgressPreviewComponent,
		ProgressIndeterminatePreviewComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Progress"
				lead="Displays an indicator showing the completion progress of a task, typically displayed as a progress bar."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-progress-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui progress"
				ngCode="ng g @spartan-ng/cli:ui progress"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__default" class="${hlmH4} mb-2 mt-6">Default</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-progress-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>
			<h3 id="examples__indeterminate" class="${hlmH4} mb-2 mt-6">Indeterminate</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-progress-indeterminate />
				</div>
				<spartan-code secondTab [code]="indeterminateCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="radio-group" label="Radio Group" />
				<spartan-page-bottom-nav-link direction="previous" href="popover" label="Popover" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class LabelPageComponent {
	protected readonly defaultCode = defaultCode;
	protected readonly defaultSkeleton = defaultSkeleton;
	protected readonly defaultImports = defaultImports;
	protected readonly indeterminateCode = indeterminateCode;
}
