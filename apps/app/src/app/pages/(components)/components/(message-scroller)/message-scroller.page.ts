import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { SectionSubSubHeading } from '../../../../shared/layout/section-sub-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { MessageScrollerAnchoringPreview } from './message-scroller--anchoring.preview';
import { MessageScrollerAnimationPreview } from './message-scroller--animation.preview';
import { MessageScrollerCommandsPreview } from './message-scroller--commands.preview';
import { MessageScrollerGroupChatPreview } from './message-scroller--group-chat.preview';
import { MessageScrollerLoadHistoryPreview } from './message-scroller--load-history.preview';
import { MessageScrollerOpeningPositionPreview } from './message-scroller--opening-position.preview';
import { MessageScrollerPreviousContextPreview } from './message-scroller--previous-context.preview';
import { MessageScrollerScrollablePreview } from './message-scroller--scrollable.preview';
import { MessageScrollerStreamingPreview } from './message-scroller--streaming.preview';
import { MessageScrollerVisibilityPreview } from './message-scroller--visibility.preview';
import { defaultImports, defaultSkeleton, MessageScrollerPreview } from './message-scroller.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Message Scroller', api: 'message-scroller' },
	meta: metaWith(
		'spartan/ui - Message Scroller',
		'A chat transcript scroller that anchors turns, follows streamed replies, and preserves position when history loads.',
	),
	title: 'spartan/ui - Message Scroller',
};

@Component({
	selector: 'spartan-message-scroller',
	imports: [
		UIApiDocs,
		MainSection,
		InstallTabs,
		Code,
		SectionIntro,
		SectionSubHeading,
		SectionSubSubHeading,
		Tabs,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		MessageScrollerPreview,
		MessageScrollerAnchoringPreview,
		MessageScrollerGroupChatPreview,
		MessageScrollerPreviousContextPreview,
		MessageScrollerStreamingPreview,
		MessageScrollerOpeningPositionPreview,
		MessageScrollerLoadHistoryPreview,
		MessageScrollerAnimationPreview,
		MessageScrollerCommandsPreview,
		MessageScrollerVisibilityPreview,
		MessageScrollerScrollablePreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Message Scroller"
				lead="A chat transcript scroller that anchors turns, follows streamed replies, and preserves position when history loads."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-message-scroller-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="message-scroller" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<p class="${hlmP}">
				<code class="${hlmCode}">MessageScroller</code>
				owns scroll behavior only. Compose
				<code class="${hlmCode}">Message</code>
				,
				<code class="${hlmCode}">Bubble</code>
				, and
				<code class="${hlmCode}">Marker</code>
				inside each item. Mark turn boundaries with
				<code class="${hlmCode}">scrollAnchor</code>
				and enable
				<code class="${hlmCode}">autoScroll</code>
				to follow the live edge while the reader stays there.
			</p>

			<spartan-section-sub-heading id="core-concepts">Core Concepts</spartan-section-sub-heading>

			<h3 id="core-concepts__anchoring" spartanH4>Anchoring Turns</h3>
			<p class="${hlmP} mb-2">
				Mark the row that should settle near the top of the viewport with
				<code class="${hlmCode}">scrollAnchor</code>
				. When a new anchor is appended, the viewport moves it near the top and keeps a peek of the previous item above
				it.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-message-scroller-anchoring-preview />
				</div>
				<spartan-code secondTab [code]="_anchoringCode()" />
			</spartan-tabs>

			<h3 id="core-concepts__group-chat" spartanH4>Group Chat</h3>
			<p class="${hlmP} mb-2">
				Anchoring is role-independent. Anchor a marker, handoff event, or any row that starts a meaningful turn — not
				just user messages.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-message-scroller-group-chat-preview />
				</div>
				<spartan-code secondTab [code]="_groupChatCode()" />
			</spartan-tabs>

			<h3 id="core-concepts__previous-context" spartanH4>Keeping Context Visible</h3>
			<p class="${hlmP} mb-2">
				<code class="${hlmCode}">scrollPreviousItemPeek</code>
				keeps a slice of the previous item visible above the anchor so the new turn still feels connected to the thread.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-message-scroller-previous-context-preview />
				</div>
				<spartan-code secondTab [code]="_previousContextCode()" />
			</spartan-tabs>

			<h3 id="core-concepts__streaming" spartanH4>Following the Live Edge</h3>
			<p class="${hlmP} mb-2">
				When the reader is at the live edge,
				<code class="${hlmCode}">autoScroll</code>
				keeps streamed replies in view as they grow. Scrolling away releases the view until the reader returns.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-message-scroller-streaming-preview />
				</div>
				<spartan-code secondTab [code]="_streamingCode()" />
			</spartan-tabs>

			<h3 id="core-concepts__opening-position" spartanH4>Opening Saved Threads</h3>
			<p class="${hlmP} mb-2">
				Use
				<code class="${hlmCode}">defaultScrollPosition</code>
				to control where a saved transcript opens —
				<code class="${hlmCode}">"last-anchor"</code>
				shows the last meaningful turn instead of the absolute bottom.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-message-scroller-opening-position-preview />
				</div>
				<spartan-code secondTab [code]="_openingPositionCode()" />
			</spartan-tabs>

			<h3 id="core-concepts__load-history" spartanH4>Loading Earlier Messages</h3>
			<p class="${hlmP} mb-2">
				When older rows are prepended above the current transcript, the viewport preserves the visible row so the reader
				stays in the same place while history loads above them.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-message-scroller-load-history-preview />
				</div>
				<spartan-code secondTab [code]="_loadHistoryCode()" />
			</spartan-tabs>

			<h3 id="core-concepts__animation" spartanH4>Animating New Messages</h3>
			<p class="${hlmP} mb-2">
				Animate user rows with transform and opacity while assistant replies stream into regular rows below. Avoid
				animating height, margin, or padding — those fight the scroller's positioning work.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-message-scroller-animation-preview />
				</div>
				<spartan-code secondTab [code]="_animationCode()" />
			</spartan-tabs>

			<h3 id="core-concepts__commands" spartanH4>Jumping to Messages</h3>
			<p class="${hlmP} mb-2">
				Use
				<code class="${hlmCode}">injectBrnMessageScroller()</code>
				for search results, permalinks, outline items, and toolbar buttons that drive the transcript from outside the
				message list.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-message-scroller-commands-preview />
				</div>
				<spartan-code secondTab [code]="_commandsCode()" />
			</spartan-tabs>

			<h3 id="core-concepts__visibility" spartanH4>Tracking the Reader's Position</h3>
			<p class="${hlmP} mb-2">
				Call
				<code class="${hlmCode}">observeVisibility()</code>
				and read the
				<code class="${hlmCode}">visibility</code>
				signal to highlight the current anchored turn or build a table of contents.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-message-scroller-visibility-preview />
				</div>
				<spartan-code secondTab [code]="_visibilityCode()" />
			</spartan-tabs>

			<h3 id="core-concepts__scrollable" spartanH4>Reading Scroll State</h3>
			<p class="${hlmP} mb-2">
				The
				<code class="${hlmCode}">scrollable</code>
				signal reports which edges the viewport can still scroll toward. For styling the scroller itself, prefer the
				<code class="${hlmCode}">data-scrollable</code>
				attribute.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-message-scroller-scrollable-preview />
				</div>
				<spartan-code secondTab [code]="_scrollableCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="native-select" label="Native Select" />
				<spartan-page-bottom-nav-link direction="previous" href="message" label="Message" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class MessageScrollerPage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('message-scroller');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _anchoringCode = computed(() => this._snippets()['anchoring']);
	protected readonly _groupChatCode = computed(() => this._snippets()['groupChat']);
	protected readonly _previousContextCode = computed(() => this._snippets()['previousContext']);
	protected readonly _streamingCode = computed(() => this._snippets()['streaming']);
	protected readonly _openingPositionCode = computed(() => this._snippets()['openingPosition']);
	protected readonly _loadHistoryCode = computed(() => this._snippets()['loadHistory']);
	protected readonly _animationCode = computed(() => this._snippets()['animation']);
	protected readonly _commandsCode = computed(() => this._snippets()['commands']);
	protected readonly _visibilityCode = computed(() => this._snippets()['visibility']);
	protected readonly _scrollableCode = computed(() => this._snippets()['scrollable']);
	protected readonly _defaultImports = defaultImports;
	protected readonly _defaultSkeleton = defaultSkeleton;
}
