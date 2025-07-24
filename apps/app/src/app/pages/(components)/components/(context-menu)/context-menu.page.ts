import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmH4 } from '@spartan-ng/helm/typography';
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
import { contextMenuWithStateCode, defaultCode } from './context-menu.generated';
import { ContextMenuPreview, defaultImports, defaultSkeleton } from './context-menu.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Context Menu', api: 'menu' },
	meta: metaWith(
		'spartan/ui - Context Menu',
		'Displays a menu to the user — such as a set of actions or functions — triggered by a right-click.',
	),
	title: 'spartan/ui - Context Menu',
};

@Component({
	selector: 'spartan-command',
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
				<spartan-code secondTab [code]="_defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui contextmenu"
				ngCode="ng @spartan-ng/cli:ui contextmenu"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<h3 id="examples__stateful" class="${hlmH4} mb-2 mt-6">Stateful</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-context-menu-with-state />
				</div>
				<spartan-code secondTab [code]="_defaultCodeWithState" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="data-table" label="Data Table" />
				<spartan-page-bottom-nav-link direction="previous" href="command" label="Command" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class ComboboxPage {
	protected readonly _defaultCode = defaultCode;
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultCodeWithState = contextMenuWithStateCode;
	protected readonly _defaultImports = defaultImports;
}
