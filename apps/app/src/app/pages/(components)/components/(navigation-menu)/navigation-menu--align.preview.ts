import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';

@Component({
	selector: 'spartan-navigation-menu-align',
	imports: [HlmNavigationMenuImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<nav hlmNavigationMenu>
			<ul hlmNavigationMenuList class="flex-wrap">
				<li hlmNavigationMenuItem>
					<button hlmNavigationMenuTrigger align="start">Start</button>
					<hlm-navigation-menu-content *hlmNavigationMenuPortal>
						<ul class="w-48">
							<li>
								<a hlmNavigationMenuLink href="/">
									<div class="flex flex-col gap-1 text-sm">
										<div class="leading-none font-medium">Aligned Start</div>
										<div class="text-muted-foreground line-clamp-2">Content aligns to the start of the trigger.</div>
									</div>
								</a>
							</li>
						</ul>
					</hlm-navigation-menu-content>
				</li>

				<li hlmNavigationMenuItem>
					<button hlmNavigationMenuTrigger align="center">Center</button>
					<hlm-navigation-menu-content *hlmNavigationMenuPortal>
						<ul class="w-48">
							<li>
								<a hlmNavigationMenuLink href="/">
									<div class="flex flex-col gap-1 text-sm">
										<div class="leading-none font-medium">Aligned Center</div>
										<div class="text-muted-foreground line-clamp-2">Content aligns to the center of the trigger.</div>
									</div>
								</a>
							</li>
						</ul>
					</hlm-navigation-menu-content>
				</li>

				<li hlmNavigationMenuItem>
					<button hlmNavigationMenuTrigger align="end">End</button>
					<hlm-navigation-menu-content *hlmNavigationMenuPortal>
						<ul class="w-48">
							<li>
								<a hlmNavigationMenuLink href="/">
									<div class="flex flex-col gap-1 text-sm">
										<div class="leading-none font-medium">Aligned End</div>
										<div class="text-muted-foreground line-clamp-2">Content aligns to the end of the trigger.</div>
									</div>
								</a>
							</li>
						</ul>
					</hlm-navigation-menu-content>
				</li>
			</ul>
		</nav>
	`,
})
export class NavigationMenuAlign {}
