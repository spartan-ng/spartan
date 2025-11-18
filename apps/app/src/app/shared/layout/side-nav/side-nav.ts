import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { sidenavItems } from '@spartan-ng/app/app/shared/components/navigation-items';
import { SpartanNewMarker } from '@spartan-ng/app/app/shared/spartan-new-marker';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-side-nav',
	imports: [HlmSidebarImports, RouterLink, RouterLinkActive, SpartanNewMarker, HlmBadgeImports],
	host: {
		class: 'contents',
	},
	template: `
		<div
			hlmSidebarWrapper
			class="flex-1 [--sidebar-width:220px]! [--top-spacing:0] lg:[--sidebar-width:240px]! lg:[--top-spacing:calc(var(--spacing)*4)]"
		>
			<hlm-sidebar
				sidebarContainerClass="text-sidebar-foreground sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--footer-height)+2rem-var(--stable-height))] w-(--sidebar-width) flex-col border-r-transparent bg-transparent lg:flex"
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
			<ng-content />
		</div>
	`,
})
export class SideNav {
	protected readonly _items = sidenavItems;
}
