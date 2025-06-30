import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmCode, hlmH4 } from '@spartan-ng/helm/typography';
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
import { CarouselOrientationComponent } from './carousel--orientation.example';
import { CarouselPluginsComponent } from './carousel--plugins.example';
import { CarouselSizesComponent } from './carousel--sizes.example';
import { CarouselSlideCountComponent } from './carousel--slide-count.example';
import { CarouselSpacingComponent } from './carousel--spacing.example';
import {
	carouselOrientationCode,
	carouselPluginsCode,
	carouselSizesCode,
	carouselSlideCountCode,
	carouselSpacingCode,
	defaultCode,
} from './carousel.generated';
import { CarouselPreviewComponent, defaultImports, defaultSkeleton } from './carousel.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Carousel', api: 'carousel' },
	meta: metaWith('spartan/ui - Carousel', 'A carousel with motion and swipe built using Embla.'),
	title: 'spartan/ui - Carousel',
};

@Component({
	selector: 'spartan-carousel',
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
		CarouselPreviewComponent,
		CarouselSizesComponent,
		CarouselSpacingComponent,
		CarouselPluginsComponent,
		CarouselOrientationComponent,
		CarouselSlideCountComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Carousel" lead="A carousel with motion and swipe built using Embla." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-carousel-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui carousel"
				ngCode="ng g @spartan-ng/cli:ui carousel"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="defaultSkeleton" />
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
				<spartan-code secondTab [code]="sizesCode" />
			</spartan-tabs>

			<h3 id="examples__spacing" class="${hlmH4} mb-2 mt-6">Spacing</h3>
			<p class="py-2">
				The spacing between the items can be set by using a
				<code class="${hlmCode}">p-[VALUE]</code>
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
				<spartan-code secondTab [code]="spacingCode" />
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
				<spartan-code secondTab [code]="orientationCode" />
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
				<spartan-code secondTab [code]="slideCountCode" />
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
				<spartan-code secondTab [code]="pluginsCode" />
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
export default class CarouselPageComponent {
	public readonly defaultCode = defaultCode;
	public readonly defaultSkeleton = defaultSkeleton;
	public readonly defaultImports = defaultImports;
	protected readonly sizesCode = carouselSizesCode;
	protected readonly spacingCode = carouselSpacingCode;
	protected readonly slideCountCode = carouselSlideCountCode;
	protected readonly pluginsCode = carouselPluginsCode;
	protected readonly orientationCode = carouselOrientationCode;
}
