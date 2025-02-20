import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { hlmCode, hlmH4, hlmP, hlmUl } from '@spartan-ng/ui-typography-helm';
import { ComingSoonComponent } from '../../../shared/layout/coming-soon.component';
import { MainSectionDirective } from '../../../shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../shared/layout/section-sub-heading.component';
import { metaWith } from '../../../shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Changelog' },
	meta: metaWith('spartan - Changelog', 'Latest updates and announcements.'),
	title: 'spartan - Changelog',
};

@Component({
	selector: 'spartan-changelog',
	imports: [
		MainSectionDirective,
		SectionIntroComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		PageNavComponent,
		ComingSoonComponent,
		SectionSubHeadingComponent,
		RouterLink,
		HlmButtonDirective,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Changelog" lead="Latest updates and announcements." />
			<spartan-section-sub-heading id="initial-alpha" class="-mt-12">
				August 2023 - Initial Alpha release
			</spartan-section-sub-heading>

			<p class="${hlmP}">
				<code class="${hlmCode}">spartan/ui</code>
				is an open-source collection of an initial 30 UI primitives designed to streamline your development process and
				empower your Angular projects with enhanced efficiency and accessibility.
			</p>
			<h3 id="initial-alpha__why" class="${hlmH4} mt-12">Why spartan/ui?</h3>
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
			<h3 id="initial-alpha__brain" class="${hlmH4} mt-12">spartan/ui/brain</h3>
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
			<h3 id="initial-alpha__helm" class="${hlmH4} mt-12">spartan/ui/helm</h3>
			<p class="${hlmP}">
				On top of these brain components we put our helmet. Our helmet adds SPARTAN-like swagger to our UI.
			</p>
			<p class="${hlmP}">
				Unlike it's brain counterparts,
				<code class="${hlmCode}">spartan/ui/helm</code>
				primitives are not libraries. Instead, just like with shadcn, they are recipes, which code you can copy directly
				into your own project.
			</p>
			<h3 id="initial-alpha__nx" class="${hlmH4} mt-12">Powered by &#64;spartan-ng/nx</h3>
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
			<h3 id="initial-alpha__initial_30" class="${hlmH4} mt-12">The initial 30</h3>
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
			<h3 id="initial-alpha__getting_started" class="${hlmH4} mt-12">Getting Started</h3>
			<p class="${hlmP}">
				Excited to try any of these? What are you waiting for? Head over to the installation page and start your spartan
				journey!
			</p>
			<div class="m-10 flex items-center justify-center">
				<a hlmBtn size="lg" routerLink="/documentation/installation">Get started with spartan/ui</a>
			</div>
			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="about" label="About" />
				<spartan-page-bottom-nav-link direction="previous" href="components-json" label="components.json" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class ChangelogPageComponent {}
