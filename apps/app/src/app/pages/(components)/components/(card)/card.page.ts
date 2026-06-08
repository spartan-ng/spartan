import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { RtlHeader } from '@spartan-ng/app/app/shared/code/rtl-header';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { CardEdgeToEdge } from './card--edge-to-edge.preview';
import { CardImagePreview } from './card--image.preview';
import { CardRtl } from './card--rtl.preview';
import { CardSizePreview } from './card--size.preview';
import { CardSpacing } from './card--spacing.preview';
import { CardPreview, defaultImports, defaultSkeleton } from './card.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Card', api: 'card' },
	meta: metaWith('spartan/ui - Card', 'Displays a card with header, content, and footer.'),
	title: 'spartan/ui - Card',
};

@Component({
	selector: 'spartan-card',
	imports: [
		UIApiDocs,
		MainSection,
		InstallTabs,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,

		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		SectionSubSubHeading,
		RtlHeader,
		CodeRtlPreview,
		CardPreview,
		CardSizePreview,
		CardSpacing,
		CardEdgeToEdge,
		CardImagePreview,
		CardRtl,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Card" lead="Displays a card with header, content, and footer." showThemeToggle />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-card-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="card" [showOnlyVega]="false" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="size" spartanH4>Size</h3>

			<p class="${hlmP}">
				Use the
				<code class="${hlmCode}">size="sm"</code>
				prop to set the size of the card to small. The small size variant uses smaller spacing.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-card-size-preview />
				</div>
				<spartan-code secondTab [code]="_sizeCode()" />
			</spartan-tabs>

			<h3 id="spacing" spartanH4>Spacing</h3>

			<p class="${hlmP}">
				In addition to the
				<code class="${hlmCode}">size</code>
				prop, you can use the
				<code class="${hlmCode}">--card-spacing</code>
				CSS variable to control the spacing between sections and the inset of card parts.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-card-spacing />
				</div>
				<spartan-code secondTab [code]="_spacingCode()" />
			</spartan-tabs>

			<p class="${hlmP}">
				Use negative margins with
				<code class="${hlmCode}">-mx-(--card-spacing)</code>
				to make content go edge to edge while keeping it aligned with the card inset. When the edge-to-edge content sits
				above a footer, use
				<code class="${hlmCode}">-mb-(--card-spacing)</code>
				on
				<code class="${hlmCode}">hlmCardContent</code>
				to remove the section gap.
			</p>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-card-edge-to-edge />
				</div>
				<spartan-code secondTab [code]="_edgeToEdgeCode()" />
			</spartan-tabs>

			<h3 id="image" spartanH4>Image</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-card-image-preview />
				</div>
				<spartan-code secondTab [code]="_imageCode()" />
			</spartan-tabs>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-card-rtl />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="carousel" label="Carousel" />
				<spartan-page-bottom-nav-link direction="previous" href="calendar" label="Calendar" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class CardPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('card');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _sizeCode = computed(() => this._snippets()['size']);
	protected readonly _spacingCode = computed(() => this._snippets()['spacing']);
	protected readonly _edgeToEdgeCode = computed(() => this._snippets()['edgeToEdge']);
	protected readonly _imageCode = computed(() => this._snippets()['image']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
