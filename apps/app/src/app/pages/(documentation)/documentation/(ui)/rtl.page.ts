import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { CardRtl } from '@spartan-ng/app/app/pages/(components)/components/(card)/card--rtl.preview';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { PageBottomNav } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link';
import { SectionIntro } from '@spartan-ng/app/app/shared/layout/section-intro';
import { SectionSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-heading';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { MainSection } from '../../../../shared/layout/main-section';
import { metaWith } from '../../../../shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'RTL' },
	meta: metaWith('spartan - RTL', 'Right-to-left support for spartan/ui components.'),
	title: 'spartan - Introduction',
};

@Component({
	selector: 'spartan-docs-intro',
	imports: [MainSection, SectionIntro, CardRtl, CodeRtlPreview, SectionSubHeading, PageBottomNav, PageBottomNavLink],

	template: `
		<section spartanMainSection>
			<spartan-section-intro name="RTL" lead="Right-to-left support for shadcn/ui components." />
			<p class="${hlmP} mb-8">
				spartan/ui components have first-class support for right-to-left (RTL) layouts. Text alignment, positioning, and
				directional styles automatically adapt for languages like Arabic, Hebrew, and Persian.
			</p>

			<div spartanRtlCodePreview class="mb-8 rounded-xl border">
				<spartan-card-rtl />
			</div>

			<p class="text-muted-foreground text-center text-sm">A card component in RTL mode.</p>

			<spartan-section-sub-heading id="how-it-works">How it works</spartan-section-sub-heading>

			<p class="${hlmP}">
				When you install components, the CLI automatically transforms physical positioning classes into their logical
				equivalents. This ensures your components work seamlessly in both LTR and RTL layouts.
			</p>
			<p class="${hlmP}">
				To enable RTL support, simply add
				<code class="${hlmCode}">dir="rtl"</code>
				to the
				<code class="${hlmCode}">&lt;html&gt;</code>
				element. All Spartan components will then work out of the box.
			</p>

			<ul class="my-6 ml-6 list-disc">
				<li class="mt-2">
					Physical positioning classes like
					<code class="${hlmCode}">left-*</code>
					and
					<code class="${hlmCode}">right-*</code>
					are converted to logical equivalents like
					<code class="${hlmCode}">start-*</code>
					and
					<code class="${hlmCode}">end-*</code>
					.
				</li>
				<li class="mt-2">Directional props are updated to use logical values.</li>
				<li class="mt-2">Text alignment and spacing classes are adjusted accordingly.</li>
				<li class="mt-2">
					Supported icons are automatically flipped using
					<code class="${hlmCode}">rtl:rotate-180</code>
					.
				</li>
			</ul>
		</section>
		<spartan-page-bottom-nav>
			<spartan-page-bottom-nav-link href="typography" label="Typography" />
			<spartan-page-bottom-nav-link direction="previous" href="cli" label="CLI" />
		</spartan-page-bottom-nav>
	`,
})
export default class DocsIntroPage {}
