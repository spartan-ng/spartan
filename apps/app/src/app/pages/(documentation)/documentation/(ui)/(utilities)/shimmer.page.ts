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
	ShimmerAnglePreview,
	ShimmerColorPreview,
	ShimmerDurationPreview,
	ShimmerMarkerPreview,
	ShimmerNonePreview,
	ShimmerOncePreview,
	ShimmerPreview,
	ShimmerRtlPreview,
	ShimmerSpreadPreview,
	shimmerAngleCode,
	shimmerColorCode,
	shimmerDemoCode,
	shimmerDurationCode,
	shimmerMarkerCode,
	shimmerNoneCode,
	shimmerOnceCode,
	shimmerRtlCode,
	shimmerSpreadCode,
} from './shimmer.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Shimmer' },
	meta: metaWith('spartan - Shimmer', 'Utilities for adding a shimmer effect to text elements.'),
	title: 'spartan - Shimmer',
};

@Component({
	selector: 'spartan-shimmer',
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
		ShimmerPreview,
		ShimmerMarkerPreview,
		ShimmerColorPreview,
		ShimmerDurationPreview,
		ShimmerSpreadPreview,
		ShimmerAnglePreview,
		ShimmerOncePreview,
		ShimmerNonePreview,
		ShimmerRtlPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Shimmer" lead="Utilities for adding a shimmer effect to text elements." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="h-auto! min-h-0!">
					<spartan-shimmer-preview />
				</div>
				<spartan-code secondTab [code]="_demoCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<p class="${hlmP}">
				<code class="${hlmCode}">shimmer</code>
				ships with Spartan's Tailwind preset (
				<code class="${hlmCode}">hlm-tailwind-preset.css</code>
				). Projects set up with the Spartan CLI already have it — no extra install step.
			</p>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<p class="${hlmP}">
				Add
				<code class="${hlmCode}">shimmer</code>
				to a text element. The effect is built on
				<code class="${hlmCode}">currentColor</code>
				, so it adapts to muted text, brand colors, and dark mode automatically. It is disabled when
				<code class="${hlmCode}">prefers-reduced-motion: reduce</code>
				is set, so you do not need your own motion guard.
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
								<code class="${hlmCode}">shimmer</code>
							</td>
							<td class="text-muted-foreground px-4 py-2">Sweeping text highlight loop</td>
						</tr>
						<tr>
							<td class="px-4 py-2">
								<code class="${hlmCode}">shimmer-once</code>
							</td>
							<td class="text-muted-foreground px-4 py-2">Play a single sweep</td>
						</tr>
						<tr>
							<td class="px-4 py-2">
								<code class="${hlmCode}">shimmer-reverse</code>
							</td>
							<td class="text-muted-foreground px-4 py-2">Sweep in the opposite direction</td>
						</tr>
						<tr>
							<td class="px-4 py-2">
								<code class="${hlmCode}">shimmer-none</code>
							</td>
							<td class="text-muted-foreground px-4 py-2">Disable the effect</td>
						</tr>
						<tr>
							<td class="px-4 py-2">
								<code class="${hlmCode}">shimmer-color-*</code>
							</td>
							<td class="text-muted-foreground px-4 py-2">Explicit highlight color</td>
						</tr>
						<tr>
							<td class="px-4 py-2">
								<code class="${hlmCode}">shimmer-duration-*</code>
							</td>
							<td class="text-muted-foreground px-4 py-2">Sweep duration in milliseconds</td>
						</tr>
						<tr>
							<td class="px-4 py-2">
								<code class="${hlmCode}">shimmer-spread-*</code>
							</td>
							<td class="text-muted-foreground px-4 py-2">Width of the highlight band</td>
						</tr>
						<tr>
							<td class="px-4 py-2">
								<code class="${hlmCode}">shimmer-angle-*</code>
							</td>
							<td class="text-muted-foreground px-4 py-2">Tilt of the highlight band in degrees</td>
						</tr>
					</tbody>
				</table>
			</div>

			<spartan-section-sub-heading id="with-marker">With Marker</spartan-section-sub-heading>
			<p class="${hlmP}">A common pattern is a Marker showing a live status while the assistant is working.</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="h-auto! min-h-0!">
					<spartan-shimmer-marker-preview />
				</div>
				<spartan-code secondTab [code]="_markerCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="color">Color</spartan-section-sub-heading>
			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">shimmer-color-*</code>
				to set the highlight color explicitly. It accepts theme colors with an optional opacity modifier, or any
				arbitrary color value.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="h-auto! min-h-0!">
					<spartan-shimmer-color-preview />
				</div>
				<spartan-code secondTab [code]="_colorCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="duration">Duration</spartan-section-sub-heading>
			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">shimmer-duration-*</code>
				to set the duration of one sweep in milliseconds. The default is
				<code class="${hlmCode}">2000</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="h-auto! min-h-0!">
					<spartan-shimmer-duration-preview />
				</div>
				<spartan-code secondTab [code]="_durationCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="spread">Spread</spartan-section-sub-heading>
			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">shimmer-spread-*</code>
				to set the width of the highlight band using the spacing scale.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="h-auto! min-h-0!">
					<spartan-shimmer-spread-preview />
				</div>
				<spartan-code secondTab [code]="_spreadCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="angle">Angle</spartan-section-sub-heading>
			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">shimmer-angle-*</code>
				to set the tilt of the highlight band in degrees. The default is
				<code class="${hlmCode}">20</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="h-auto! min-h-0!">
					<spartan-shimmer-angle-preview />
				</div>
				<spartan-code secondTab [code]="_angleCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="play-once">Play Once</spartan-section-sub-heading>
			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">shimmer-once</code>
				to play a single sweep instead of looping. Remount the element to replay.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="h-auto! min-h-0!">
					<spartan-shimmer-once-preview />
				</div>
				<spartan-code secondTab [code]="_onceCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="disabling">Disabling the Shimmer</spartan-section-sub-heading>
			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">shimmer-none</code>
				to turn the effect off. It works in any class order.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="h-auto! min-h-0!">
					<spartan-shimmer-none-preview />
				</div>
				<spartan-code secondTab [code]="_noneCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="rtl">RTL</spartan-section-sub-heading>
			<p class="${hlmP}">
				The sweep follows the reading direction — left to right in LTR and right to left in RTL — with no extra classes.
				Use
				<code class="${hlmCode}">shimmer-reverse</code>
				to flip the direction manually.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="h-auto! min-h-0!">
					<spartan-shimmer-rtl-preview />
				</div>
				<spartan-code secondTab [code]="_rtlCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="/forms" label="Forms" />
				<spartan-page-bottom-nav-link direction="previous" href="scroll-fade" label="Scroll Fade" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class ShimmerPage {
	protected readonly _demoCode = shimmerDemoCode;
	protected readonly _markerCode = shimmerMarkerCode;
	protected readonly _colorCode = shimmerColorCode;
	protected readonly _durationCode = shimmerDurationCode;
	protected readonly _spreadCode = shimmerSpreadCode;
	protected readonly _angleCode = shimmerAngleCode;
	protected readonly _onceCode = shimmerOnceCode;
	protected readonly _noneCode = shimmerNoneCode;
	protected readonly _rtlCode = shimmerRtlCode;
}
