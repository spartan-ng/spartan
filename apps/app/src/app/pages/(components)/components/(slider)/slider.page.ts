import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { UIApiDocs } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section';
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
import { SliderDisabled } from './slider--disabled.example';
import { SliderForm } from './slider--form.example';
import { SliderMultipleThumbs } from './slider--multiple-thumbs.example';
import { SliderRange } from './slider--range.example';
import { SliderTicks } from './slider--ticks.example';
import { SliderVertical } from './slider--vertical.example';

import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { hlmCode } from '@spartan-ng/helm/typography';
import { SliderPreview, defaultImports, defaultSkeleton } from './slider.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Slider', api: 'slider' },
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
		SectionSubSubHeading,
		SliderDisabled,
		SliderForm,
		SliderMultipleThumbs,
		SliderPreview,
		SliderRange,
		SliderTicks,
		SliderVertical,
		UIApiDocs,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Slider" lead="An input where the user selects a value from within a given range." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-slider-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui slider" ngCode="ng g @spartan-ng/cli:ui slider" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSlider" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__range" spartanH4>Range</h3>
			<p class="py-2">Use an array with two values for a range slider.</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-slider-range />
				</div>
				<spartan-code secondTab [code]="_rangeCode()" />
			</spartan-tabs>

			<h3 id="examples__multiple-thumbs" spartanH4>Multiple Thumbs</h3>
			<p class="py-2">Use an array with multiple values for multiple thumbs.</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-slider-multiple-thumbs />
				</div>
				<spartan-code secondTab [code]="_multipleThumbsCode()" />
			</spartan-tabs>

			<h3 id="examples__vertical" spartanH4>Vertical</h3>
			<p class="py-2">
				Use
				<code class="${hlmCode}">orientation="vertical"</code>
				for a vertical slider.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-slider-vertical />
				</div>
				<spartan-code secondTab [code]="_verticalCode()" />
			</spartan-tabs>

			<h3 id="examples__disabled" spartanH4>Disabled</h3>
			<p class="py-2">
				Use the
				<code class="${hlmCode}">disabled</code>
				input to disable the slider.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-slider-disabled />
				</div>
				<spartan-code secondTab [code]="_verticalCode()" />
			</spartan-tabs>

			<h3 id="examples__ticks" spartanH4>Ticks</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-slider-ticks />
				</div>
				<spartan-code secondTab [code]="_ticksCode()" />
			</spartan-tabs>

			<h3 id="examples__form" spartanH4>Form</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-slider-form />
				</div>
				<spartan-code secondTab [code]="_formCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="sonner" label="Sonner" />
				<spartan-page-bottom-nav-link direction="previous" href="skeleton" label="Skeleton" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class SliderPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('slider');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);

	protected readonly _rangeCode = computed(() => this._snippets()['range']);
	protected readonly _multipleThumbsCode = computed(() => this._snippets()['multipleThumbs']);
	protected readonly _verticalCode = computed(() => this._snippets()['vertical']);
	protected readonly _disabledCode = computed(() => this._snippets()['disabled']);
	protected readonly _ticksCode = computed(() => this._snippets()['ticks']);
	protected readonly _formCode = computed(() => this._snippets()['form']);

	protected readonly _defaultSlider = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
