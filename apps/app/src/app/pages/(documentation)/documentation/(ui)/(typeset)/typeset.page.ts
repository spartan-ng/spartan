import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Code } from '@spartan-ng/app/app/shared/code/code';
import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { PageBottomNav } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav';
import { SectionIntro } from '@spartan-ng/app/app/shared/layout/section-intro';
import { SectionSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-heading';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { HlmButton } from '@spartan-ng/helm/button';
import { hlmCode, hlmP, hlmUl } from '@spartan-ng/helm/typography';
import TypesetDocsPreview from './typeset.preview';
import {
	accessibilityCss,
	customThemesCss,
	defaultsCss,
	importCss,
	inlineOverrideCode,
	optingOutCode,
	overrideCode,
	presetCss,
	responsiveTableCode,
	streamingCss,
	twoPresetsCss,
	usageCode,
} from './typeset.snippets';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Typeset' },
	meta: metaWith(
		'spartan - Typeset',
		'A styling system for HTML and rendered markdown, from blog posts to streaming chat. One CSS file you own.',
	),
	title: 'spartan - Typeset',
};

@Component({
	selector: 'spartan-typeset-page',
	imports: [
		MainSection,
		SectionIntro,
		SectionSubHeading,
		Code,
		TypesetDocsPreview,
		HlmButton,
		RouterLink,
		PageBottomNav,
		PageBottomNavLink,
		PageNav,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Typeset"
				lead="A styling system for HTML and rendered markdown, from blog posts to streaming chat. One CSS file you own."
			/>

			<p class="${hlmP}">
				You render markdown and get back plain unstyled HTML: headings, paragraphs, lists, and tables. So you style the
				elements one by one: font sizes, line heights, spacing.
			</p>
			<p class="${hlmP}">
				You do it for your blog. Then you do it again for the docs. Then again for the chat app. Every time you're
				fighting the same thing: sizing and spacing.
			</p>
			<p class="${hlmP}">
				<strong>spartan/typeset</strong>
				is one CSS file that styles everything inside a
				<code class="${hlmCode}">typeset</code>
				container. The file lives in your project, so you can change it directly when you need to.
			</p>
			<p class="${hlmP}">
				A typeset is just a small preset class. You can have multiple typesets in your app, for different contexts.
			</p>

			<div class="my-6">
				<spartan-code language="css" [code]="_presetCss" />
			</div>

			<a hlmBtn size="sm" class="mt-2 w-fit" routerLink="/typeset">Build your typeset</a>

			<spartan-section-sub-heading id="demo">Demo</spartan-section-sub-heading>
			<p class="${hlmP}">
				Everything below is plain HTML inside a single
				<code class="${hlmCode}">typeset</code>
				container. No classes on the elements themselves.
			</p>
			<div class="border-border my-6 rounded-lg border p-6">
				<spartan-typeset-docs-preview />
			</div>

			<spartan-section-sub-heading id="principles">Principles</spartan-section-sub-heading>
			<p class="${hlmP}">
				We read a lot about type: scale ratios, tracking, kerning, optical sizing, measure, leading, the space above and
				below every element. We tried exposing all of it, and it was too much. Nobody wants to set a dozen variables to
				make markdown look right.
			</p>
			<p class="${hlmP}">
				So we sat down and condensed everything into three controls: size, leading, and flow. Everything else, heading
				sizes, list indents, the gap under a heading, the space around a rule, derives from them. Three controls. We
				called it rhythm.
			</p>

			<spartan-section-sub-heading id="features">Features</spartan-section-sub-heading>
			<ul class="${hlmUl}">
				<li>
					<strong>It fits its container.</strong>
					Put it in a chat bubble and it follows the smaller type around it. Put it in an article and it scales up with
					the page. On smaller screens, it gets a small bump for readability.
				</li>
				<li>
					<strong>It uses your theme.</strong>
					Colors, fonts, and radius come from your app. Dark mode follows the same tokens.
				</li>
				<li>
					<strong>It's easy to tune.</strong>
					Three values control the base size, line height, and space between blocks. Change them in a preset and the
					whole document follows.
				</li>
				<li>
					<strong>It works well with streaming.</strong>
					When a new block arrives, Typeset doesn't make earlier blocks switch margins, borders, or styles.
				</li>
			</ul>

			<spartan-section-sub-heading id="building-your-typeset">Building your typeset</spartan-section-sub-heading>
			<p class="${hlmP}">
				Create your typeset in the
				<a class="font-medium underline" routerLink="/typeset">typeset builder</a>
				. Pick your fonts and rhythm, then preview them on docs, chat, articles, and other real content.
			</p>
			<p class="${hlmP}">
				The panel gives you the
				<code class="${hlmCode}">typeset.css</code>
				file, the font setup for your project, a preset class with your choices, and the wrapper to add around your
				content.
			</p>
			<p class="${hlmP}">
				Copy
				<code class="${hlmCode}">typeset.css</code>
				next to your main CSS file and import it after Tailwind:
			</p>
			<div class="my-4">
				<spartan-code language="css" [code]="_importCss" />
			</div>
			<p class="${hlmP}">
				Then wrap your rendered markdown with
				<code class="${hlmCode}">typeset</code>
				and your preset class:
			</p>
			<div class="my-4">
				<spartan-code language="ts" [code]="_usageCode" />
			</div>
			<p class="${hlmP}">
				<code class="${hlmCode}">typeset</code>
				turns the styles on.
				<code class="${hlmCode}">typeset-docs</code>
				is the preset you created in the builder.
			</p>

			<spartan-section-sub-heading id="custom-typesets">Custom typesets</spartan-section-sub-heading>
			<p class="${hlmP}">
				The file includes defaults, so you can use
				<code class="${hlmCode}">typeset</code>
				by itself. Most of the reading rhythm comes from three values:
			</p>
			<div class="my-4">
				<spartan-code language="css" [code]="_defaultsCss" />
			</div>
			<ul class="${hlmUl}">
				<li>
					<strong><code class="${hlmCode}">--typeset-size</code></strong>
					sets the base text size.
					<code class="${hlmCode}">1em</code>
					follows the surrounding layout. On smaller screens, Typeset bumps it up a little.
				</li>
				<li>
					<strong><code class="${hlmCode}">--typeset-leading</code></strong>
					sets the space between lines.
				</li>
				<li>
					<strong><code class="${hlmCode}">--typeset-flow</code></strong>
					sets the space between blocks. Headings and other elements derive their spacing from it.
				</li>
			</ul>
			<p class="${hlmP}">
				The font variables tell Typeset which families to use. Leave them alone and it follows your app. Colors and
				radius come from your theme too.
			</p>
			<p class="${hlmP}">
				Typeset doesn't set a maximum width. Your layout owns that. The Measure control in the builder adds a
				<code class="${hlmCode}">max-width</code>
				to the wrapper instead of hiding it in the stylesheet.
			</p>
			<p class="${hlmP}">
				You can keep more than one preset in the same app. Here is a tighter one for chat and a roomier one for docs:
			</p>
			<div class="my-4">
				<spartan-code language="css" [code]="_twoPresetsCss" />
			</div>
			<div class="my-4">
				<spartan-code language="ts" [code]="_inlineOverrideCode" />
			</div>

			<spartan-section-sub-heading id="custom-themes">Custom themes</spartan-section-sub-heading>
			<p class="${hlmP}">
				A preset can change the whole feel of the content, not just the spacing. You can give readers a serif reading
				mode, a compact UI mode, or any other style that fits your product.
			</p>
			<div class="my-4">
				<spartan-code language="css" [code]="_customThemesCss" />
			</div>

			<spartan-section-sub-heading id="accessibility-and-dark-mode">
				Accessibility and dark mode
			</spartan-section-sub-heading>
			<p class="${hlmP}">
				For readers who prefer larger type and more space, create a roomier typeset and expose it as a setting:
			</p>
			<div class="my-4">
				<spartan-code language="css" [code]="_accessibilityCss" />
			</div>

			<spartan-section-sub-heading id="responsive-table">Responsive table</spartan-section-sub-heading>
			<p class="${hlmP}">
				Tables stay real tables and wrap to fit. To scroll a wide one horizontally instead, wrap it in
				<code class="${hlmCode}">typeset-scroll</code>
				:
			</p>
			<div class="my-4">
				<spartan-code language="ts" [code]="_responsiveTableCode" />
			</div>
			<p class="${hlmP}">
				Do this in your renderer's table component or a small rehype plugin. It works for any wide block, not just
				tables.
			</p>

			<spartan-section-sub-heading id="overrides">Overrides</spartan-section-sub-heading>
			<p class="${hlmP}">
				Typeset lives in the
				<code class="${hlmCode}">components</code>
				layer and uses
				<code class="${hlmCode}">:where()</code>
				for its element selectors. Tailwind utilities on an element win without
				<code class="${hlmCode}">!important</code>
				:
			</p>
			<div class="my-4">
				<spartan-code language="ts" [code]="_overrideCode" />
			</div>
			<p class="${hlmP}">Plain CSS can override Typeset with a normal selector too.</p>

			<spartan-section-sub-heading id="opting-out">Opting out</spartan-section-sub-heading>
			<p class="${hlmP}">
				To keep a component out of Typeset, add
				<code class="${hlmCode}">not-typeset</code>
				or
				<code class="${hlmCode}">data-not-typeset</code>
				:
			</p>
			<div class="my-4">
				<spartan-code language="ts" [code]="_optingOutCode" />
			</div>
			<p class="${hlmP}">
				Both options cover the component and everything inside it. Another
				<code class="${hlmCode}">typeset</code>
				container inside that subtree stays opted out too.
			</p>

			<spartan-section-sub-heading id="streaming">Streaming</spartan-section-sub-heading>
			<p class="${hlmP}">
				Typeset is written so that adding a new block does not change the styles of the blocks already on screen.
			</p>
			<ul class="${hlmUl}">
				<li>
					No forward-looking selectors.
					<code class="${hlmCode}">:last-child</code>
					,
					<code class="${hlmCode}">:has()</code>
					, and
					<code class="${hlmCode}">:empty</code>
					are left out of layout rules because their matches can change as content is added.
				</li>
				<li>
					Spacing flows in one direction, using
					<code class="${hlmCode}">margin-block-start</code>
					only. A new block adds its own space.
				</li>
				<li>Table separators live on the cells being added, so a new row does not restyle the row above it.</li>
			</ul>
			<p class="${hlmP}">
				Text that is still streaming can grow and wrap normally. Typeset just avoids restyling the blocks that came
				before it.
			</p>
			<div class="my-4">
				<spartan-code language="css" [code]="_streamingCss" />
			</div>

			<spartan-section-sub-heading id="prior-art">Prior art</spartan-section-sub-heading>
			<p class="${hlmP}">
				The
				<code class="${hlmCode}">prose</code>
				class from
				<code class="${hlmCode}">&#64;tailwindcss/typography</code>
				is excellent at what it was built for: adding beautiful typographic defaults to plain HTML, including content
				rendered from Markdown or a CMS.
			</p>
			<p class="${hlmP}">
				Typeset takes a different approach with container-aware sizing, app theme tokens, presets for different
				contexts, and streaming stability. Here's where they differ:
			</p>
			<div class="my-6 overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-border border-b text-left">
							<th class="py-2 pe-4 font-medium"></th>
							<th class="py-2 pe-4 font-medium">&#64;tailwindcss/typography</th>
							<th class="py-2 font-medium">Typeset</th>
						</tr>
					</thead>
					<tbody class="text-muted-foreground">
						<tr class="border-border border-b">
							<td class="text-foreground py-2 pe-4 font-medium">Sizing</td>
							<td class="py-2 pe-4">
								Fixed
								<code class="font-mono text-xs">rem</code>
								scale,
								<code class="font-mono text-xs">prose-sm</code>
								to
								<code class="font-mono text-xs">prose-2xl</code>
							</td>
							<td class="py-2">Relative to the container, any size</td>
						</tr>
						<tr class="border-border border-b">
							<td class="text-foreground py-2 pe-4 font-medium">Dark mode</td>
							<td class="py-2 pe-4">
								<code class="font-mono text-xs">prose-invert</code>
								, a second palette
							</td>
							<td class="py-2">Your tokens flip, nothing to add</td>
						</tr>
						<tr class="border-border border-b">
							<td class="text-foreground py-2 pe-4 font-medium">Theming</td>
							<td class="py-2 pe-4">Prose color variables; scale baked in</td>
							<td class="py-2">Your theme tokens, plus font and rhythm controls</td>
						</tr>
						<tr class="border-border border-b">
							<td class="text-foreground py-2 pe-4 font-medium">Overrides</td>
							<td class="py-2 pe-4">
								<code class="font-mono text-xs">prose-a:</code>
								,
								<code class="font-mono text-xs">prose-headings:</code>
								modifier API
							</td>
							<td class="py-2">Plain utilities and CSS win</td>
						</tr>
						<tr class="border-border border-b">
							<td class="text-foreground py-2 pe-4 font-medium">Streaming</td>
							<td class="py-2 pe-4">No append-stability contract</td>
							<td class="py-2">Designed for stable appends</td>
						</tr>
						<tr>
							<td class="text-foreground py-2 pe-4 font-medium">Distribution</td>
							<td class="py-2 pe-4">npm plugin, generated CSS</td>
							<td class="py-2">One CSS file you own</td>
						</tr>
					</tbody>
				</table>
			</div>
			<p class="${hlmP}">
				Typeset borrows the two best ideas from the plugin: the zero-specificity
				<code class="${hlmCode}">:where()</code>
				guard pattern, and the escape-hatch class (
				<code class="${hlmCode}">not-typeset</code>
				, in the spirit of
				<code class="${hlmCode}">not-prose</code>
				).
			</p>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="figma" label="Figma" />
				<spartan-page-bottom-nav-link direction="previous" href="typography" label="Typography" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class TypesetPage {
	protected readonly _presetCss = presetCss;
	protected readonly _importCss = importCss;
	protected readonly _usageCode = usageCode;
	protected readonly _defaultsCss = defaultsCss;
	protected readonly _twoPresetsCss = twoPresetsCss;
	protected readonly _inlineOverrideCode = inlineOverrideCode;
	protected readonly _customThemesCss = customThemesCss;
	protected readonly _accessibilityCss = accessibilityCss;
	protected readonly _responsiveTableCode = responsiveTableCode;
	protected readonly _overrideCode = overrideCode;
	protected readonly _optingOutCode = optingOutCode;
	protected readonly _streamingCss = streamingCss;
}
