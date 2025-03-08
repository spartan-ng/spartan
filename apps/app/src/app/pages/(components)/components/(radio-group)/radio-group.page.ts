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
import { cardCode, RadioGroupCardComponent } from './radio-group--card.example';
import { defaultCode, defaultImports, defaultSkeleton, RadioGroupPreviewComponent } from './radio-group.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Radio Group' },
	meta: metaWith(
		'spartan/ui - Radio Group',
		'A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.',
	),
	title: 'spartan/ui - Radio Group',
};
@Component({
	selector: 'spartan-radio-group',
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
		RadioGroupPreviewComponent,
		RadioGroupPreviewComponent,
		RadioGroupCardComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Radio Group"
				lead="A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-radio-group-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui radiogroup"
				ngCode="ng g @spartan-ng/cli:ui radiogroup"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__default" class="${hlmH4} mb-2 mt-6">Card Layout</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-radio-card-preview />
				</div>
				<spartan-code secondTab [code]="cardCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="scroll-area" label="Scroll Area" />
				<spartan-page-bottom-nav-link direction="previous" href="progress" label="Progress" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class LabelPageComponent {
	protected readonly defaultCode = defaultCode;
	protected readonly defaultSkeleton = defaultSkeleton;
	protected readonly defaultImports = defaultImports;

	protected readonly cardCode = cardCode;
}
