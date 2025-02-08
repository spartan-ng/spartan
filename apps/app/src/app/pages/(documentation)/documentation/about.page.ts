import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { ComingSoonComponent } from '@spartan-ng/app/app/shared/layout/coming-soon.component';
import { MainSectionDirective } from '@spartan-ng/app/app/shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '@spartan-ng/app/app/shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '@spartan-ng/app/app/shared/layout/section-sub-heading.component';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { hlmP, hlmUl } from '@spartan-ng/ui-typography-helm';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'About' },
	meta: metaWith('spartan - About', 'Powered by amazing open source projects.'),
	title: 'spartan - About',
};

const aboutLink = 'h-6 underline text-base px-0.5';

@Component({
	selector: 'spartan-about',
	standalone: true,
	imports: [
		MainSectionDirective,
		SectionIntroComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		PageNavComponent,
		ComingSoonComponent,
		SectionSubHeadingComponent,
		HlmButtonDirective,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="About" lead="Powered by amazing open source projects." />

			<spartan-section-sub-heading first id="about">About</spartan-section-sub-heading>
			<section>
				<p class="${hlmP}">
					<a hlmBtn variant="link" class="${aboutLink}" href="https://spartan.ng">spartan.ng</a>
					is a project by
					<a hlmBtn variant="link" class="${aboutLink}" href="https://twitter.com/goetzrobin">goetzrobin</a>
					.
				</p>
			</section>

			<spartan-section-sub-heading id="spartans">
				<span class="flex items-center">
					<span>spartans</span>
					<svg
						class="ml-2 h-5 w-5"
						width="587"
						height="587"
						viewBox="0 0 587 587"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M293.5 66C167.855 66 66 167.855 66 293.5C66 345.005 83.088 392.483 111.949 430.623L293.5 217.629L475.051 430.623C503.912 392.483 521 345.005 521 293.5C521 167.855 419.145 66 293.5 66ZM427.916 477.068L293.5 319.371L159.084 477.068C196.752 504.705 243.2 521 293.5 521C343.8 521 390.248 504.705 427.916 477.068ZM0 293.5C0 131.404 131.404 0 293.5 0C455.596 0 587 131.404 587 293.5C587 376.362 552.619 451.25 497.432 504.579C444.66 555.574 372.716 587 293.5 587C214.284 587 142.34 555.574 89.5685 504.579C34.3812 451.25 0 376.362 0 293.5Z"
							fill="currentColor"
						/>
					</svg>
				</span>
			</spartan-section-sub-heading>
			<section>
				<ul class="${hlmP} ${hlmUl} mt-0">
					<li>
						<a class="${aboutLink}" hlmBtn href="https://twitter.com/goetzrobin" target="_blank" variant="link">
							goetzrobin
						</a>
						- working on spartan/stack & spartan/ui.
					</li>
					<li>
						<a class="${aboutLink}" hlmBtn href="https://github.com/mihajm" target="_blank" variant="link">mihajm</a>
						- working on spartan/ui.
					</li>
					<li>
						<a class="${aboutLink}" hlmBtn href="https://github.com/AdditionAddict" target="_blank" variant="link">
							AdditionAddict
						</a>
						- supporting spartan/stack & spartan/ui.
					</li>
				</ul>
			</section>

			<spartan-section-sub-heading id="credits">Credits</spartan-section-sub-heading>
			<section>
				<p class="${hlmP}">
					First and foremost, credit goes to the incredible
					<a hlmBtn variant="link" class="${aboutLink}" href="https://brandonroberts.dev/blog">Brandon Roberts</a>
					and
					<a hlmBtn variant="link" class="${aboutLink}" href="https://shadcn.com">shadcn.</a>
				</p>

				<p class="${hlmP}">
					Brandon's AnalogJs is the absolute backbone of the spartan/stack and brings incredible value to the Angular
					ecosystem.
				</p>
				<p class="${hlmP}">
					The UI library shadcn has created is simply beautiful and spartan/ui tries its best to emulate its style and
					quality.
				</p>
				<p class="${hlmP}">Other awesome work we are building upon is:</p>
				<ul class="${hlmUl}">
					<li>
						<a class="${aboutLink}" hlmBtn href="https://analogjs.org" target="_blank" variant="link">AnalogJs</a>
						- The full-stack Angular meta-framework.
					</li>
					<li>
						<a class="${aboutLink}" hlmBtn href="https://ui.shadcn.com" target="_blank" variant="link">ui.shadcn.com</a>
						- Styles for UI primitives.
					</li>
					<li>
						<a class="${aboutLink}" hlmBtn href="https://radix-ui.com" target="_blank" variant="link">Radix</a>
						- Patterns & inspiration for accessible unstyled UI primitives.
					</li>
					<li>
						<a class="${aboutLink}" hlmBtn href="https://material.angular.io" target="_blank" variant="link">
							Angular Material
						</a>
						- An incredible CDK, patterns & inspiration for accessible unstyled ui primitives.
					</li>
					<li>
						<a
							class="${aboutLink}"
							hlmBtn
							href="https://github.com/timdeschryver/ng-signal-forms"
							target="_blank"
							variant="link"
						>
							ng-signal-forms
						</a>
						- Form library based on Angular signals, which makes working with even the most complex scenarios a breeze.
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
						- Custom overlay-scrollbars with native scrolling mechanism.
					</li>
					<li>
						<a class="${aboutLink}" hlmBtn href="https://ng-icons.github.io/ng-icons" target="_blank" variant="link">
							ng-icons
						</a>
						- The ultimate icon library for Angular.
					</li>
				</ul>
			</section>

			<spartan-section-sub-heading id="license">License</spartan-section-sub-heading>
			<section>
				<p class="${hlmP}">
					MIT &copy; {{ currentYear }} -
					<a hlmBtn variant="link" class="px-0.5 text-base underline" href="https://twitter.com/goetzrobin">
						goetzrobin
					</a>
				</p>
			</section>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="/stack/overview" label="Stack" />
				<spartan-page-bottom-nav-link direction="previous" href="changelog" label="Changelog" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class ChangelogPageComponent {
	public currentYear = new Date().getFullYear();
}
