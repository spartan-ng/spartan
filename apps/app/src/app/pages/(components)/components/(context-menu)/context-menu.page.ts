import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { RtlHeader } from '@spartan-ng/app/app/shared/code/rtl-header';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
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
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { ContextMenuBasic } from './context-menu--basic.preview';
import { ContextMenuDestructive } from './context-menu--destructive.preview';
import { ContextMenuIcons } from './context-menu--icons.preview';
import { ContextMenuRtl } from './context-menu--rtl.preview';
import { ContextMenuShortcuts } from './context-menu--shortcuts.preview';
import { ContextMenuSides } from './context-menu--sides.preview';
import { ContextMenuSubmenu } from './context-menu--submenu.preview';
import { ContextMenuPreviewWithState } from './context-menu-with-state.preview';
import { ContextMenuPreview, defaultImports, defaultSkeleton } from './context-menu.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Context Menu', api: 'context-menu' },
	meta: metaWith('spartan/ui - Context Menu', 'Displays a menu of actions triggered by a right click.'),
	title: 'spartan/ui - Context Menu',
};

@Component({
	selector: 'spartan-context-menu',
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
		RouterLink,
		RtlHeader,
		CodeRtlPreview,
		ContextMenuPreview,
		ContextMenuBasic,
		ContextMenuSubmenu,
		ContextMenuShortcuts,
		ContextMenuIcons,
		ContextMenuDestructive,
		ContextMenuSides,
		ContextMenuPreviewWithState,
		ContextMenuRtl,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Context Menu"
				lead="Displays a menu of actions triggered by a right click."
				showThemeToggle
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

			<spartan-install-tabs primitive="context-menu" [showOnlyVega]="false" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="basic" spartanH4>Basic</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-context-menu-basic />
				</div>
				<spartan-code secondTab [code]="_basicCode()" />
			</spartan-tabs>

			<h3 id="submenu" spartanH4>Submenu</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-context-menu-submenu />
				</div>
				<spartan-code secondTab [code]="_submenuCode()" />
			</spartan-tabs>

			<h3 id="shortcuts" spartanH4>Shortcuts</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-context-menu-shortcuts />
				</div>
				<spartan-code secondTab [code]="_shortcutsCode()" />
			</spartan-tabs>

			<h3 id="icons" spartanH4>Icons</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-context-menu-icons />
				</div>
				<spartan-code secondTab [code]="_iconsCode()" />
			</spartan-tabs>

			<h3 id="destructive" spartanH4>Destructive</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-context-menu-destructive />
				</div>
				<spartan-code secondTab [code]="_destructiveCode()" />
			</spartan-tabs>

			<h3 id="sides" spartanH4>Sides</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-context-menu-sides />
				</div>
				<spartan-code secondTab [code]="_sidesCode()" />
			</spartan-tabs>

			<h3 id="stateful" spartanH4>Stateful</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-context-menu-with-state />
				</div>
				<spartan-code secondTab [code]="_withStateCode()" />
			</spartan-tabs>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-context-menu-rtl />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
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
export default class ContextMenuPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('context-menu');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _basicCode = computed(() => this._snippets()['basic']);
	protected readonly _submenuCode = computed(() => this._snippets()['submenu']);
	protected readonly _shortcutsCode = computed(() => this._snippets()['shortcuts']);
	protected readonly _iconsCode = computed(() => this._snippets()['icons']);
	protected readonly _destructiveCode = computed(() => this._snippets()['destructive']);
	protected readonly _sidesCode = computed(() => this._snippets()['sides']);
	protected readonly _withStateCode = computed(() => this._snippets()['withState']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
