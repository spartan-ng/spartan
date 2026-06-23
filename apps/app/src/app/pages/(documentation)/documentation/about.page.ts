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
				<a hlmBtn variant="link" class="${aboutLink}" href="https://www.spartan.ng">spartan.ng</a>
				is a project by
				<a hlmBtn variant="link" class="${aboutLink}" href="https://github.com/goetzrobin">goetzrobin</a>
				and a growing community of contributors. Come say hi in our
				<a hlmBtn variant="link" class="${aboutLink}" href="https://discord.gg/EqHnxQ4uQr" target="_blank">Discord.</a>
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

			<spartan-section-sub-heading id="maintainers">Core maintainers</spartan-section-sub-heading>

			<p class="${hlmP}">
				spartan is built and maintained by a small, dedicated core team who pour countless hours into the project:
				<a hlmBtn variant="link" class="${aboutLink}" href="https://github.com/MerlinMoos" target="_blank">Merlin,</a>
				<a hlmBtn variant="link" class="${aboutLink}" href="https://github.com/marcjulian" target="_blank">Marc,</a>
				<a hlmBtn variant="link" class="${aboutLink}" href="https://github.com/ashley-hunter" target="_blank">
					Ashley,
				</a>
				<a hlmBtn variant="link" class="${aboutLink}" href="https://github.com/elite-benni" target="_blank">Benni,</a>
				<a hlmBtn variant="link" class="${aboutLink}" href="https://github.com/thatsamsonkid" target="_blank">Sammy,</a>
				and
				<a hlmBtn variant="link" class="${aboutLink}" href="https://github.com/toniskobic" target="_blank">Toni</a>
				- alongside the
				<a
					hlmBtn
					variant="link"
					class="${aboutLink}"
					href="https://github.com/spartan-ng/spartan/graphs/contributors"
					target="_blank"
				>
					100+ contributors
				</a>
				who keep spartan moving.
			</p>

			<p class="${hlmP}">
				Special thanks to
				<a hlmBtn variant="link" class="${aboutLink}" href="https://zerops.io" target="_blank">Zerops</a>
				, whose support funds dedicated development time. A true developer first platform for this new age of AI-powered
				software engineering!
			</p>

			<spartan-section-sub-heading id="support">Support spartan</spartan-section-sub-heading>

			<p class="${hlmP}">
				spartan is MIT-licensed and free, forever - but free to use isn't free to build. Countless hours of hard-fought
				work hold this phalanx together. If spartan benefits your company or team, consider returning the favor:
				sponsoring keeps spartan actively maintained and its open-source work sustainable. No spartan holds the line
				alone - every shield in the wall counts.
			</p>
			<div class="my-6 flex flex-wrap items-center gap-3">
				<a hlmBtn href="https://github.com/sponsors/goetzrobin" target="_blank">Sponsor spartan</a>
				<a hlmBtn variant="outline" href="https://discord.gg/EqHnxQ4uQr" target="_blank">Join us on Discord</a>
			</div>

			<spartan-section-sub-heading id="license">License</spartan-section-sub-heading>

			<p class="${hlmP}">
				MIT &copy; {{ currentYear }} -
				<a hlmBtn variant="link" class="px-0.5 text-sm underline" href="https://github.com/goetzrobin">goetzrobin</a>
			</p>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="installation" label="Installation" />
				<spartan-page-bottom-nav-link direction="previous" href="changelog" label="Changelog" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class ChangelogPage {
	public currentYear = new Date().getFullYear();
}
