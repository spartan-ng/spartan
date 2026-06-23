import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { hlmCode, hlmP, hlmUl } from '@spartan-ng/helm/typography';

import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { MainSection } from '../../../shared/layout/main-section';
import { PageBottomNav } from '../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../shared/layout/section-sub-heading';
import { metaWith } from '../../../shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Changelog' },
	meta: metaWith('spartan - Changelog', 'Latest updates and announcements.'),
	title: 'spartan - Changelog',
};

@Component({
	selector: 'spartan-changelog',
	imports: [
		MainSection,
		SectionIntro,
		PageBottomNav,
		PageBottomNavLink,
		PageNav,
		SectionSubHeading,
		RouterLink,
		HlmButtonImports,
		SectionSubSubHeading,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Changelog" lead="Latest updates and announcements." />
			<spartan-section-sub-heading id="v1" first class="pt-6">June 2026 - spartan/ui v1.0</spartan-section-sub-heading>
			<p class="${hlmP}">
				After a long and deliberate alpha,
				<code class="${hlmCode}">spartan/ui</code>
				is now
				<strong>1.0</strong>
				. What started as 30 primitives has grown into a stable, production-ready library of accessible Angular
				components - built on signals, ready for zoneless, and compatible with server-side rendering out of the box.
			</p>

			<p class="${hlmP}">Here's a quick overview of what 1.0 means:</p>
			<ul class="${hlmUl}">
				<li>
					<a class="font-medium hover:underline" routerLink="." fragment="v1__stable">Production-ready and stable</a>
					- a committed, semver-versioned API you can build on.
				</li>
				<li>
					<a class="font-medium hover:underline" routerLink="." fragment="v1__architecture">Built for modern Angular</a>
					- signals throughout, zoneless-ready, and SSR compatible.
				</li>
				<li>
					<a class="font-medium hover:underline" routerLink="." fragment="v1__components">More than 55 components</a>
					- nearly double the initial 30, including Data Table, Sidebar, Calendar, and Date Picker.
				</li>
				<li>
					<a class="font-medium hover:underline" routerLink="." fragment="v1__blocks">Blocks</a>
					- ready-made layouts for authentication, sidebars, and steppers.
				</li>
			</ul>

			<h3 id="v1__stable" spartanH4>Production-ready and stable</h3>
			<p class="${hlmP}">
				spartan/ui spent a long time in alpha so we could refine its APIs in the open. With 1.0 those APIs are stable:
				we follow semantic versioning, so you can depend on
				<code class="${hlmCode}">spartan/ui/brain</code>
				and upgrade with confidence. The copy-in
				<code class="${hlmCode}">spartan/ui/helm</code>
				layer stays yours to own and customize - exactly as before.
			</p>

			<h3 id="v1__architecture" spartanH4>Built for modern Angular</h3>
			<p class="${hlmP}">
				Every primitive is built on Angular signals and standalone components. spartan is zoneless-ready and
				server-side-rendering compatible out of the box, so it fits cleanly into today's Angular applications without
				extra setup. You get maintained accessibility - ARIA, keyboard navigation, and focus management - through
				<code class="${hlmCode}">spartan/ui/brain</code>
				, with full styling control through
				<code class="${hlmCode}">spartan/ui/helm</code>
				.
			</p>

			<h3 id="v1__components" spartanH4>More than 55 components</h3>
			<p class="${hlmP}">
				The initial alpha shipped with 30 primitives. 1.0 ships with more than 55, including many of the most requested
				additions:
			</p>
			<ul class="${hlmUl}">
				<li><a class="font-medium hover:underline" routerLink="/components/data-table">Data Table</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/sidebar">Sidebar</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/calendar">Calendar</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/date-picker">Date Picker</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/carousel">Carousel</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/autocomplete">Autocomplete</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/pagination">Pagination</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/breadcrumb">Breadcrumb</a></li>
			</ul>
			<p class="${hlmP}">
				Browse the full set on the
				<a class="font-medium hover:underline" routerLink="/components">components page</a>
				.
			</p>

			<h3 id="v1__blocks" spartanH4>Blocks</h3>
			<p class="${hlmP}">
				Blocks are ready-made, fully responsive layouts built from spartan components. 1.0 includes authentication
				pages, sidebar layouts, and multi-step steppers you can drop into your app and customize. Explore them on the
				<a class="font-medium hover:underline" routerLink="/blocks">blocks page</a>
				.
			</p>

			<h3 id="v1__getting_started" spartanH4>Getting started</h3>
			<p class="${hlmP}">New to spartan? There's never been a better time to start.</p>
			<div class="m-10 flex items-center justify-center">
				<a hlmBtn size="lg" routerLink="/documentation/installation">Get started with spartan/ui</a>
			</div>

			<h3 id="v1__support" spartanH4>Support spartan</h3>
			<p class="${hlmP}">
				spartan is MIT-licensed and built in the open. If it saves you time, consider sponsoring its development -
				sponsorships fund ongoing maintenance, new components, and keeping spartan free for the whole Angular community.
			</p>
			<div class="m-10 flex items-center justify-center">
				<a hlmBtn size="lg" target="_blank" rel="noreferrer" href="https://github.com/sponsors/goetzrobin">
					Sponsor spartan
				</a>
			</div>

			<spartan-section-sub-heading id="initial-alpha">August 2023 - Initial Alpha release</spartan-section-sub-heading>

			<p class="${hlmP}">
				<code class="${hlmCode}">spartan/ui</code>
				is an open-source collection of an initial 30 UI primitives designed to streamline your development process and
				empower your Angular projects with enhanced efficiency and accessibility.
			</p>
			<h3 id="initial-alpha__why" spartanH4>Why spartan/ui?</h3>
			<p class="${hlmP}">
				Creating seamless, captivating, and accessible user interfaces is hard. Through
				<code class="${hlmCode}">spartan/ui/brain</code>
				, our goal is to make this process more straightforward and efficient. We offer a versatile collection of
				unstyled UI building blocks that can be easily tailored to match your project's distinct visual and functional
				preferences.
			</p>
			<p class="${hlmP}">
				Additionally, with
				<code class="${hlmCode}">spartan/ui/helm</code>
				, we provide pre-designed styles that not only look great from the start but also let you to retain full control
				over their code, appearance, and overall experience.
			</p>
			<h3 id="initial-alpha__brain" spartanH4>spartan/ui/brain</h3>
			<p class="${hlmP}">
				Each
				<code class="${hlmCode}">spartan/ui/brain</code>
				represents a headless and accessible implementation of an UI primitive. This can be a standalone Angular
				Component, a Directive applied to existing HTML elements, or a hybrid combining both for more intricate UI
				elements.
			</p>
			<p class="${hlmP}">
				This brain-first approach empowers developers to build UI components with enhanced accessibility and modularity,
				offering flexibility in crafting custom interfaces that cater to diverse project requirements.
			</p>
			<h3 id="initial-alpha__helm" spartanH4>spartan/ui/helm</h3>
			<p class="${hlmP}">
				On top of these brain components we put our helmet. Our helmet adds SPARTAN-like swagger to our UI.
			</p>
			<p class="${hlmP}">
				Unlike it's brain counterparts,
				<code class="${hlmCode}">spartan/ui/helm</code>
				primitives are not libraries. Instead, just like with shadcn, they are recipes, which code you can copy directly
				into your own project.
			</p>
			<h3 id="initial-alpha__nx" spartanH4>Powered by &#64;spartan-ng/nx</h3>
			<p class="${hlmP}">
				To make this as easy as possible,
				<code class="${hlmCode}">spartan/ui</code>
				comes equipped with an Nx plugin that allows you to effortlessly integrate our components into your Nx
				workspace. With a single command, you can add any of the 30
				<code class="${hlmCode}">spartan/ui</code>
				primitives to your projects.
			</p>
			<p class="${hlmP}">
				But that's not all – the Nx plugin's capabilities extend beyond just adding components. You can also leverage it
				to incorporate one of 12 custom themes into your Nx applications, letting you truly own the visual appearance of
				your projects.
			</p>
			<h3 id="initial-alpha__initial_30" spartanH4>The initial 30</h3>
			<p class="${hlmP}">The initial 30 components we launch today are:</p>
			<ul class="${hlmUl}">
				<li><a class="font-medium hover:underline" routerLink="/components/accordion">Accordion</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/alert">Alert</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/alert">Alert Dialog</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/aspect-ratio">Aspect Ratio</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/avatar">Avatar</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/badge">Badge</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/button">Button</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/card">Card</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/collapsible">Collapsible</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/combobox">Combobox</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/command">Command</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/context-menu">Context Menu</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/dialog">Dialog</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/dropdown-menu">Dropdown Menu</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/input">Input</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/icon">Icon</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/label">Label</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/menubar">Menubar</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/popover">Popover</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/progress">Progress</a></li>
				<li>
					<a class="font-medium hover:underline" routerLink="/components/radio">Radio</a>
					Group
				</li>
				<li>
					<a class="font-medium hover:underline" routerLink="/components/scroll">Scroll</a>
					Area
				</li>
				<li><a class="font-medium hover:underline" routerLink="/components/separator">Separator</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/sheet">Sheet</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/skeleton">Skeleton</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/switch">Switch</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/tabs">Tabs</a></li>
				<li>
					<a class="font-medium hover:underline" routerLink="/components/textarea">
						Textarea (covered by
						<code class="${hlmCode}">hlmInput</code>
						directive)
					</a>
				</li>
				<li><a class="font-medium hover:underline" routerLink="/components/toggle">Toggle</a></li>
				<li><a class="font-medium hover:underline" routerLink="/components/typography">Typography</a></li>
			</ul>
			<h3 id="initial-alpha__getting_started" spartanH4>Getting Started</h3>
			<p class="${hlmP}">
				Excited to try any of these? What are you waiting for? Head over to the installation page and start your spartan
				journey!
			</p>
			<div class="m-10 flex items-center justify-center">
				<a hlmBtn size="lg" routerLink="/documentation/installation">Get started with spartan/ui</a>
			</div>
			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="about" label="About" />
				<spartan-page-bottom-nav-link direction="previous" href="introduction" label="Introduction" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class ChangelogPage {}
