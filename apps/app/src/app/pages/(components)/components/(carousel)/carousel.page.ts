import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmCode, hlmH4 } from '@spartan-ng/ui-typography-helm';
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
import { CarouselOrientationComponent, orientationCode } from './carousel--orientation.example';
import { CarouselPluginsComponent, pluginsCode } from './carousel--plugins.example';
import { CarouselSizesComponent, sizesCode } from './carousel--sizes.example';
import { CarouselSpacingComponent, spacingCode } from './carousel--spacing.example';
import { CarouselPreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './carousel.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Carousel' },
	meta: metaWith('spartan/ui - Carousel', 'A carousel with motion and swipe built using Embla.'),
	title: 'spartan/ui - Carousel',
};

@Component({
	selector: 'spartan-carousel',
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
		CarouselPreviewComponent,
		CarouselSizesComponent,
		CarouselSpacingComponent,
		CarouselPluginsComponent,
		CarouselOrientationComponent,
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
	protected readonly sizesCode = sizesCode;
	protected readonly spacingCode = spacingCode;
	protected readonly pluginsCode = pluginsCode;
	protected readonly orientationCode = orientationCode;
}
