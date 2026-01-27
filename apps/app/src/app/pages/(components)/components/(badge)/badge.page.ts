import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
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
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { BadgeColorsPreview } from './badge--colors.preview';
import { BadgeIconsPreview } from './badge--icons.preview';
import { BadgeLink } from './badge--link.example';
import { BadgeSpinnerPreview } from './badge--spinner.preview';
import { BadgeVariantsPreview } from './badge--variants.preview';
import { BadgePreview, defaultImports, defaultSkeleton } from './badge.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Badge', api: 'badge' },
	meta: metaWith('spartan/ui - Badge', 'Makes a component look like a badge.'),
	title: 'spartan/ui - Badge',
};

@Component({
	selector: 'spartan-badge',
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
		SectionSubSubHeading,
		BadgePreview,
		BadgeVariantsPreview,
		BadgeIconsPreview,
		BadgeSpinnerPreview,
		BadgeLink,
		BadgeColorsPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Badge" lead="Makes a component look like a badge." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-badge-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui badge" ngCode="ng g @spartan-ng/cli:ui badge" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__variants" spartanH4>Variants</h3>
			<p class="${hlmP}">
				Use the
				<code class="${hlmCode}">variant</code>
				prop to change the variant of the badge.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-badge-variants-preview />
				</div>
				<spartan-code secondTab [code]="_variantsCode()" />
			</spartan-tabs>

			<h3 id="examples__icons" spartanH4>With Icon</h3>
			<p class="${hlmP}">You can render an icon inside the badge.</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-badge-icons-preview />
				</div>
				<spartan-code secondTab [code]="_iconsCode()" />
			</spartan-tabs>

			<h3 id="examples__spinner" spartanH4>With Spinner</h3>
			<p class="${hlmP}">You can render a spinner inside the badge.</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-badge-spinner-preview />
				</div>
				<spartan-code secondTab [code]="_spinnerCode()" />
			</spartan-tabs>

			<h3 id="examples__link" spartanH4>Link</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-badge-link />
				</div>
				<spartan-code secondTab [code]="_linkCode()" />
			</spartan-tabs>

			<h3 id="examples__colors" spartanH4>Custom Colors</h3>
			<p class="${hlmP}">
				You can customize the colors of a badge by adding custom classes such as
				<code class="${hlmCode}">bg-blue-50</code>
				and
				<code class="${hlmCode}">text-blue-700</code>
				to the
				<code class="${hlmCode}">hlmBadge</code>
				component.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-badge-colors-preview />
				</div>
				<spartan-code secondTab [code]="_colorsCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="breadcrumb" label="Breadcrumb" />
				<spartan-page-bottom-nav-link direction="previous" href="avatar" label="Avatar" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class BadgePage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('badge');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _variantsCode = computed(() => this._snippets()['variants']);
	protected readonly _iconsCode = computed(() => this._snippets()['icons']);
	protected readonly _spinnerCode = computed(() => this._snippets()['spinner']);
	protected readonly _linkCode = computed(() => this._snippets()['link']);
	protected readonly _colorsCode = computed(() => this._snippets()['colors']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
