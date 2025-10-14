import { Component } from '@angular/core';
import { BrnNavigationMenuImports } from '@spartan-ng/brain/navigation-menu';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';

@Component({
	selector: 'spartan-navigation-menu-preview',
	imports: [HlmNavigationMenuImports, BrnNavigationMenuImports],
	template: `
		<nav hlmNavigationMenu>
			<ul hlmNavigationMenuList>
				<li hlmNavigationMenuItem>
					<button hlmNavigationMenuTrigger>Home</button>
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
