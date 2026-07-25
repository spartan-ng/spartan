import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
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
import { BubbleAlignmentPreview } from './bubble--alignment.preview';
import { BubbleCollapsiblePreview } from './bubble--collapsible.preview';
import { BubbleGroupPreview } from './bubble--group.preview';
import { BubbleLinkButtonPreview } from './bubble--link-button.preview';
import { BubblePopoverPreview } from './bubble--popover.preview';
import { BubbleReactionsPreview } from './bubble--reactions.preview';
import { BubbleTooltipPreview } from './bubble--tooltip.preview';
import { BubbleVariantsPreview } from './bubble--variants.preview';
import { BubblePreview, defaultImports, defaultSkeleton } from './bubble.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Bubble', api: 'bubble' },
	meta: metaWith(
		'spartan/ui - Bubble',
		'Displays conversational content in a message bubble. Supports variants, alignment, grouping, reactions, and collapsible content.',
	),
	title: 'spartan/ui - Bubble',
};

@Component({
	selector: 'spartan-bubble',
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
		BubblePreview,
		BubbleVariantsPreview,
		BubbleAlignmentPreview,
		BubbleGroupPreview,
		BubbleLinkButtonPreview,
		BubbleReactionsPreview,
		BubbleCollapsiblePreview,
		BubbleTooltipPreview,
		BubblePopoverPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Bubble"
				lead="Displays conversational content in a message bubble. Supports variants, alignment, grouping, reactions, and collapsible content."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-bubble-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="bubble" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<p class="${hlmP}">
				Compose
				<code class="${hlmCode}">Bubble</code>
				inside
				<code class="${hlmCode}">Message</code>
				for conversation rows. Place avatars, names, timestamps, and message-level actions on
				<code class="${hlmCode}">Message</code>
				.
			</p>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__variants" spartanH4>Variants</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-bubble-variants-preview />
				</div>
				<spartan-code secondTab [code]="_variantsCode()" />
			</spartan-tabs>

			<h3 id="examples__alignment" spartanH4>Alignment</h3>
			<p class="${hlmP} mb-2">
				Use
				<code class="${hlmCode}">align</code>
				on
				<code class="${hlmCode}">hlmBubble</code>
				to align the bubble. For chat UIs, prefer alignment on
				<code class="${hlmCode}">Message</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-bubble-alignment-preview />
				</div>
				<spartan-code secondTab [code]="_alignmentCode()" />
			</spartan-tabs>

			<h3 id="examples__group" spartanH4>Bubble Group</h3>
			<p class="${hlmP} mb-2">
				Use
				<code class="${hlmCode}">hlmBubbleGroup</code>
				to group consecutive bubbles from the same sender. Set
				<code class="${hlmCode}">align</code>
				on each
				<code class="${hlmCode}">hlmBubble</code>
				, not the group.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-bubble-group-preview />
				</div>
				<spartan-code secondTab [code]="_groupCode()" />
			</spartan-tabs>

			<h3 id="examples__links_and_buttons" spartanH4>Links and Buttons</h3>
			<p class="${hlmP} mb-2">
				Put
				<code class="${hlmCode}">hlmBubbleContent</code>
				on a
				<code class="${hlmCode}">button</code>
				or
				<code class="${hlmCode}">a</code>
				to make the bubble interactive.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-bubble-link-button-preview />
				</div>
				<spartan-code secondTab [code]="_linkButtonCode()" />
			</spartan-tabs>

			<h3 id="examples__reactions" spartanH4>Reactions</h3>
			<p class="${hlmP} mb-2">
				Use
				<code class="${hlmCode}">hlmBubbleReactions</code>
				for emoji reactions or quick actions. Reactions overlap the bubble edge, so leave vertical space between rows.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-bubble-reactions-preview />
				</div>
				<spartan-code secondTab [code]="_reactionsCode()" />
			</spartan-tabs>

			<h3 id="examples__collapsible" spartanH4>Show More / Collapsible</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-bubble-collapsible-preview />
				</div>
				<spartan-code secondTab [code]="_collapsibleCode()" />
			</spartan-tabs>

			<h3 id="examples__tooltip" spartanH4>Tooltip</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-bubble-tooltip-preview />
				</div>
				<spartan-code secondTab [code]="_tooltipCode()" />
			</spartan-tabs>

			<h3 id="examples__popover" spartanH4>Popover</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-bubble-popover-preview />
				</div>
				<spartan-code secondTab [code]="_popoverCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="button" label="Button" />
				<spartan-page-bottom-nav-link direction="previous" href="breadcrumb" label="Breadcrumb" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class BubblePage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('bubble');
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _variantsCode = computed(() => this._snippets()['variants']);
	protected readonly _alignmentCode = computed(() => this._snippets()['alignment']);
	protected readonly _groupCode = computed(() => this._snippets()['group']);
	protected readonly _linkButtonCode = computed(() => this._snippets()['linkButton']);
	protected readonly _reactionsCode = computed(() => this._snippets()['reactions']);
	protected readonly _collapsibleCode = computed(() => this._snippets()['collapsible']);
	protected readonly _tooltipCode = computed(() => this._snippets()['tooltip']);
	protected readonly _popoverCode = computed(() => this._snippets()['popover']);
}
