import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { ArchitectureDiagramComponent } from '@spartan-ng/app/app/pages/(stack)/stack/(overview)/components/architecture-diagram.component';
import { CodePreviewDirective } from '@spartan-ng/app/app/shared/code/code-preview.directive';
import { CodeComponent } from '@spartan-ng/app/app/shared/code/code.component';
import { MainSectionDirective } from '@spartan-ng/app/app/shared/layout/main-section.directive';
import { PageBottomNavPlaceholderComponent } from '@spartan-ng/app/app/shared/layout/page-bottom-nav-placeholder.component';
import { PageBottomNavLinkComponent } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '@spartan-ng/app/app/shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '@spartan-ng/app/app/shared/layout/section-sub-heading.component';
import { TabsComponent } from '@spartan-ng/app/app/shared/layout/tabs.component';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { hlmCode, hlmP, hlmUl } from '@spartan-ng/ui-typography-helm';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Overview' },
	meta: metaWith(
		'spartan/stack - Overview',
		'The spartan/stack is an opinionated full-stack that consists of multiple technologies providing e2e type safety to Angular developers.',
	),
	title: 'spartan/stack - Overview',
};

const stackLink = 'h-6 underline text-base px-0.5';

@Component({
	selector: 'spartan-accordion',
	imports: [
		MainSectionDirective,
		CodeComponent,
		SectionIntroComponent,
		SectionSubHeadingComponent,
		TabsComponent,
		CodePreviewDirective,
		PageNavComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		PageBottomNavPlaceholderComponent,
		ArchitectureDiagramComponent,
		HlmButtonDirective,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Overview"
				lead="The spartan/stack is an opinionated full-stack that consists of
      multiple technologies providing e2e type safety to Angular developers."
			/>

			<spartan-architecture-diagram />

			<spartan-section-sub-heading id="motivation">Motivation</spartan-section-sub-heading>
			<p class="${hlmP}">
				The
				<code class="${hlmCode}">spartan/stack</code>
				streamlines the setup of end-to-end typesafe Angular full-stack applications. It is opinionated and based on
				insights from working with Angular and Typescript within a full-stack environment for a long time. The
				<code class="${hlmCode}">spartan/stack</code>
				helps you build your applications faster and better.
			</p>

			<spartan-section-sub-heading id="stack">The Stack</spartan-section-sub-heading>
			<p class="${hlmP}">The stack to provides the best available cutting-edge technologies. These are currently:</p>
			<ul class="${hlmUl}">
				<li>
					<a hlmBtn class="${stackLink}" size="sm" href="https://supabase.com" target="_blank" variant="link">
						Supabase
					</a>
					- Hosted, scalable database solution. Opensource and super easy to set up.
				</li>
				<li>
					<a hlmBtn class="${stackLink}" size="sm" href="https://angular.io" target="_blank" variant="link">Angular</a>
					- Google's frontend framework. Powerful & reliable.
				</li>
				<li>
					<a hlmBtn class="${stackLink}" size="sm" href="https://trpc.io" target="_blank" variant="link">tRPC</a>
					- Typesafe client-server exchanges preventing bugs before even hitting "save".
				</li>
				<li>
					<a hlmBtn class="${stackLink}" size="sm" href="https://tailwindcss.com" target="_blank" variant="link">
						TailwindCSS
					</a>
					- Utility-first CSS framework with great design baked into it.
				</li>
				<li>
					<a hlmBtn class="${stackLink}" size="sm" href="https://analogjs.org" target="_blank" variant="link">
						AnalogJs
					</a>
					- Fullstack Angular with Vite, file-based routing, and a Nitro server!
				</li>
				<li>
					<a hlmBtn class="${stackLink}" href="https://nx.dev" target="_blank" variant="link">Nx</a>
					- Monorepo & development tooling that will blow your mind.
				</li>
				<li>
					<a hlmBtn class="${stackLink}" href="https://orm.drizzle.team/" target="_blank" variant="link">Drizzle</a>
					- Great typescript ORM for typesafe DB interactions. Even better memes.
				</li>
			</ul>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="technologies" label="Technologies" />
				<spartan-page-bottom-nav-placeholder />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class AccordionPageComponent {}
