import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { UIApiDocs } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section';
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
import { metaWith } from '../../../../shared/meta/meta.util';
import { ToolCallCodeOutput } from './tool-call--code-output.preview';
import { ToolCallCollapsed } from './tool-call--collapsed.preview';
import { ToolCallError } from './tool-call--error.preview';
import { ToolCallRejectReason } from './tool-call--reject-reason.preview';
import { ToolCallStates } from './tool-call--states.preview';
import { ToolCallPreview, defaultImports, defaultSkeleton } from './tool-call.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Tool Call', api: 'tool-call' },
	meta: metaWith(
		'spartan/ui - Tool Call',
		'A composable card for displaying agent tool executions, parameters, return results, and human-in-the-loop approvals. For inline timeline steps, use Trace.',
	),
	title: 'spartan/ui - Tool Call',
};

@Component({
	selector: 'spartan-tool-call',
	imports: [
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		ToolCallPreview,
		CodePreview,
		PageNav,
		SectionSubSubHeading,
		ToolCallStates,
		ToolCallCodeOutput,
		ToolCallError,
		ToolCallCollapsed,
		ToolCallRejectReason,
		PageBottomNav,
		PageBottomNavLink,
		UIApiDocs,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Tool Call"
				lead="A composable card for displaying agent tool executions, parameters, return results, and human-in-the-loop approvals. For inline timeline steps, use Trace."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-tool-call-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui tool-call"
				ngCode="ng g @spartan-ng/cli:ui tool-call"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_imports" />
				<spartan-code [code]="_codeSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="states" spartanH4>States</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-tool-call-states />
				</div>
				<spartan-code secondTab [code]="_toolCallStatesCode()" />
			</spartan-tabs>

			<h3 id="collapsed" spartanH4>Collapsed</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-tool-call-collapsed />
				</div>
				<spartan-code secondTab [code]="_toolCallCollapsedCode()" />
			</spartan-tabs>

			<h3 id="reject-reason" spartanH4>Reject Reason</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-tool-call-reject-reason />
				</div>
				<spartan-code secondTab [code]="_toolCallRejectReasonCode()" />
			</spartan-tabs>

			<h3 id="code-output" spartanH4>Code Output</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-tool-call-code-output />
				</div>
				<spartan-code secondTab [code]="_codeOutputCode()" />
			</spartan-tabs>

			<h3 id="error" spartanH4>Error</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-tool-call-error />
				</div>
				<spartan-code secondTab [code]="_errorCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="tooltip" label="Tooltip" />
				<spartan-page-bottom-nav-link direction="previous" href="toggle-group" label="Toggle Group" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class ToolCallPage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('tool-call');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _toolCallStatesCode = computed(() => this._snippets()['states']);
	protected readonly _toolCallCollapsedCode = computed(() => this._snippets()['collapsed']);
	protected readonly _toolCallRejectReasonCode = computed(() => this._snippets()['rejectReason']);
	protected readonly _codeOutputCode = computed(() => this._snippets()['codeOutput']);
	protected readonly _errorCode = computed(() => this._snippets()['error']);
	protected readonly _imports = defaultImports;
	protected readonly _codeSkeleton = defaultSkeleton;
}
