import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { link } from '@spartan-ng/app/app/shared/typography/link';
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
import { MenubarPreview, defaultImports, defaultSkeleton } from './menubar.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Menubar', api: 'menubar' },
	meta: metaWith(
		'spartan/ui - Menubar',
		'A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.',
	),
	title: 'spartan/ui - Menubar',
};
@Component({
	selector: 'spartan-menubar',
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
		MenubarPreview,
		RouterLink,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Menubar"
				lead="A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-menubar-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="about">About</spartan-section-sub-heading>
			<p class="${hlmP}">
				Menubar is built with the help of
				<a href="https://material.angular.dev/cdk/menu/overview" target="_blank" rel="noreferrer" class="${link}">
					Menu
				</a>
				from Material CDK and
				<a routerLink="/components/dropdown-menu" hlmBtn variant="link" class="${link}">Dropdown Menu</a>
				.
			</p>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui menubar"
				ngCode="ng g @spartan-ng/cli:ui menubar"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="navigation-menu" label="Navigation Menu" />
				<spartan-page-bottom-nav-link direction="previous" href="label" label="Label" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class LabelPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('menubar');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
