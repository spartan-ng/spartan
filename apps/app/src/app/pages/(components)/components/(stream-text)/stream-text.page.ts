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
import { StreamTextAutoBalance } from './stream-text--auto-balance.preview';
import { StreamTextMarkdown } from './stream-text--markdown.preview';
import { StreamTextSmooth } from './stream-text--smooth.preview';
import { StreamTextStatic } from './stream-text--static.preview';
import { StreamTextPreview, defaultImports, defaultSkeleton } from './stream-text.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Stream Text', api: 'stream-text' },
	meta: metaWith(
		'spartan/ui - Stream Text',
		'A stream-safe text component with token balancing and animated streaming cursor for LLM and agent responses.',
	),
	title: 'spartan/ui - Stream Text',
};

@Component({
	selector: 'spartan-stream-text',
	imports: [
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		StreamTextPreview,
		CodePreview,
		PageNav,
		SectionSubSubHeading,
		StreamTextAutoBalance,
		StreamTextStatic,
		StreamTextMarkdown,
		StreamTextSmooth,
		PageBottomNav,
		PageBottomNavLink,
		UIApiDocs,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Stream Text"
				lead="A stream-safe text component with token balancing and animated streaming cursor for LLM and agent responses."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-stream-text-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui stream-text"
				ngCode="ng g @spartan-ng/cli:ui stream-text"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_imports" />
				<spartan-code [code]="_codeSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="auto-balance" spartanH4>Auto Balance</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-stream-text-auto-balance />
				</div>
				<spartan-code secondTab [code]="_streamTextAutoBalanceCode()" />
			</spartan-tabs>

			<h3 id="static" spartanH4>Static</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-stream-text-static />
				</div>
				<spartan-code secondTab [code]="_streamTextStaticCode()" />
			</spartan-tabs>

			<h3 id="markdown" spartanH4>Markdown</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-stream-text-markdown />
				</div>
				<spartan-code secondTab [code]="_markdownCode()" />
			</spartan-tabs>

			<h3 id="smooth" spartanH4>Smooth</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-stream-text-smooth />
				</div>
				<spartan-code secondTab [code]="_smoothCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="switch" label="Switch" />
				<spartan-page-bottom-nav-link direction="previous" href="spinner" label="Spinner" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class StreamTextPage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('stream-text');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _streamTextAutoBalanceCode = computed(() => this._snippets()['autoBalance']);
	protected readonly _streamTextStaticCode = computed(() => this._snippets()['static']);
	protected readonly _markdownCode = computed(() => this._snippets()['markdown']);
	protected readonly _smoothCode = computed(() => this._snippets()['smooth']);
	protected readonly _imports = defaultImports;
	protected readonly _codeSkeleton = defaultSkeleton;
}
