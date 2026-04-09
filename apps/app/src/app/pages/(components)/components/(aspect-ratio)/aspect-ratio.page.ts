import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { RtlHeader } from '@spartan-ng/app/app/shared/code/rtl-header';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { PrimitiveSnippetsService } from '../../../../core/services/primitive-snippets.service';
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
import { AspectRatioPortrait } from './aspect-ratio--portrait.example';
import { AspectRatioRtl } from './aspect-ratio--rtl.example';
import { AspectRatioSquare } from './aspect-ratio--square.example';
import { AspectRatioPreview, defaultImports, defaultSkeleton } from './aspect-ratio.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Aspect Ratio', api: 'aspect-ratio' },
	meta: metaWith('spartan/ui - Aspect Ratio', 'Displays content within a desired ratio.'),
	title: 'spartan/ui - Aspect Ratio',
};

@Component({
	selector: 'spartan-aspect-ratio',
	imports: [
		UIApiDocs,
		MainSection,
		InstallTabs,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		SectionSubSubHeading,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		RtlHeader,
		CodeRtlPreview,
		AspectRatioPreview,
		AspectRatioSquare,
		AspectRatioPortrait,
		AspectRatioRtl,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Aspect Ratio" lead="Displays content within a desired ratio." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-aspect-ratio-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="aspect-ratio" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__square" spartanH4>Square</h3>
			<p class="${hlmP}">
				A square aspect ratio component using the
				<code class="${hlmCode}">[hlmAspectRatio]="1 / 1"</code>
				prop. This is useful for displaying images in a square format.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-aspect-ratio-square />
				</div>
				<spartan-code secondTab [code]="_squareCode()" />
			</spartan-tabs>

			<h3 id="examples__portrait" spartanH4>Portrait</h3>
			<p class="${hlmP}">
				A portrait aspect ratio component using the
				<code class="${hlmCode}">[hlmAspectRatio]="9 / 16"</code>
				prop. This is useful for displaying images in a portrait format.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-aspect-ratio-portrait />
				</div>
				<spartan-code secondTab [code]="_portraitCode()" />
			</spartan-tabs>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-aspect-ratio-rtl />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="autocomplete" label="Autocomplete" />
				<spartan-page-bottom-nav-link direction="previous" href="alert-dialog" label="Alert Dialog" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class AlertPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('aspect-ratio');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _squareCode = computed(() => this._snippets()['square']);
	protected readonly _portraitCode = computed(() => this._snippets()['portrait']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
