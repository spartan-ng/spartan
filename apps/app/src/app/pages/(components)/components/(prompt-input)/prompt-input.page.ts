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
import { PromptInputAttachments } from './prompt-input--attachments.preview';
import { PromptInputDisabled } from './prompt-input--disabled.preview';
import { PromptInputRows } from './prompt-input--rows.preview';
import { PromptInputStreaming } from './prompt-input--streaming.preview';
import { PromptInputSubmitOnEnter } from './prompt-input--submit-on-enter.preview';
import { PromptInputPreview, defaultImports, defaultSkeleton } from './prompt-input.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Prompt Input', api: 'prompt-input' },
	meta: metaWith(
		'spartan/ui - Prompt Input',
		'A composable prompt input container with auto-resizing textarea and action triggers for AI chat interfaces.',
	),
	title: 'spartan/ui - Prompt Input',
};

@Component({
	selector: 'spartan-prompt-input',
	imports: [
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		PromptInputPreview,
		CodePreview,
		PageNav,
		SectionSubSubHeading,
		PromptInputStreaming,
		PromptInputRows,
		PromptInputSubmitOnEnter,
		PromptInputAttachments,
		PromptInputDisabled,
		PageBottomNav,
		PageBottomNavLink,
		UIApiDocs,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Prompt Input"
				lead="A composable prompt input container with auto-resizing textarea and action triggers for AI chat interfaces."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-prompt-input-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui prompt-input"
				ngCode="ng g @spartan-ng/cli:ui prompt-input"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_imports" />
				<spartan-code [code]="_codeSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="streaming" spartanH4>Streaming</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-prompt-input-streaming />
				</div>
				<spartan-code secondTab [code]="_promptInputStreamingCode()" />
			</spartan-tabs>

			<h3 id="rows" spartanH4>Rows</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-prompt-input-rows />
				</div>
				<spartan-code secondTab [code]="_promptInputRowsCode()" />
			</spartan-tabs>

			<h3 id="submit-on-enter" spartanH4>Submit on Enter</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-prompt-input-submit-on-enter />
				</div>
				<spartan-code secondTab [code]="_promptInputSubmitOnEnterCode()" />
			</spartan-tabs>

			<h3 id="attachments" spartanH4>Attachments</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-prompt-input-attachments />
				</div>
				<spartan-code secondTab [code]="_promptInputAttachmentsCode()" />
			</spartan-tabs>

			<h3 id="disabled" spartanH4>Disabled</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-prompt-input-disabled />
				</div>
				<spartan-code secondTab [code]="_promptInputDisabledCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="questionnaire" label="Questionnaire" />
				<spartan-page-bottom-nav-link direction="previous" href="progress" label="Progress" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class PromptInputPage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('prompt-input');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _promptInputStreamingCode = computed(() => this._snippets()['streaming']);
	protected readonly _promptInputRowsCode = computed(() => this._snippets()['rows']);
	protected readonly _promptInputSubmitOnEnterCode = computed(() => this._snippets()['submitOnEnter']);
	protected readonly _promptInputAttachmentsCode = computed(() => this._snippets()['attachments']);
	protected readonly _promptInputDisabledCode = computed(() => this._snippets()['disabled']);
	protected readonly _imports = defaultImports;
	protected readonly _codeSkeleton = defaultSkeleton;
}
