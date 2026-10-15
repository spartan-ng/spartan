import type { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
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
import { CodeBlockActions } from './code-block--actions.preview';
import { CodeBlockBasic } from './code-block--basic.preview';
import { CodeBlockDestructive } from './code-block--destructive.preview';
import { CodeBlockDiff } from './code-block--diff.preview';
import { CodeBlockFloatingActions } from './code-block--floating-actions.preview';
import { CodeBlockHeader } from './code-block--header.preview';
import { CodeBlockHeight } from './code-block--height.preview';
import { CodeBlockHighlightedLines } from './code-block--highlighted-lines.preview';
import { CodeBlockLineNumbers } from './code-block--line-numbers.preview';
import { CodeBlockSize } from './code-block--size.preview';
import { CodeBlockStartLine } from './code-block--start-line.preview';
import { CodeBlockWrap } from './code-block--wrap.preview';
import { CodeBlockPreview, defaultImports, defaultSkeleton } from './code-block.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'code-block', api: 'code-block' },
	meta: metaWith(
		'spartan/ui - Code Block',
		'Displays code, terminal output and diffs with an optional header, line numbers and a copy button.',
	),
	title: 'spartan/ui - Code Block',
};

@Component({
	selector: 'spartan-code-block',
	imports: [
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		CodeBlockPreview,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		SectionSubSubHeading,
		UIApiDocs,
		CodeBlockBasic,
		CodeBlockHeader,
		CodeBlockActions,
		CodeBlockFloatingActions,
		CodeBlockLineNumbers,
		CodeBlockStartLine,
		CodeBlockWrap,
		CodeBlockHighlightedLines,
		CodeBlockDiff,
		CodeBlockHeight,
		CodeBlockSize,
		CodeBlockDestructive,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Code Block"
				lead="Displays code, terminal output and diffs with an optional header, line numbers and a copy button."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-code-block-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui code-block"
				ngCode="ng g @spartan-ng/cli:ui code-block"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_imports" />
				<spartan-code [code]="_codeSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="basic" spartanH4>Basic</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-code-block-basic />
				</div>
				<spartan-code secondTab [code]="_basicCode()" />
			</spartan-tabs>

			<h3 id="header" spartanH4>Header</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-code-block-header />
				</div>
				<spartan-code secondTab [code]="_headerCode()" />
			</spartan-tabs>

			<h3 id="actions" spartanH4>Actions</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-code-block-actions />
				</div>
				<spartan-code secondTab [code]="_actionsCode()" />
			</spartan-tabs>

			<h3 id="floating-actions" spartanH4>Floating Actions</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-code-block-floating-actions />
				</div>
				<spartan-code secondTab [code]="_floatingActionsCode()" />
			</spartan-tabs>

			<h3 id="line-numbers" spartanH4>Line Numbers</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-code-block-line-numbers />
				</div>
				<spartan-code secondTab [code]="_lineNumbersCode()" />
			</spartan-tabs>

			<h3 id="start-line" spartanH4>Start Line</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-code-block-start-line />
				</div>
				<spartan-code secondTab [code]="_startLineCode()" />
			</spartan-tabs>

			<h3 id="wrap" spartanH4>Wrap</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-code-block-wrap />
				</div>
				<spartan-code secondTab [code]="_wrapCode()" />
			</spartan-tabs>

			<h3 id="highlighted-lines" spartanH4>Highlighted Lines</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-code-block-highlighted-lines />
				</div>
				<spartan-code secondTab [code]="_highlightedLinesCode()" />
			</spartan-tabs>

			<h3 id="diff" spartanH4>Diff</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-code-block-diff />
				</div>
				<spartan-code secondTab [code]="_diffCode()" />
			</spartan-tabs>

			<h3 id="height" spartanH4>Height</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-code-block-height />
				</div>
				<spartan-code secondTab [code]="_heightCode()" />
			</spartan-tabs>

			<h3 id="size" spartanH4>Size</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-code-block-size />
				</div>
				<spartan-code secondTab [code]="_sizeCode()" />
			</spartan-tabs>

			<h3 id="destructive" spartanH4>Destructive</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-code-block-destructive />
				</div>
				<spartan-code secondTab [code]="_destructiveCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="collapsible" label="Collapsible" />
				<spartan-page-bottom-nav-link direction="previous" href="checkbox" label="Checkbox" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class CodeBlockPage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('code-block');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _basicCode = computed(() => this._snippets()['basic']);
	protected readonly _headerCode = computed(() => this._snippets()['header']);
	protected readonly _actionsCode = computed(() => this._snippets()['actions']);
	protected readonly _floatingActionsCode = computed(() => this._snippets()['floatingActions']);
	protected readonly _lineNumbersCode = computed(() => this._snippets()['lineNumbers']);
	protected readonly _startLineCode = computed(() => this._snippets()['startLine']);
	protected readonly _wrapCode = computed(() => this._snippets()['wrap']);
	protected readonly _highlightedLinesCode = computed(() => this._snippets()['highlightedLines']);
	protected readonly _diffCode = computed(() => this._snippets()['diff']);
	protected readonly _heightCode = computed(() => this._snippets()['height']);
	protected readonly _sizeCode = computed(() => this._snippets()['size']);
	protected readonly _destructiveCode = computed(() => this._snippets()['destructive']);
	protected readonly _imports = defaultImports;
	protected readonly _codeSkeleton = defaultSkeleton;
}
