import { Component, computed, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideMenu, lucideX } from '@ng-icons/lucide';
import { pageNavs, sidenavItems } from '@spartan-ng/app/app/shared/components/navigation-items';
import { SpartanNewMarker } from '@spartan-ng/app/app/shared/spartan-new-marker';
import { BrnPopover, BrnPopoverImports } from '@spartan-ng/brain/popover';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
	selector: 'spartan-mobile-nav',
	imports: [
		HlmButton,
		NgScrollbarModule,
		RouterLink,
		BrnPopoverImports,
		HlmPopoverImports,
		HlmBadgeImports,
		SpartanNewMarker,
	],
	providers: [provideIcons({ lucideMenu, lucideX })],
	template: `
		<hlm-popover align="start" (closed)="_closePopover()" offsetX="-24" sideOffset="12">
			<button
				(click)="_toggleOpen()"
				hlmPopoverTrigger
				hlmBtn
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
				class="no-scrollbar bg-background/90 h-screen w-screen overflow-y-auto rounded-none border-none p-0 shadow-none backdrop-blur duration-100"
				*brnPopoverContent="let ctx"
			>
				<div class="flex flex-col gap-12 overflow-auto px-6 py-6 [&_a]:text-2xl [&_a]:font-medium">
					<div class="flex flex-col gap-4">
						<div class="text-muted-foreground text-sm font-medium">Menu</div>
						@for (pageNav of _pageNavs; track pageNav.url) {
							<a [routerLink]="pageNav.url" class="inline-flex items-center gap-2" (click)="_closePopover()">
								{{ pageNav.label }}
								@if (pageNav.new) {
									<span spartanNewMarker></span>
								}
							</a>
						}
					</div>

					@for (item of _navItems; track item.label) {
						<div class="flex flex-col gap-4">
							<div class="text-muted-foreground text-sm font-medium">{{ item.label }}</div>
							@for (link of item.links; track link.url) {
								<a
									[routerLink]="item.url + link.url"
									class="inline-flex items-center gap-2"
									(click)="_closePopover()"
									[class.opacity-50]="link.wip"
									[class.pointer-events-none]="link.wip"
								>
									{{ link.label }}
									@if (link.new) {
										<span spartanNewMarker></span>
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
		</hlm-popover>
	`,
})
export class HeaderMobileNav {
	protected readonly _popOver = viewChild.required(BrnPopover);
	protected readonly _isOpen = signal(false);
	protected readonly _burgerClass = computed(() => (this._isOpen() ? 'top-[0.4rem] -rotate-45' : 'top-1'));
	protected readonly _closeClass = computed(() => (this._isOpen() ? 'top-[0.4rem] rotate-45' : 'top-2'));

	protected _toggleOpen(): void {
		this._isOpen.update((open) => !open);
	}

	protected readonly _navItems = sidenavItems;
	protected readonly _pageNavs = pageNavs;

	protected _closePopover(): void {
		this._popOver().close();
		this._isOpen.set(false);
	}
}
