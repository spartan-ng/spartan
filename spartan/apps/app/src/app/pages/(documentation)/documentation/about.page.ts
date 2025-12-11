import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';

import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { PageBottomNav } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav';
import { SectionIntro } from '@spartan-ng/app/app/shared/layout/section-intro';
import { SectionSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-heading';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { hlmP, hlmUl } from '@spartan-ng/helm/typography';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'About' },
	meta: metaWith('spartan - About', 'Built on the shoulders of incredible open source projects.'),
	title: 'spartan - About',
};

const aboutLink = 'h-6 underline text-sm px-0.5';

@Component({
	selector: 'spartan-about',
	imports: [MainSection, SectionIntro, PageBottomNav, PageBottomNavLink, PageNav, SectionSubHeading, HlmButtonImports],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="About" lead="Built on the shoulders of incredible open source projects." />

			<spartan-section-sub-heading first id="about" class="pt-6">About</spartan-section-sub-heading>

			<p class="${hlmP}">
				<a hlmBtn variant="link" class="${aboutLink}" href="https://spartan.ng">spartan.ng</a>
				is a project by
				<a hlmBtn variant="link" class="${aboutLink}" href="https://twitter.com/goetzrobin">goetzrobin</a>
				.
			</p>

			<spartan-section-sub-heading id="credits">Credits</spartan-section-sub-heading>

			<p class="${hlmP}">
				spartan/ui wouldn't exist without the pioneering work of
				<a hlmBtn variant="link" class="${aboutLink}" href="https://shadcn.com">shadcn</a>
				and the patterns established by
				<a hlmBtn variant="link" class="${aboutLink}" href="https://radix-ui.com">Radix UI.</a>
			</p>

			<p class="${hlmP}">
				shadcn showed the world that developers prefer copying code over installing packages. Radix pioneered
				accessible, unstyled primitives. spartan adapts both philosophies for the Angular ecosystem.
			</p>

			<p class="${hlmP}">
				Massive thanks to
				<a hlmBtn variant="link" class="${aboutLink}" href="https://brandonroberts.dev/blog">Brandon Roberts</a>
				for AnalogJs, which powers the full-stack capabilities of spartan/stack.
			</p>

			<p class="${hlmP}">Other incredible projects we build upon:</p>
			<ul class="${hlmUl}">
				<li>
					<a class="${aboutLink}" hlmBtn href="https://ui.shadcn.com" target="_blank" variant="link">shadcn/ui</a>
					- Design system and copy-paste philosophy that inspired spartan/ui.
				</li>
				<li>
					<a class="${aboutLink}" hlmBtn href="https://radix-ui.com" target="_blank" variant="link">Radix UI</a>
					- Patterns and architecture for accessible, unstyled primitives.
				</li>
				<li>
					<a class="${aboutLink}" hlmBtn href="https://material.angular.io" target="_blank" variant="link">
						Angular Material CDK
					</a>
					- Battle-tested patterns for building accessible Angular components.
				</li>
				<li>
					<a class="${aboutLink}" hlmBtn href="https://analogjs.org" target="_blank" variant="link">AnalogJs</a>
					- The full-stack Angular meta-framework powering spartan/stack.
				</li>
				<li>
					<a class="${aboutLink}" hlmBtn href="https://tutkli.github.io/ngx-sonner" target="_blank" variant="link">
						ngx-sonner
					</a>
					- Elegant toast notifications by
					<a hlmBtn variant="link" class="${aboutLink}" href="https://github.com/tutkli">Tutkli.</a>
				</li>
				<li>
					<a
						class="${aboutLink}"
						hlmBtn
						href="https://github.com/MurhafSousli/ngx-scrollbar"
						target="_blank"
						variant="link"
					>
						ngx-scrollbar
					</a>
					- Custom overlay scrollbars with native scrolling mechanism.
				</li>
				<li>
					<a class="${aboutLink}" hlmBtn href="https://ng-icons.github.io/ng-icons" target="_blank" variant="link">
						ng-icons
					</a>
					- The ultimate icon library for Angular by
					<a hlmBtn variant="link" class="${aboutLink}" href="https://github.com/ashley-hunter">Ashley Hunter.</a>
				</li>
			</ul>

			<spartan-section-sub-heading id="license">License</spartan-section-sub-heading>

			<p class="${hlmP}">
				MIT &copy; {{ currentYear }} -
				<a hlmBtn variant="link" class="px-0.5 text-sm underline" href="https://twitter.com/goetzrobin">goetzrobin</a>
			</p>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="/stack/overview" label="Stack" />
				<spartan-page-bottom-nav-link direction="previous" href="changelog" label="Changelog" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class ChangelogPage {
	public currentYear = new Date().getFullYear();
}
