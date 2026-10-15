import type { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { UIApiDocs } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';
import { PageBottomNavPlaceholder } from '../../../../shared/layout/page-bottom-nav-placeholder';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { metaWith } from '../../../../shared/meta/meta.util';
import { TraceChainOfThought } from './trace--chain-of-thought.preview';
import { TraceCollapsible } from './trace--collapsible.preview';
import { TraceDescription } from './trace--description.preview';
import { TraceDialog } from './trace--dialog.preview';
import { TraceGroup } from './trace--group.preview';
import { TraceLine } from './trace--line.preview';
import { TraceLink } from './trace--link.preview';
import { TraceOpenStatus } from './trace--open-status.preview';
import { TraceSheet } from './trace--sheet.preview';
import { TraceSources } from './trace--sources.preview';
import { TraceStatus } from './trace--status.preview';
import { TracePreview, defaultImports, defaultSkeleton } from './trace.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'trace', api: 'trace' },
	meta: metaWith('spartan/ui - Trace', 'The building block for reasoning, tool calls, sources and more.'),
	title: 'spartan/ui - Trace',
};

@Component({
	selector: 'spartan-trace',
	imports: [
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		TracePreview,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		PageBottomNavPlaceholder,
		UIApiDocs,
		SectionSubSubHeading,
		TraceLine,
		TraceStatus,
		TraceDescription,
		TraceCollapsible,
		TraceOpenStatus,
		TraceLink,
		TraceDialog,
		TraceSheet,
		TraceGroup,
		TraceSources,
		TraceChainOfThought,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Trace"
				lead="The building block for reasoning, tool calls, sources and more."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-trace-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui trace"
				ngCode="ng g @spartan-ng/cli:ui trace"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_imports" />
				<spartan-code [code]="_codeSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="trace-line" spartanH4>Trace Line</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-trace-line />
				</div>
				<spartan-code secondTab [code]="_traceLineCode()" />
			</spartan-tabs>

			<h3 id="status" spartanH4>Status</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-trace-status />
				</div>
				<spartan-code secondTab [code]="_statusCode()" />
			</spartan-tabs>

			<h3 id="description" spartanH4>Description</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-trace-description />
				</div>
				<spartan-code secondTab [code]="_descriptionCode()" />
			</spartan-tabs>

			<h3 id="collapsible" spartanH4>Collapsible</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-trace-collapsible />
				</div>
				<spartan-code secondTab [code]="_collapsibleCode()" />
			</spartan-tabs>

			<h3 id="open-status" spartanH4>Open Status</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-trace-open-status />
				</div>
				<spartan-code secondTab [code]="_openStatusCode()" />
			</spartan-tabs>

			<h3 id="link" spartanH4>Link</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-trace-link />
				</div>
				<spartan-code secondTab [code]="_linkCode()" />
			</spartan-tabs>

			<h3 id="dialog" spartanH4>Dialog</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-trace-dialog />
				</div>
				<spartan-code secondTab [code]="_dialogCode()" />
			</spartan-tabs>

			<h3 id="sheet" spartanH4>Sheet</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-trace-sheet />
				</div>
				<spartan-code secondTab [code]="_sheetCode()" />
			</spartan-tabs>

			<h3 id="group" spartanH4>Group</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-trace-group />
				</div>
				<spartan-code secondTab [code]="_groupCode()" />
			</spartan-tabs>

			<h3 id="sources" spartanH4>Sources</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-trace-sources />
				</div>
				<spartan-code secondTab [code]="_sourcesCode()" />
			</spartan-tabs>

			<h3 id="chain-of-thought" spartanH4>Chain of Thought</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-trace-chain-of-thought />
				</div>
				<spartan-code secondTab [code]="_chainOfThoughtCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="alert" label="Alert" />
				<spartan-page-bottom-nav-placeholder />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class TracePage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('trace');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _traceLineCode = computed(() => this._snippets()['line']);
	protected readonly _statusCode = computed(() => this._snippets()['status']);
	protected readonly _descriptionCode = computed(() => this._snippets()['description']);
	protected readonly _collapsibleCode = computed(() => this._snippets()['collapsible']);
	protected readonly _openStatusCode = computed(() => this._snippets()['openStatus']);
	protected readonly _linkCode = computed(() => this._snippets()['link']);
	protected readonly _dialogCode = computed(() => this._snippets()['dialog']);
	protected readonly _sheetCode = computed(() => this._snippets()['sheet']);
	protected readonly _groupCode = computed(() => this._snippets()['group']);
	protected readonly _sourcesCode = computed(() => this._snippets()['sources']);
	protected readonly _chainOfThoughtCode = computed(() => this._snippets()['chainOfThought']);
	protected readonly _imports = defaultImports;
	protected readonly _codeSkeleton = defaultSkeleton;
}
