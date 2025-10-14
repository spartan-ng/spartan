import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Breadcrumbs } from '@spartan-ng/app/app/shared/breadcrumbs/breadcrumbs';

import { sidenavItems } from '@spartan-ng/app/app/shared/components/navigation-items';
import { PageNavOutlet } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav-outlet';
import { SideNav } from '@spartan-ng/app/app/shared/layout/side-nav/side-nav';
import { SpartanNewMarker } from '@spartan-ng/app/app/shared/spartan-new-marker';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-page',
	imports: [
		RouterOutlet,
		SideNav,
		Breadcrumbs,
		PageNavOutlet,
		HlmSidebarImports,
		RouterLinkActive,
		RouterLink,
		HlmBadge,
		SpartanNewMarker,
	],
	template: `
		<div
			hlmSidebarWrapper
			class="flex-1 [--sidebar-width:220px]! [--top-spacing:0] lg:[--sidebar-width:240px]! lg:[--top-spacing:calc(var(--spacing)*4)]"
		>
			<hlm-sidebar
				class="text-sidebar-foreground sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--footer-height)+2rem-var(--stable-height))] w-(--sidebar-width) flex-col border-r-transparent bg-transparent lg:flex"
			>
				<div hlmSidebarContent class="no-scrollbar bg-background overflow-x-hidden px-2 pb-12">
					<div class="h-(--top-spacing) shrink-0"></div>

					@for (item of _items; track item.label) {
						<div hlmSidebarGroup class="px-0">
							<div hlmSidebarGroupLabel class="text-muted-foreground font-medium">{{ item.label }}</div>
							<div hlmSidebarGroupContent>
								<ul hlmSidebarMenu>
									@for (link of item.links; track link.url) {
										<li hlmSidebarMenuItem>
											@if (link.wip) {
												<button disabled hlmSidebarMenuButton class="text-[0.8rem] font-medium">
													<span>
														{{ link.label }}
													</span>
													<span hlmBadge>soon</span>
												</button>
											} @else {
												<a
													hlmSidebarMenuButton
													[routerLink]="item.url + link.url"
													[routerLinkActive]="['bg-accent', 'border-accent']"
													class="text-[0.8rem] font-medium"
												>
													<span class="inline-flex items-center gap-2">
														{{ link.label }}
														@if (link.new) {
															<span spartanNewMarker></span>
														}
													</span>
												</a>
											}
										</li>
									}
								</ul>
							</div>
						</div>
					}
				</div>
			</hlm-sidebar>

			<div class="h-full w-full">
				<div class="flex items-stretch text-[1.05rem] sm:text-[15px] xl:w-full">
					<div class="flex min-w-0 flex-1 flex-col">
						<div class="h-(--top-spacing) shrink-0"></div>
						<div
							class="mx-auto flex w-full max-w-2xl min-w-0 flex-1 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300 [&>*:nth-child(2)]:block [&>*:nth-child(2)]:w-full"
						>
							<router-outlet />
						</div>
					</div>
					<spartan-page-nav-outlet />
				</div>
			</div>
		</div>
	`,
	host: {
		class: 'container-wrapper flex flex-1 flex-col px-2',
	},
})
export class Page {
	protected readonly _items = sidenavItems;
}
