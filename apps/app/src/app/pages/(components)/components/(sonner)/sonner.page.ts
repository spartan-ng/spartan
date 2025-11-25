import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { hlmP } from '@spartan-ng/helm/typography';
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
import { link } from '../../../../shared/typography/link';
import { SonnerPreview, defaultImports, defaultSkeleton } from './sonner.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Sonner', api: 'sonner' },
	meta: metaWith('spartan/ui - Sonner', 'An opinionated toast component for Angular.'),
	title: 'spartan/ui - Sonner',
};
@Component({
	selector: 'spartan-sonner',
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
		SonnerPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Sonner" lead="An opinionated toast component for Angular." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-sonner-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="about">About</spartan-section-sub-heading>
			<p class="${hlmP}">
				Sonner is built on top of
				<a href="https://tutkli.github.io/ngx-sonner/" target="_blank" rel="noreferrer" class="${link}">ngx-sonner</a>
				by
				<a href="https://github.com/tutkli" target="_blank" rel="noreferrer" class="${link}">&#64;tutkli</a>
				.
			</p>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui sonner" ngCode="ng g @spartan-ng/cli:ui sonner" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="table" label="Table" />
				<spartan-page-bottom-nav-link direction="previous" href="slider" label="Slider" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class SonnerPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('sonner');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
