import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
	lucideBookOpen,
	lucideBot,
	lucideChartPie,
	lucideChevronRight,
	lucideChevronsUpDown,
	lucideFrame,
	lucideGalleryVerticalEnd,
	lucideLifeBuoy,
	lucideMap,
	lucideSend,
	lucideSettings2,
	lucideSquareTerminal,
} from '@ng-icons/lucide';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-sidebar-collapsable-icons',
	imports: [HlmSidebarImports, HlmIconImports, HlmCollapsibleImports, RouterLink],
	providers: [
		provideIcons({
			lucideFrame,
			lucideChartPie,
			lucideMap,
			lucideLifeBuoy,
			lucideSend,
			lucideGalleryVerticalEnd,
			lucideChevronsUpDown,
			lucideSquareTerminal,
			lucideBot,
			lucideBookOpen,
			lucideSettings2,
			lucideChevronRight,
		}),
	],
	encapsulation: ViewEncapsulation.None,
	styleUrl: 'sidebar-default.css',
	template: `
		<div hlmSidebarWrapper>
			<hlm-sidebar collapsible="icon">
				<div hlmSidebarHeader>
					<ul hlmSidebarMenu>
						<li hlmSidebarMenuItem>
							<button hlmSidebarMenuButton size="lg">
								<div
									class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
								>
									<ng-icon hlm size="sm" name="lucideGalleryVerticalEnd" />
								</div>
								<div class="grid flex-1 text-left text-sm leading-tight">
									<span class="truncate font-medium">Acme Inc</span>
									<span class="truncate text-xs">Enterprise</span>
								</div>
								<ng-icon hlm name="lucideChevronsUpDown" class="ml-auto" />
							</button>
						</li>
					</ul>
				</div>
				<div hlmSidebarContent>
					<hlm-sidebar-group>
						<div hlmSidebarGroupLabel>Platform</div>
						<ul hlmSidebarMenu>
							@for (item of _platforms; track $index) {
								<hlm-collapsible [expanded]="item.isActive ?? false">
									<li hlmSidebarMenuItem>
										<a hlmSidebarMenuButton [routerLink]="item.url">
											<ng-icon [name]="item.icon" />
											{{ item.title }}
										</a>
										@if (item.items; as subItems) {
											<button hlmCollapsibleTrigger hlmSidebarMenuAction class="data-[state=open]:rotate-90">
												<ng-icon name="lucideChevronRight" />
											</button>
											<hlm-collapsible-content>
												<ul hlmSidebarMenuSub>
													@for (subItem of subItems; track $index) {
														<li hlmSidebarMenuSubItem>
															<a hlmSidebarMenuSubButton [routerLink]="subItem.url">{{ subItem.title }}</a>
														</li>
													}
												</ul>
											</hlm-collapsible-content>
										}
									</li>
								</hlm-collapsible>
							}
						</ul>
					</hlm-sidebar-group>
				</div>
			</hlm-sidebar>
			<main hlmSidebarInset>
				<header class="flex h-12 items-center justify-between px-4">
					<button hlmSidebarTrigger><span class="sr-only"></span></button>
				</header>
				<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
					<div class="grid auto-rows-min gap-4 md:grid-cols-3">
						<div class="bg-muted/50 aspect-video rounded-xl"></div>
						<div class="bg-muted/50 aspect-video rounded-xl"></div>
						<div class="bg-muted/50 aspect-video rounded-xl"></div>
					</div>
					<div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min"></div>
				</div>
			</main>
		</div>
	`,
})
export default class SidebarCollapsableIconsPage {
	protected readonly _platforms = [
		{
			title: 'Playground',
			url: '.',
			icon: 'lucideSquareTerminal',
			isActive: true,
			items: [
				{
					title: 'History',
					url: '.',
				},
				{
					title: 'Starred',
					url: '.',
				},
				{
					title: 'Settings',
					url: '.',
				},
			],
		},
		{
			title: 'Models',
			url: '.',
			icon: 'lucideBot',
			items: [
				{
					title: 'Genesis',
					url: '.',
				},
				{
					title: 'Explorer',
					url: '.',
				},
				{
					title: 'Quantum',
					url: '.',
				},
			],
		},
		{
			title: 'Documentation',
			url: '.',
			icon: 'lucideBookOpen',
			items: [
				{
					title: 'Introduction',
					url: '.',
				},
				{
					title: 'Get Started',
					url: '.',
				},
				{
					title: 'Tutorials',
					url: '.',
				},
				{
					title: 'Changelog',
					url: '.',
				},
			],
		},
		{
			title: 'Settings',
			url: '.',
			icon: 'lucideSettings2',
			items: [
				{
					title: 'General',
					url: '.',
				},
				{
					title: 'Team',
					url: '.',
				},
				{
					title: 'Billing',
					url: '.',
				},
				{
					title: 'Limits',
					url: '.',
				},
			],
		},
	];
}
