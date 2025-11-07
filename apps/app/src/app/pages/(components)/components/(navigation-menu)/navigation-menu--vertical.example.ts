import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronDown, lucideCircle, lucideInfo, lucideLink } from '@ng-icons/lucide';
import { BrnNavigationMenuImports } from '@spartan-ng/brain/navigation-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';

@Component({
	selector: 'spartan-navigation-menu-vertical',
	imports: [HlmNavigationMenuImports, BrnNavigationMenuImports, HlmIconImports],
	providers: [provideIcons({ lucideChevronDown, lucideLink, lucideCircle, lucideCheck, lucideInfo })],
	template: `
		<nav hlmNavigationMenu orientation="vertical">
			<ul hlmNavigationMenuList class="w-35 flex-wrap">
				<li hlmNavigationMenuItem class="w-full">
					<button hlmNavigationMenuTrigger class="w-full">
						Home
						<ng-icon
							name="lucideChevronDown"
							class="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
						/>
					</button>
					<div hlmNavigationMenuContent *brnNavigationMenuContent>
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
									<div class="text-sm leading-none font-medium">Introduction</div>
									<p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
										Re-usable components built using Radix UI and Tailwind CSS.
									</p>
								</a>
							</li>
							<li>
								<a hlmNavigationMenuLink href="/documentation/installation">
									<div class="text-sm leading-none font-medium">Installation</div>
									<p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
										How to install dependencies and structure your app.
									</p>
								</a>
							</li>
							<li>
								<a hlmNavigationMenuLink href="/documentation/typography">
									<div class="text-sm leading-none font-medium">Typography</div>
									<p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
										Styles for headings, paragraphs, lists...etc
									</p>
								</a>
							</li>
						</ul>
					</div>
				</li>

				<!-- Components Menu -->
				<li hlmNavigationMenuItem class="w-full">
					<button hlmNavigationMenuTrigger class="w-full">
						Components
						<ng-icon
							name="lucideChevronDown"
							class="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
						/>
					</button>
					<div hlmNavigationMenuContent *brnNavigationMenuContent>
						<ul class="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
							@for (component of _components; track $index) {
								<li>
									<a hlmNavigationMenuLink [href]="component.href">
										<div class="text-sm leading-none font-medium">{{ component.title }}</div>
										<p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
											{{ component.description }}
										</p>
									</a>
								</li>
							}
						</ul>
					</div>
				</li>

				<li hlmNavigationMenuItem class="w-full">
					<a hlmNavigationMenuLink class="w-full text-center" href="/documentation/introduction">Docs</a>
				</li>

				<li hlmNavigationMenuItem class="w-full">
					<button hlmNavigationMenuTrigger class="w-full">
						List
						<ng-icon
							name="lucideChevronDown"
							class="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
						/>
					</button>
					<div hlmNavigationMenuContent *brnNavigationMenuContent>
						<ul class="grid w-[300px] gap-4">
							<li>
								<a hlmNavigationMenuLink class="cursor-pointer">
									<div class="font-medium">Components</div>
									<div class="text-muted-foreground">Browse all components in the library.</div>
								</a>
								<a hlmNavigationMenuLink class="cursor-pointer">
									<div class="font-medium">Documentation</div>
									<div class="text-muted-foreground">Learn how to use the library.</div>
								</a>
								<a hlmNavigationMenuLink class="cursor-pointer">
									<div class="font-medium">Blog</div>
									<div class="text-muted-foreground">Read our latest blog posts.</div>
								</a>
							</li>
						</ul>
					</div>
				</li>

				<li hlmNavigationMenuItem class="w-full">
					<button hlmNavigationMenuTrigger class="w-full">
						Simple
						<ng-icon
							name="lucideChevronDown"
							class="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
						/>
					</button>
					<div hlmNavigationMenuContent *brnNavigationMenuContent>
						<ul class="grid w-[200px] gap-4">
							<li>
								<a hlmNavigationMenuLink class="cursor-pointer">Components</a>
								<a hlmNavigationMenuLink class="cursor-pointer">Documentation</a>
								<a hlmNavigationMenuLink class="cursor-pointer">Blocks</a>
							</li>
						</ul>
					</div>
				</li>

				<li hlmNavigationMenuItem class="w-full">
					<button hlmNavigationMenuTrigger class="w-full">
						With Icon
						<ng-icon
							name="lucideChevronDown"
							class="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
						/>
					</button>
					<div hlmNavigationMenuContent *brnNavigationMenuContent>
						<ul class="grid w-[200px] gap-4">
							<li>
								<a hlmNavigationMenuLink class="cursor-pointer flex-row items-center gap-2">
									<ng-icon name="lucideInfo" />
									Backlog
								</a>
								<a hlmNavigationMenuLink class="cursor-pointer flex-row items-center gap-2">
									<ng-icon name="lucideCircle" />
									To Do
								</a>
								<a hlmNavigationMenuLink class="cursor-pointer flex-row items-center gap-2">
									<ng-icon name="lucideCheck" />
									Done
								</a>
							</li>
						</ul>
					</div>
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

export const defaultImports = `
import { BrnNavigationMenuImports } from '@spartan-ng/brain/navigation-menu';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';
`;

export const defaultSkeleton = `
<nav hlmNavigationMenu>
	<ul hlmNavigationMenuList>
		<li hlmNavigationMenuItem>
			<button hlmNavigationMenuTrigger>Home</button>
			<div hlmNavigationMenuContent *brnNavigationMenuContent>
				<div>Content</div>
			</div>
		<li>
	</ul>
</nav>
`;
