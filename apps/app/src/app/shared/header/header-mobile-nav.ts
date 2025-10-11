import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu, lucideX } from '@ng-icons/lucide';
import { sidenavItems } from '@spartan-ng/app/app/shared/components/navigation-items';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { BrnSheetContent, BrnSheetTrigger } from '@spartan-ng/brain/sheet';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmScrollArea } from '@spartan-ng/helm/scroll-area';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmSidebarMenuButton } from '@spartan-ng/helm/sidebar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SideNavContent } from '../layout/side-nav/side-nav-content';
import { SpartanLogo } from '../spartan-logo';

@Component({
	selector: 'spartan-mobile-nav',
	imports: [
		BrnSheetTrigger,
		BrnSheetContent,
		HlmSheetImports,
		HlmButton,
		NgIcon,
		HlmIcon,
		SideNavContent,
		HlmScrollArea,
		NgScrollbarModule,
		RouterLink,
		SpartanLogo,
		BrnPopoverImports,
		HlmPopoverImports,
		HlmSidebarMenuButton,
		HlmBadgeImports,
	],
	providers: [provideIcons({ lucideMenu, lucideX })],
	template: `
		<brn-popover align="start" sideOffset="56">
			<button
				hlmBtn
				brnPopoverTrigger
				(click)="_toggleOpen()"
				variant="ghost"
				class="extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 !p-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent"
			>
				<div class="relative flex h-8 w-4 items-center justify-center">
					<div class="relative size-4">
						<span
							[class]="'bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100 ' + _burgerClass()"
						></span>
						<span
							[class]="'bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100 ' + _closeClass()"
						></span>
					</div>
					<span class="sr-only">Toggle Menu</span>
				</div>
				<span class="flex h-8 items-center text-lg leading-none font-medium">Menu</span>
			</button>

			<div
				hlmPopoverContent
				class="bg-background/90 no-scrollbar h-screen w-screen overflow-y-auto rounded-none border-none p-0 shadow-none backdrop-blur duration-100"
				*brnPopoverContent="let ctx"
			>
				<div class="flex flex-col gap-12 overflow-auto px-6 py-6 [&_a]:text-2xl [&_a]:font-medium">
					<div class="flex flex-col gap-4">
						<div class="text-muted-foreground text-sm font-medium">Menu</div>
						<a routerLink="/">Home</a>
						<a routerLink="/documentation">Docs</a>
						<a routerLink="/stack">Stack</a>
						<a routerLink="/components">Components</a>
						<a routerLink="/examples">Examples</a>
					</div>

					@for (item of _navItems; track item.label) {
						<div class="flex flex-col gap-4">
							<div class="text-muted-foreground text-sm font-medium">{{ item.label }}</div>
							@for (link of item.links; track link.url) {
								<a [routerLink]="item.url + link.url" class="inline-flex items-center gap-2">
									{{ link.label }}
									@if (link.new) {
										<span class="flex size-2 rounded-full bg-blue-500"></span>
									}
									@if (link.wip) {
										<span hlmBadge>soon</span>
									}
								</a>
							}
						</div>
					}
				</div>
			</div>
		</brn-popover>
	`,
})
export class HeaderMobileNav {
	protected readonly _isOpen = signal(false);
	protected readonly _burgerClass = computed(() => (this._isOpen() ? 'top-[0.4rem] -rotate-45' : 'top-1'));
	protected readonly _closeClass = computed(() => (this._isOpen() ? 'top-[0.4rem] rotate-45' : 'top-2'));

	protected _toggleOpen(): void {
		this._isOpen.update((open) => !open);
	}

	protected readonly _navItems = sidenavItems;
}
