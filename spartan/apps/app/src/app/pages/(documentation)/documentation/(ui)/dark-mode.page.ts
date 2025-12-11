import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';

import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { PageBottomNav } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link';

import { SectionIntro } from '@spartan-ng/app/app/shared/layout/section-intro';

import { SectionSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-heading';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Dark Mode' },
	meta: metaWith('spartan - Dark Mode', 'Adding dark mode to your site.'),
	title: 'spartan - Dark Mode',
};

@Component({
	selector: 'spartan-dark-mode',
	imports: [MainSection, SectionIntro, PageBottomNav, PageBottomNavLink, SectionSubHeading],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Dark Mode" lead="Toggle between light and dark themes with a single class." />

			<p class="${hlmP}">
				spartan/ui supports dark mode out of the box. Add the
				<code class="${hlmCode}">dark</code>
				class to your
				<code class="${hlmCode}">&lt;html&gt;</code>
				element, and all CSS variables automatically switch to their dark mode values.
			</p>

			<p class="${hlmP}">No component changes required. All spartan primitives adapt automatically.</p>

			<spartan-section-sub-heading id="implementation">Implementation</spartan-section-sub-heading>

			<p class="${hlmP}">For a complete implementation including:</p>
			<ul class="my-4 ml-6 list-disc [&>li]:mt-2">
				<li>Persisting user preference with localStorage</li>
				<li>Respecting system color scheme</li>
				<li>Preventing theme flash on SSR</li>
				<li>Angular service with signals</li>
			</ul>

			<p class="${hlmP}">
				See this comprehensive guide:
				<a
					class="font-medium underline"
					target="_blank"
					href="https://dev.to/this-is-angular/dark-mode-with-analog-tailwind-4049"
				>
					Dark mode with Angular & Tailwind
				</a>
			</p>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="typography" label="Typography" />
				<spartan-page-bottom-nav-link direction="previous" href="theming" label="Theming" />
			</spartan-page-bottom-nav>
		</section>
	`,
})
export default class DarkModePage {}
