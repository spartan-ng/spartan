import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { Code } from '../../../../../shared/code/code';
import { CodePreview } from '../../../../../shared/code/code-preview';
import { MainSection } from '../../../../../shared/layout/main-section';
import { PageBottomNav } from '../../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../../shared/layout/tabs';
import { metaWith } from '../../../../../shared/meta/meta.util';
import {
	ScrollFadeEdgesPreview,
	ScrollFadeNonePreview,
	ScrollFadeOverflowPreview,
	ScrollFadePreview,
	ScrollFadeRtlPreview,
	ScrollFadeSizePreview,
	ScrollFadeXPreview,
	scrollFadeDemoCode,
	scrollFadeEdgesCode,
	scrollFadeNoneCode,
	scrollFadeOverflowCode,
	scrollFadeRtlCode,
	scrollFadeSizeCode,
	scrollFadeXCode,
} from './scroll-fade.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Scroll Fade' },
	meta: metaWith('spartan - Scroll Fade', 'Utilities for adding a fade effect to the edges of a scroll container.'),
	title: 'spartan - Scroll Fade',
};

@Component({
	selector: 'spartan-scroll-fade',
	imports: [
		MainSection,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		Code,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		ScrollFadePreview,
		ScrollFadeOverflowPreview,
		ScrollFadeXPreview,
		ScrollFadeEdgesPreview,
		ScrollFadeSizePreview,
		ScrollFadeNonePreview,
		ScrollFadeRtlPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Scroll Fade"
				lead="Utilities for adding a fade effect to the edges of a scroll container."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!h-auto !min-h-0">
					<spartan-scroll-fade-preview />
				</div>
				<spartan-code secondTab [code]="_demoCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<p class="${hlmP}">
				<code class="${hlmCode}">scroll-fade</code>
				ships with Spartan's Tailwind preset (
				<code class="${hlmCode}">hlm-tailwind-preset.css</code>
				). Projects set up with the Spartan CLI already have it — no extra install step.
			</p>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<p class="${hlmP}">
				Add
				<code class="${hlmCode}">scroll-fade</code>
				or
				<code class="${hlmCode}">scroll-fade-y</code>
				to the scroll container — the element with
				<code class="${hlmCode}">overflow-y-auto</code>
				. Put borders and backgrounds on a wrapper so the fade dissolves content, not the frame.
			</p>
			<div class="mt-4 overflow-x-auto rounded-lg border">
				<table class="w-full text-left text-sm">
					<thead class="bg-muted/50 border-b">
						<tr>
							<th class="px-4 py-2 font-medium">Class</th>
							<th class="px-4 py-2 font-medium">What it does</th>
						</tr>
					</thead>
					<tbody class="divide-y">
						<tr>
							<td class="px-4 py-2">
								<code class="${hlmCode}">scroll-fade</code>
								/
								<code class="${hlmCode}">scroll-fade-y</code>
							</td>
							<td class="text-muted-foreground px-4 py-2">Fade top and bottom edges (vertical scroll)</td>
						</tr>
						<tr>
							<td class="px-4 py-2">
								<code class="${hlmCode}">scroll-fade-x</code>
							</td>
							<td class="text-muted-foreground px-4 py-2">Fade start/end edges (horizontal scroll, RTL-aware)</td>
						</tr>
						<tr>
							<td class="px-4 py-2">
								<code class="${hlmCode}">scroll-fade-t</code>
								/
								<code class="${hlmCode}">scroll-fade-b</code>
							</td>
							<td class="text-muted-foreground px-4 py-2">Fade only the top or bottom edge</td>
						</tr>
						<tr>
							<td class="px-4 py-2">
								<code class="${hlmCode}">scroll-fade-l</code>
								/
								<code class="${hlmCode}">scroll-fade-r</code>
							</td>
							<td class="text-muted-foreground px-4 py-2">Fade only the left or right edge</td>
						</tr>
						<tr>
							<td class="px-4 py-2">
								<code class="${hlmCode}">scroll-fade-s</code>
								/
								<code class="${hlmCode}">scroll-fade-e</code>
							</td>
							<td class="text-muted-foreground px-4 py-2">Logical start/end edges (mirror in RTL)</td>
						</tr>
						<tr>
							<td class="px-4 py-2">
								<code class="${hlmCode}">scroll-fade-*</code>
							</td>
							<td class="text-muted-foreground px-4 py-2">Fixed fade depth on the spacing scale</td>
						</tr>
						<tr>
							<td class="px-4 py-2">
								<code class="${hlmCode}">scroll-fade-none</code>
							</td>
							<td class="text-muted-foreground px-4 py-2">Disable the fade</td>
						</tr>
					</tbody>
				</table>
			</div>
			<p class="${hlmP}">
				The fade is scroll-aware: at rest the start edge is crisp and the end fades; mid-scroll both edges fade; at the
				end the trailing edge sharpens. Pair with
				<code class="${hlmCode}">no-scrollbar</code>
				to hide the scrollbar. Attachment groups use
				<code class="${hlmCode}">scroll-fade-x</code>
				.
			</p>

			<spartan-section-sub-heading id="no-overflow">No Overflow, No Fade</spartan-section-sub-heading>
			<p class="${hlmP}">If the content does not overflow, no fade is shown.</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!h-auto !min-h-0">
					<spartan-scroll-fade-overflow-preview />
				</div>
				<spartan-code secondTab [code]="_overflowCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="horizontal">Horizontal Scrolling</spartan-section-sub-heading>
			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">scroll-fade-x</code>
				on containers with
				<code class="${hlmCode}">overflow-x-auto</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!h-auto !min-h-0">
					<spartan-scroll-fade-x-preview />
				</div>
				<spartan-code secondTab [code]="_xCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="edge-fades">Edge Fades</spartan-section-sub-heading>
			<p class="${hlmP}">
				Use edge utilities when only one edge should track the scroll position. Prefer
				<code class="${hlmCode}">scroll-fade-s</code>
				/
				<code class="${hlmCode}">scroll-fade-e</code>
				for logical inline edges that mirror in RTL.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!h-auto !min-h-0">
					<spartan-scroll-fade-edges-preview />
				</div>
				<spartan-code secondTab [code]="_edgesCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="fade-size">Fade Size</spartan-section-sub-heading>
			<p class="${hlmP}">
				The fade depth defaults to
				<code class="${hlmCode}">12%</code>
				of the container, capped at
				<code class="${hlmCode}">40px</code>
				. Use
				<code class="${hlmCode}">scroll-fade-*</code>
				to set a fixed size on the spacing scale.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!h-auto !min-h-0">
					<spartan-scroll-fade-size-preview />
				</div>
				<spartan-code secondTab [code]="_sizeCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="disabling">Disabling the Fade</spartan-section-sub-heading>
			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">scroll-fade-none</code>
				to remove the fade. It works in any class order, so you can toggle it responsively or by state.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!h-auto !min-h-0">
					<spartan-scroll-fade-none-preview />
				</div>
				<spartan-code secondTab [code]="_noneCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="rtl">RTL</spartan-section-sub-heading>
			<p class="${hlmP}">
				<code class="${hlmCode}">scroll-fade-x</code>
				follows the reading direction. At rest, the start edge is crisp and the end edge fades.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!h-auto !min-h-0">
					<spartan-scroll-fade-rtl-preview />
				</div>
				<spartan-code secondTab [code]="_rtlCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="shimmer" label="Shimmer" />
				<spartan-page-bottom-nav-link direction="previous" href="/components/tooltip" label="Tooltip" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class ScrollFadePage {
	protected readonly _demoCode = scrollFadeDemoCode;
	protected readonly _overflowCode = scrollFadeOverflowCode;
	protected readonly _xCode = scrollFadeXCode;
	protected readonly _edgesCode = scrollFadeEdgesCode;
	protected readonly _sizeCode = scrollFadeSizeCode;
	protected readonly _noneCode = scrollFadeNoneCode;
	protected readonly _rtlCode = scrollFadeRtlCode;
}
