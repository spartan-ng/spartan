import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCircle, lucideInfo } from '@ng-icons/lucide';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';

@Component({
	selector: 'spartan-navigation-menu-nested',
	imports: [HlmNavigationMenuImports, NgIcon],
	providers: [provideIcons({ lucideCircle, lucideInfo, lucideCheck })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<nav hlmNavigationMenu>
			<ul hlmNavigationMenuList class="flex-wrap">
				<li hlmNavigationMenuItem>
					<button hlmNavigationMenuTrigger>Root</button>
					<hlm-navigation-menu-content *hlmNavigationMenuPortal>
						<nav hlmNavigationMenu orientation="vertical">
							<ul hlmNavigationMenuList class="w-35 flex-wrap">
								<li hlmNavigationMenuItem class="w-full">
									<button hlmNavigationMenuTrigger class="w-full">Home</button>
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
								<li hlmNavigationMenuItem class="w-full">
									<button hlmNavigationMenuTrigger class="w-full">Components</button>
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

								<li hlmNavigationMenuItem class="w-full">
									<button hlmNavigationMenuTrigger class="w-full">List</button>
									<hlm-navigation-menu-content *hlmNavigationMenuPortal>
										<ul class="grid w-[300px] gap-4">
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

								<li hlmNavigationMenuItem class="w-full">
									<button hlmNavigationMenuTrigger class="w-full">Simple</button>
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

								<li hlmNavigationMenuItem class="w-full">
									<button hlmNavigationMenuTrigger class="w-full">With Icon</button>
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
					</hlm-navigation-menu-content>
				</li>

				<li hlmNavigationMenuItem>
					<a hlmNavigationMenuLink href="/documentation/introduction">Docs</a>
				</li>
			</ul>
		</nav>
	`,
})
export class NavigationMenuNested {
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
