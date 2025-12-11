import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
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
import { ContextMenuPreviewWithState } from './context-menu-with-state.preview';
import { ContextMenuPreview, defaultImports, defaultSkeleton } from './context-menu.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Context Menu', api: 'context-menu' },
	meta: metaWith(
		'spartan/ui - Context Menu',
		'Displays a menu to the user — such as a set of actions or functions — triggered by a right-click.',
	),
	title: 'spartan/ui - Context Menu',
};

@Component({
	selector: 'spartan-context-menu',
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
		ContextMenuPreview,
		ContextMenuPreviewWithState,
		SectionSubSubHeading,
		RouterLink,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Context Menu"
				lead="Displays a menu to the user — such as a set of actions or functions — triggered by a right click."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-context-menu-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="about">About</spartan-section-sub-heading>
			<p class="${hlmP}">
				Context Menu is built with the help of
				<a href="https://material.angular.dev/cdk/menu/overview" target="_blank" rel="noreferrer" class="${link}">
					Menu
				</a>
				from Material CDK and
				<a routerLink="/components/dropdown-menu" hlmBtn variant="link" class="${link}">Dropdown Menu</a>
				.
			</p>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui context-menu" ngCode="ng @spartan-ng/cli:ui context-menu" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<h3 id="examples__stateful" spartanH4>Stateful</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-context-menu-with-state />
				</div>
				<spartan-code secondTab [code]="_withStateCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="data-table" label="Data Table" />
				<spartan-page-bottom-nav-link direction="previous" href="command" label="Command" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class ComboboxPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('context-menu');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _withStateCode = computed(() => this._snippets()['withState']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
