import type { RouteMeta } from '@analogjs/router';
import { Component, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { link } from '@spartan-ng/app/app/shared/typography/link';
import { hlmCode, hlmH4, hlmP } from '@spartan-ng/helm/typography';
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
import { CarouselOrientation } from './carousel--orientation.example';
import { CarouselPlugins } from './carousel--plugins.example';
import { CarouselSizes } from './carousel--sizes.example';
import { CarouselSlideCount } from './carousel--slide-count.example';
import { CarouselSpacing } from './carousel--spacing.example';
import { CarouselPreview, defaultImports, defaultSkeleton } from './carousel.preview';
export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Carousel', api: 'carousel' },
	meta: metaWith('spartan/ui - Carousel', 'A carousel with motion and swipe built using Embla.'),
	title: 'spartan/ui - Carousel',
};

@Component({
	selector: 'spartan-carousel',
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
		CarouselPreview,
		CarouselSizes,
		CarouselSpacing,
		CarouselPlugins,
		CarouselOrientation,
		CarouselSlideCount,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Carousel" lead="A carousel with motion and swipe built using Embla." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-carousel-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="about">About</spartan-section-sub-heading>
			<p class="${hlmP} mb-6">
				Carousel is built on top of
				<a href="https://www.embla-carousel.com/" target="_blank" rel="noreferrer" class="${link}">Embla Carousel</a>
				library and the
				<a
					href="https://github.com/donaldxdonald/embla-carousel-angular"
					target="_blank"
					rel="noreferrer"
					class="${link}"
				>
					embla-carousel-angular
				</a>
				wrapper .
			</p>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui carousel"
				ngCode="ng g @spartan-ng/cli:ui carousel"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__sizes" class="${hlmH4} mb-2 mt-6">Sizes</h3>
			<p class="py-2">
				The size of the items can be set by using the
				<code class="${hlmCode}">basis</code>
				utility class on the
				<code class="${hlmCode}">hlm-carousel-item</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-carousel-sizes />
				</div>
				<spartan-code secondTab [code]="_sizesCode" />
			</spartan-tabs>

			<h3 id="examples__spacing" class="${hlmH4} mb-2 mt-6">Spacing</h3>
			<p class="py-2">
				The spacing between the items can be set by using a
				<code class="${hlmCode}">pl-[VALUE]</code>
				utility on the
				<code class="${hlmCode}">hlm-carousel-item</code>
				and a negative
				<code class="${hlmCode}">-ml-[VALUE]</code>
				on the
				<code class="${hlmCode}">hlm-carousel-content</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-carousel-spacing />
				</div>
				<spartan-code secondTab [code]="_spacingCode" />
			</spartan-tabs>

			<h3 id="examples__orientation" class="${hlmH4} mb-2 mt-6">Orientation</h3>
			<p class="py-2">
				The
				<code class="${hlmCode}">orientation</code>
				prop can be used to set the orientation of the carousel.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-carousel-orientation />
				</div>
				<spartan-code secondTab [code]="_orientationCode" />
			</spartan-tabs>

			<h3 id="examples__slide_count" class="${hlmH4} mb-2 mt-6">Slide Count</h3>
			<p class="py-2">
				Use
				<code class="${hlmCode}">hlm-carousel-slide-display</code>
				to display the current and total slides.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-carousel-slide-count />
				</div>
				<spartan-code secondTab [code]="_slideCountCode" />
			</spartan-tabs>

			<h3 id="examples__plugins" class="${hlmH4} mb-2 mt-6">Plugins</h3>
			<p class="py-2">
				You can use the plugins
				<code class="${hlmCode}">plugins</code>
				prop to add plugins to the carousel.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-carousel-plugins />
				</div>
				<spartan-code secondTab [code]="_pluginsCode" />
			</spartan-tabs>
			<p class="py-2">
				See the
				<a class="font-medium underline" href="https://www.embla-carousel.com/api/plugins/" target="_blank">
					Embla Carousel docs
				</a>
				for more information on using plugins.
			</p>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="checkbox" label="Checkbox" />
				<spartan-page-bottom-nav-link direction="previous" href="card" label="Card" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class CarouselPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('carousel')();
	protected readonly _defaultCode = this._snippets['default'];
	protected readonly _sizesCode = this._snippets['sizes'];
	protected readonly _spacingCode = this._snippets['spacing'];
	protected readonly _slideCountCode = this._snippets['slideCount'];
	protected readonly _pluginsCode = this._snippets['plugins'];
	protected readonly _orientationCode = this._snippets['orientation'];
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
