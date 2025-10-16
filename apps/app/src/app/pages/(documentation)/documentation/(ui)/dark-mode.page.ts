import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';

import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { PageBottomNav } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link';

import { SectionIntro } from '@spartan-ng/app/app/shared/layout/section-intro';

import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Dark Mode' },
	meta: metaWith('spartan - Dark Mode', 'Adding dark mode to your site.'),
	title: 'spartan - Dark Mode',
};

@Component({
	selector: 'spartan-dark-mode',
	imports: [MainSection, SectionIntro, PageBottomNav, PageBottomNavLink],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Dark Mode" lead="Adding dark mode to your site." />
			<p class="${hlmP}">
				<code class="${hlmCode}">spartan/ui</code>
				is built on TailwindCSS with custom CSS variables. These variables change based on whether or not a
				<code class="${hlmCode}">dark</code>
				class is applied to the root element of your page.
			</p>
			<p class="${hlmP}">
				Here is a comprehensive guide on how to toggle that class with Angular:
				<a
					class="font-medium underline"
					target="_blank"
					href="https://dev.to/this-is-angular/dark-mode-with-analog-tailwind-4049"
				>
					Dark mode with Analog & Tailwind
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
