import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideLink } from '@ng-icons/lucide';
import { BrnNavigationMenuImports } from '@spartan-ng/brain/navigation-menu';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';

@Component({
	selector: 'spartan-navigation-menu-preview',
	imports: [HlmNavigationMenuImports, BrnNavigationMenuImports, NgIcon],
	providers: [provideIcons({ lucideChevronDown, lucideLink })],
	template: `
		<nav hlmNavigationMenu>
			<ul hlmNavigationMenuList>
				<li hlmNavigationMenuItem>
					<button hlmNavigationMenuTrigger>
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
									class="from-muted/50 to-muted bg-linear-to-b outline-hidden flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline focus:shadow-md"
									href="/"
								>
									<div class="mb-2 mt-4 text-lg font-medium">shadcn/ui</div>
									<p class="text-muted-foreground text-sm leading-tight">
										Beautifully designed components built with Tailwind CSS.
									</p>
								</a>
							</li>
							<li class="line-clamp-2 text-sm leading-snug">
								Re-usable components built using Radix UI and Tailwind CSS.
							</li>
							<li class="line-clamp-2 text-sm leading-snug">How to install dependencies and structure your app.</li>
							<li class="line-clamp-2 text-sm leading-snug">Styles for headings, paragraphs, lists...etc</li>
						</ul>
					</div>
				</li>
				<li hlmNavigationMenuItem>
					<a
						hlmNavigationMenuLink
						disabled
						href="https://github.com"
						target="_blank"
						class="flex-row items-center gap-2"
					>
						<ng-icon name="lucideLink" />
						GitHub
					</a>
				</li>
				<li hlmNavigationMenuItem>
					<button hlmNavigationMenuTrigger>Components</button>
					<div hlmNavigationMenuContent *brnNavigationMenuContent>
						<ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
							<li class="line-clamp-2 text-sm leading-snug">Dialog component</li>
							<nav hlmNavigationMenu class="mt-2 p-3">
								<ul hlmNavigationMenuList class="gap-2">
									<li hlmNavigationMenuItem>
										<button hlmNavigationMenuTrigger>
											Home
											<ng-icon
												name="lucideChevronDown"
												hlm
												class="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
											/>
										</button>
										<div hlmNavigationMenuContent *brnNavigationMenuContent>
											<ul class="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
												<li class="row-span-3">
													<a
														class="from-muted/50 to-muted bg-linear-to-b outline-hidden flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline focus:shadow-md"
														href="/"
													>
														<div class="mb-2 mt-4 text-lg font-medium">shadcn/ui</div>
														<p class="text-muted-foreground text-sm leading-tight">
															Beautifully designed components built with Tailwind CSS.
														</p>
													</a>
												</li>
												<li class="line-clamp-2 text-sm leading-snug">
													Re-usable components built using Radix UI and Tailwind CSS.
												</li>
												<li class="line-clamp-2 text-sm leading-snug">
													How to install dependencies and structure your app.
												</li>
												<li class="line-clamp-2 text-sm leading-snug">Styles for headings, paragraphs, lists...etc</li>
											</ul>
										</div>
									</li>
									<li hlmNavigationMenuItem>
										<button hlmNavigationMenuTrigger>Components</button>
										<div hlmNavigationMenuContent *brnNavigationMenuContent>
											<ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
												<li class="line-clamp-2 text-sm leading-snug">Dialog component</li>
												<li class="line-clamp-2 text-sm leading-snug">Input</li>
												<li class="line-clamp-2 text-sm leading-snug">Form</li>
											</ul>
										</div>
									</li>
								</ul>
							</nav>
						</ul>
					</div>
				</li>
			</ul>
		</nav>
	`,
})
export class NavigationMenuPreview {}

export const codeImports = `
import {

} from '@spartan-ng/helm/navigation-menu';
`;

export const codeString = `import { Component } from '@angular/core';${codeImports}

@Component({
	selector: 'spartan-navigation-menu-preview',
imports: [

	],
	template: \`

	\`,
})
export class NavigationMenuPreviewComponent {}`;

export const codeSkeleton = `

`;
