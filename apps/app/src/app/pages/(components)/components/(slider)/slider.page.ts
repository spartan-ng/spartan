import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
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
import { metaWith } from '../../../../shared/meta/meta.util';
import { defaultCode } from './slider.generated';
import { SliderPreview, defaultImports, defaultSlider } from './slider.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Slider' },
	meta: metaWith('spartan/ui - Slider', 'An input where the user selects a value from within a given range.'),
	title: 'spartan/ui - Slider',
};
@Component({
	selector: 'spartan-slider',
	imports: [
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
		SliderPreview,
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
export default class SliderPage {
	protected readonly _defaultCode = defaultCode;
	protected readonly _defaultSlider = defaultSlider;
	protected readonly _defaultImports = defaultImports;
}
