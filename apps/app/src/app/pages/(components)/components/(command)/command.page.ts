import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { CommandGroups } from '@spartan-ng/app/app/pages/(components)/components/(command)/command--groups.example';
import { CommandRtl } from '@spartan-ng/app/app/pages/(components)/components/(command)/command--rtl.example';
import { CommandScrollable } from '@spartan-ng/app/app/pages/(components)/components/(command)/command--scrollable.example';
import { CommandShortcuts } from '@spartan-ng/app/app/pages/(components)/components/(command)/command--shortcuts.example';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { RtlHeader } from '@spartan-ng/app/app/shared/code/rtl-header';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
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
import { CommandBasic } from './command--basic.example';
import { CommandPreview, defaultImports, defaultSkeleton } from './command.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Command', api: 'command' },
	meta: metaWith('spartan/ui - Command', 'Fast, composable, command menu for Angular.'),
	title: 'spartan/ui - Command',
};

@Component({
	selector: 'spartan-command',
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
		CommandPreview,
		CommandBasic,
		SectionSubSubHeading,
		RtlHeader,
		CodeRtlPreview,
		CommandRtl,
		CommandScrollable,
		CommandGroups,
		CommandShortcuts,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Command" lead="Fast, composable, command menu for Angular." showThemeToggle />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-command-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="command" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__basic" spartanH4>Basic</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-command-basic />
				</div>
				<spartan-code secondTab [code]="_commandBasicCode()" />
			</spartan-tabs>

			<h3 id="examples__shortcuts" spartanH4>Shortcuts</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-command-shortcuts />
				</div>
				<spartan-code secondTab [code]="_commandShortcutsCode()" />
			</spartan-tabs>

			<h3 id="examples__groups" spartanH4>Groups</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-command-groups />
				</div>
				<spartan-code secondTab [code]="_commandGroupsCode()" />
			</spartan-tabs>

			<h3 id="examples__scrollable" spartanH4>Scrollable</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-command-scrollable />
				</div>
				<spartan-code secondTab [code]="_commandScrollableCode()" />
			</spartan-tabs>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-command-rtl />
				</div>
				<spartan-code secondTab [code]="_commandRtlCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="context-menu" label="Context Menu" />
				<spartan-page-bottom-nav-link direction="previous" href="combobox" label="Combobox" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class CommandPage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('command');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _commandBasicCode = computed(() => this._snippets()['basic']);
	protected readonly _commandGroupsCode = computed(() => this._snippets()['groups']);
	protected readonly _commandRtlCode = computed(() => this._snippets()['rtl']);
	protected readonly _commandScrollableCode = computed(() => this._snippets()['scrollable']);
	protected readonly _commandShortcutsCode = computed(() => this._snippets()['shortcuts']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
