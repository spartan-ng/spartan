import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronDown, lucideCircle, lucideInfo, lucideLink } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';

@Component({
	selector: 'spartan-navigation-menu-preview',
	imports: [HlmNavigationMenuImports, HlmIconImports],
	providers: [provideIcons({ lucideChevronDown, lucideLink, lucideCircle, lucideCheck, lucideInfo })],
	template: `
		<nav hlmNavigationMenu>
			<ul hlmNavigationMenuList class="flex-wrap">
				<li hlmNavigationMenuItem>
					<button hlmNavigationMenuTrigger>
						Getting started
						<ng-icon
							name="lucideChevronDown"
							class="relative top-px ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
						/>
					</button>
					<hlm-navigation-menu-content *hlmNavigationMenuPortal>
						<ul class="w-96">
							<li>
								<a hlmNavigationMenuLink href="/">
									<div class="flex flex-col gap-1 text-sm">
										<div class="leading-none font-medium">Introduction</div>
										<div class="text-muted-foreground line-clamp-2">Re-usable components built with Tailwind CSS.</div>
									</div>
								</a>
							</li>

							<li>
								<a hlmNavigationMenuLink href="/">
									<div class="flex flex-col gap-1 text-sm">
										<div class="leading-none font-medium">Installation</div>
										<div class="text-muted-foreground line-clamp-2">
											How to install dependencies and structure your app.
										</div>
									</div>
								</a>
							</li>
							<li>
								<a hlmNavigationMenuLink href="/">
									<div class="flex flex-col gap-1 text-sm">
										<div class="leading-none font-medium">Typography</div>
										<div class="text-muted-foreground line-clamp-2">Styles for headings, paragraphs, lists...etc</div>
									</div>
								</a>
							</li>
						</ul>
					</hlm-navigation-menu-content>
				</li>

				<!-- Components Menu -->
				<li hlmNavigationMenuItem class="hidden md:flex">
					<button hlmNavigationMenuTrigger>
						Components
						<ng-icon
							name="lucideChevronDown"
							class="relative top-px ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
						/>
					</button>
					<hlm-navigation-menu-content *hlmNavigationMenuPortal>
						<ul class="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
							@for (component of _components; track $index) {
								<li>
									<a hlmNavigationMenuLink [href]="component.href">
										<div class="flex flex-col gap-1 text-sm">
											<div class="leading-none font-medium">{{ component.title }}</div>
											<div class="text-muted-foreground line-clamp-2">{{ component.description }}</div>
										</div>
									</a>
								</li>
							}
						</ul>
					</hlm-navigation-menu-content>
				</li>

				<li hlmNavigationMenuItem>
					<button hlmNavigationMenuTrigger>
						With Icon
						<ng-icon
							name="lucideChevronDown"
							class="relative top-px ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
						/>
					</button>
					<hlm-navigation-menu-content *hlmNavigationMenuPortal>
						<ul class="grid w-[200px]">
							<li>
								<a hlmNavigationMenuLink href="#" class="flex-row items-center gap-2">
									<ng-icon name="lucideInfo" />
									Backlog
								</a>
								<a hlmNavigationMenuLink href="#" class="flex-row items-center gap-2">
									<ng-icon name="lucideCircle" />
									To Do
								</a>
								<a hlmNavigationMenuLink href="#" class="flex-row items-center gap-2">
									<ng-icon name="lucideCheck" />
									Done
								</a>
							</li>
						</ul>
					</hlm-navigation-menu-content>
				</li>

				<li hlmNavigationMenuItem>
					<a hlmNavigationMenuLink href="/documentation/introduction">Docs</a>
				</li>
			</ul>
		</nav>
	`,
})
export class NavigationMenuPreview {
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
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';
`;

export const defaultSkeleton = `
<nav hlmNavigationMenu>
	<ul hlmNavigationMenuList>
		<li hlmNavigationMenuItem>
			<button hlmNavigationMenuTrigger>Home</button>
			<hlm-navigation-menu-content *hlmNavigationMenuPortal>
				<div>Content</div>
			</hlm-navigation-menu-content>
		<li>
	</ul>
</nav>
`;
