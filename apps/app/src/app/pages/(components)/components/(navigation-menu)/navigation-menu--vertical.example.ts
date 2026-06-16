import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCircle, lucideInfo, lucideLink } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';

@Component({
	selector: 'spartan-navigation-menu-vertical',
	imports: [HlmNavigationMenuImports, HlmIconImports],
	providers: [provideIcons({ lucideLink, lucideCircle, lucideCheck, lucideInfo })],
	template: `
		<nav hlmNavigationMenu orientation="vertical">
			<ul hlmNavigationMenuList class="w-35 flex-wrap">
				<li hlmNavigationMenuItem>
					<button hlmNavigationMenuTrigger>Home</button>
					<hlm-navigation-menu-content *hlmNavigationMenuPortal>
						<ul class="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
							<li class="row-span-3">
								<a
									hlmNavigationMenuLink
									class="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden select-none focus:shadow-md md:p-6"
									href="/"
								>
									<div class="mb-2 text-lg font-medium sm:mt-4">spartan.ng</div>
									<p class="text-muted-foreground text-sm leading-tight">
										Beautifully designed components built with Tailwind CSS.
									</p>
								</a>
							</li>

							<li>
								<a hlmNavigationMenuLink href="/documentation/introduction">
									<div class="flex flex-col gap-1 text-sm">
										<div class="text-sm leading-none font-medium">Introduction</div>
										<p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
											Re-usable components built using Radix UI and Tailwind CSS.
										</p>
									</div>
								</a>
							</li>
							<li>
								<a hlmNavigationMenuLink href="/documentation/installation">
									<div class="flex flex-col gap-1 text-sm">
										<div class="text-sm leading-none font-medium">Installation</div>
										<p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
											How to install dependencies and structure your app.
										</p>
									</div>
								</a>
							</li>
							<li>
								<a hlmNavigationMenuLink href="/documentation/typography">
									<div class="flex flex-col gap-1 text-sm">
										<div class="text-sm leading-none font-medium">Typography</div>
										<p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
											Styles for headings, paragraphs, lists...etc
										</p>
									</div>
								</a>
							</li>
						</ul>
					</hlm-navigation-menu-content>
				</li>

				<!-- Components Menu -->
				<li hlmNavigationMenuItem>
					<button hlmNavigationMenuTrigger>Components</button>
					<hlm-navigation-menu-content *hlmNavigationMenuPortal>
						<ul class="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
							@for (component of _components; track $index) {
								<li>
									<a hlmNavigationMenuLink [href]="component.href">
										<div class="flex flex-col gap-1 text-sm">
											<div class="text-sm leading-none font-medium">{{ component.title }}</div>
											<p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
												{{ component.description }}
											</p>
										</div>
									</a>
								</li>
							}
						</ul>
					</hlm-navigation-menu-content>
				</li>

				<li hlmNavigationMenuItem>
					<a hlmNavigationMenuLink class="mx-auto" href="/documentation/introduction">Docs</a>
				</li>

				<li hlmNavigationMenuItem>
					<button hlmNavigationMenuTrigger>List</button>
					<hlm-navigation-menu-content *hlmNavigationMenuPortal>
						<ul>
							<li>
								<a hlmNavigationMenuLink href="/components">
									<div class="flex flex-col gap-1 text-sm">
										<div class="font-medium">Components</div>
										<div class="text-muted-foreground">Browse all components in the library.</div>
									</div>
								</a>
								<a hlmNavigationMenuLink href="/documentation">
									<div class="flex flex-col gap-1 text-sm">
										<div class="font-medium">Documentation</div>
										<div class="text-muted-foreground">Learn how to use the library.</div>
									</div>
								</a>
								<a hlmNavigationMenuLink href="#">
									<div class="flex flex-col gap-1 text-sm">
										<div class="font-medium">Blog</div>
										<div class="text-muted-foreground">Read our latest blog posts.</div>
									</div>
								</a>
							</li>
						</ul>
					</hlm-navigation-menu-content>
				</li>

				<li hlmNavigationMenuItem>
					<button hlmNavigationMenuTrigger>Simple</button>
					<hlm-navigation-menu-content *hlmNavigationMenuPortal>
						<ul>
							<li>
								<a hlmNavigationMenuLink href="/components">Components</a>
								<a hlmNavigationMenuLink href="/documentation">Documentation</a>
								<a hlmNavigationMenuLink href="/blocks">Blocks</a>
							</li>
						</ul>
					</hlm-navigation-menu-content>
				</li>

				<li hlmNavigationMenuItem>
					<button hlmNavigationMenuTrigger>With Icon</button>
					<hlm-navigation-menu-content *hlmNavigationMenuPortal>
						<ul>
							<li>
								<a hlmNavigationMenuLink href="#">
									<ng-icon name="lucideInfo" />
									Backlog
								</a>
								<a hlmNavigationMenuLink href="#">
									<ng-icon name="lucideCircle" />
									To Do
								</a>
								<a hlmNavigationMenuLink href="#">
									<ng-icon name="lucideCheck" />
									Done
								</a>
							</li>
						</ul>
					</hlm-navigation-menu-content>
				</li>
			</ul>
		</nav>
	`,
})
export class NavigationMenuVertical {
	protected readonly _components = [
		{
			title: 'Alert Dialog',
			description: 'A modal dialog that interrupts the user with important content and expects a response.',
			href: '/components/alert-dialog',
		},
		{
			title: 'Hover Card',
			description: 'For sighted users to preview content available behind a link.',
			href: '/components/hover-card',
		},
		{
			title: 'Progress',
			description: 'Displays an indicator showing the completion progress of a task.',
			href: '/components/progress',
		},
		{
			title: 'Scroll Area',
			description: 'Visually or semantically separates content.',
			href: '/components/scroll-area',
		},
		{
			title: 'Tabs',
			description: 'A set of layered content panels displayed one at a time.',
			href: '/components/tabs',
		},
		{
			title: 'Tooltip',
			description: 'A popup that displays information on hover or focus.',
			href: '/components/tooltip',
		},
	];
}
