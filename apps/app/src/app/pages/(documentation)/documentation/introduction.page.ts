import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import {
	HlmAccordionContentComponent,
	HlmAccordionDirective,
	HlmAccordionIconDirective,
	HlmAccordionItemDirective,
	HlmAccordionTriggerDirective,
} from '@spartan-ng/ui-accordion-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { hlmCode, hlmP } from '@spartan-ng/ui-typography-helm';
import { MainSectionDirective } from '../../../shared/layout/main-section.directive';
import { PageBottomNavPlaceholderComponent } from '../../../shared/layout/page-bottom-nav-placeholder.component';
import { PageBottomNavLinkComponent } from '../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../shared/layout/section-sub-heading.component';
import { metaWith } from '../../../shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Introduction' },
	meta: metaWith(
		'spartan - Introduction',
		'spartan is a collection of tools to superpower your Angular full-stack development.',
	),
	title: 'spartan - Introduction',
};

@Component({
	selector: 'spartan-docs-intro',
	imports: [
		MainSectionDirective,
		SectionIntroComponent,
		SectionSubHeadingComponent,
		PageNavComponent,
		HlmAccordionDirective,
		HlmAccordionContentComponent,
		HlmAccordionIconDirective,
		HlmAccordionItemDirective,
		HlmAccordionTriggerDirective,
		RouterLink,
		PageNavComponent,
		PageBottomNavLinkComponent,
		PageBottomNavComponent,
		PageBottomNavPlaceholderComponent,
		HlmButtonDirective,
		NgIcon,
		HlmIconDirective,
	],
	providers: [provideIcons({ lucideChevronRight })],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Introduction" lead="Cutting-edge tools powering Angular full-stack development." />
			<p class="mb-6">
				<code class="${hlmCode}">spartan</code>
				allows you to build next-level, full-stack applications with AnalogJs.
			</p>
			<p>It provides an opinionated stack with a single command and a set of accessible UI primitives.</p>
			<spartan-section-sub-heading id="spartan-stack">spartan/stack</spartan-section-sub-heading>
			<p class="${hlmP}">
				The
				<code class="${hlmCode}">spartan/stack</code>
				is a collection of technologies that provide you with a typesafe developer experience from the template all the
				way to the database.
			</p>
			<p class="${hlmP}">
				While we keep updating the stack to provide the best available technologies,
				<code class="${hlmCode}">spartan/stack</code>
				is currently made up of the following:
				<code class="${hlmCode}">Supabase</code>
				,
				<code class="${hlmCode}">Angular</code>
				,
				<code class="${hlmCode}">tRPC</code>
				,
				<code class="${hlmCode}">Tailwind</code>
				,
				<code class="${hlmCode}">AnalogJs</code>
				,
				<code class="${hlmCode}">Nx</code>
				, and
				<code class="${hlmCode}">Drizzle</code>
			</p>
			<div class="mt-6 flex items-center justify-end">
				<a routerLink="/stack" variant="outline" size="sm" hlmBtn outline="">
					Check out spartan/stack
					<ng-icon hlm name="lucideChevronRight" class="ml-2" size="sm" />
				</a>
			</div>
			<spartan-section-sub-heading id="spartan-ui">spartan/ui</spartan-section-sub-heading>
			<p class="${hlmP}">
				<code class="${hlmCode}">spartan/ui</code>
				is built on the
				<code class="${hlmCode}">spartan/ui/brain</code>
				library that provides accessible, but unstyled primitives that build the foundation of an inclusive user
				interface.
			</p>
			<p class="${hlmP}">
				On top we put
				<code class="${hlmCode}">spartan/ui/helm</code>
				library that gives our primitives a beautifully designed
				<span class="font-medium">shadcn</span>
				look.
			</p>
			<div class="mt-6 flex items-center justify-end">
				<a routerLink="/documentation/installation" variant="outline" size="sm" hlmBtn outline="">
					Check out spartan/ui
					<ng-icon hlm name="lucideChevronRight" class="ml-2" size="sm" />
				</a>
			</div>
			<spartan-section-sub-heading id="faq">FAQ</spartan-section-sub-heading>
			<div hlmAccordion>
				<div hlmAccordionItem>
					<button hlmAccordionTrigger>
						<span>What is spartan/stack</span>
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
					<hlm-accordion-content>
						It is a collection of full-stack technologies that power end-to-end type-safe Angular development.
					</hlm-accordion-content>
				</div>

				<div hlmAccordionItem>
					<button hlmAccordionTrigger>
						<span>What is spartan/ui</span>
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
					<hlm-accordion-content>
						A collection of Angular UI primitives that are both beautiful and accessible.
					</hlm-accordion-content>
				</div>
				<div hlmAccordionItem>
					<button hlmAccordionTrigger>
						<span>What is spartan/ui/brain</span>
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
					<hlm-accordion-content>
						A collection of unstyled UI primitives that provide accessibility out of the box.
					</hlm-accordion-content>
				</div>
				<div hlmAccordionItem>
					<button hlmAccordionTrigger>
						<span>What is spartan/ui/helm</span>
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
					<hlm-accordion-content>
						Directives, sometimes additional components, that give spartan/brain a shadcn look.
					</hlm-accordion-content>
				</div>
			</div>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="cli" label="CLI" />
				<spartan-page-bottom-nav-placeholder />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class DocsIntroPageComponent {}
