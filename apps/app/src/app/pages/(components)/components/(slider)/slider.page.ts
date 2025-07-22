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
import { metaWith } from '../../../../shared/meta/meta.util';
import { defaultCode } from './slider.generated';
import { SliderPreviewComponent, defaultImports, defaultSlider } from './slider.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Slider' },
	meta: metaWith('spartan/ui - Slider', 'An input where the user selects a value from within a given range.'),
	title: 'spartan/ui - Slider',
};
@Component({
	selector: 'spartan-slider',
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
		SliderPreviewComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Slider" lead="An input where the user selects a value from within a given range." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-slider-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui slider"
				ngCode="ng g @spartan-ng/cli:ui slider"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSlider" />
			</div>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="sonner" label="Sonner" />
				<spartan-page-bottom-nav-link direction="previous" href="skeleton" label="Skeleton" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class SliderPageComponent {
	protected readonly _defaultCode = defaultCode;
	protected readonly _defaultSlider = defaultSlider;
	protected readonly _defaultImports = defaultImports;
}
