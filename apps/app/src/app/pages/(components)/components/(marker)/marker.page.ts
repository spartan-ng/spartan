import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
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
import { MarkerBorderPreview } from './marker--border.preview';
import { MarkerIconPreview } from './marker--icon.preview';
import { MarkerLinkButtonPreview } from './marker--link-button.preview';
import { MarkerRtlPreview } from './marker--rtl.preview';
import { MarkerSeparatorPreview } from './marker--separator.preview';
import { MarkerShimmerPreview } from './marker--shimmer.preview';
import { MarkerStatusPreview } from './marker--status.preview';
import { MarkerVariantsPreview } from './marker--variants.preview';
import { defaultImports, defaultSkeleton, MarkerPreview } from './marker.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Marker', api: 'marker' },
	meta: metaWith(
		'spartan/ui - Marker',
		'Displays status updates, system notes, and labeled separators in a conversation.',
	),
	title: 'spartan/ui - Marker',
};

@Component({
	selector: 'spartan-marker',
	imports: [
		UIApiDocs,
		MainSection,
		InstallTabs,
		Code,
		SectionIntro,
		SectionSubHeading,
		SectionSubSubHeading,
		Tabs,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		MarkerPreview,
		MarkerVariantsPreview,
		MarkerStatusPreview,
		MarkerShimmerPreview,
		MarkerSeparatorPreview,
		MarkerBorderPreview,
		MarkerIconPreview,
		MarkerLinkButtonPreview,
		RtlHeader,
		CodeRtlPreview,
		MarkerRtlPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Marker"
				lead="Displays status updates, system notes, and labeled separators in a conversation."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-marker-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="marker" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<p class="${hlmP}">
				For in-progress updates, set
				<code class="${hlmCode}">role="status"</code>
				so assistive technology announces the change. Use the
				<code class="${hlmCode}">shimmer</code>
				class for typing / thinking states.
			</p>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__variants" spartanH4>Variants</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-marker-variants-preview />
				</div>
				<spartan-code secondTab [code]="_variantsCode()" />
			</spartan-tabs>

			<h3 id="examples__status" spartanH4>Status</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-marker-status-preview />
				</div>
				<spartan-code secondTab [code]="_statusCode()" />
			</spartan-tabs>

			<h3 id="examples__shimmer" spartanH4>Shimmer</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-marker-shimmer-preview />
				</div>
				<spartan-code secondTab [code]="_shimmerCode()" />
			</spartan-tabs>

			<h3 id="examples__separator" spartanH4>Separator</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-marker-separator-preview />
				</div>
				<spartan-code secondTab [code]="_separatorCode()" />
			</spartan-tabs>

			<h3 id="examples__border" spartanH4>Border</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-marker-border-preview />
				</div>
				<spartan-code secondTab [code]="_borderCode()" />
			</spartan-tabs>

			<h3 id="examples__with_icon" spartanH4>With Icon</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-marker-icon-preview />
				</div>
				<spartan-code secondTab [code]="_iconCode()" />
			</spartan-tabs>

			<h3 id="examples__links_and_buttons" spartanH4>Links and Buttons</h3>
			<p class="${hlmP} mb-2">
				Put
				<code class="${hlmCode}">hlmMarker</code>
				on an
				<code class="${hlmCode}">a</code>
				or
				<code class="${hlmCode}">button</code>
				for interactive markers.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-marker-link-button-preview />
				</div>
				<spartan-code secondTab [code]="_linkButtonCode()" />
			</spartan-tabs>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-marker-rtl-preview />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="menubar" label="Menubar" />
				<spartan-page-bottom-nav-link direction="previous" href="label" label="Label" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class MarkerPage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('marker');
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _variantsCode = computed(() => this._snippets()['variants']);
	protected readonly _statusCode = computed(() => this._snippets()['status']);
	protected readonly _shimmerCode = computed(() => this._snippets()['shimmer']);
	protected readonly _separatorCode = computed(() => this._snippets()['separator']);
	protected readonly _borderCode = computed(() => this._snippets()['border']);
	protected readonly _iconCode = computed(() => this._snippets()['icon']);
	protected readonly _linkButtonCode = computed(() => this._snippets()['linkButton']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);
}
