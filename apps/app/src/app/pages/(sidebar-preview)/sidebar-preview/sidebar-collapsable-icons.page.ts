import { Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
	lucideBadgeCheck,
	lucideBell,
	lucideBookOpen,
	lucideBot,
	lucideChartPie,
	lucideChevronRight,
	lucideChevronsUpDown,
	lucideCreditCard,
	lucideEllipsis,
	lucideFolder,
	lucideFrame,
	lucideGalleryVerticalEnd,
	lucideLifeBuoy,
	lucideLogOut,
	lucideMap,
	lucideSend,
	lucideSettings2,
	lucideShare,
	lucideSparkles,
	lucideSquareTerminal,
	lucideTrash2,
} from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-sidebar-collapsable-icons',
	imports: [
		HlmSidebarImports,
		HlmIconImports,
		HlmCollapsibleImports,
		RouterLink,
		HlmAvatarImports,
		HlmDropdownMenuImports,
	],
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
			lucideSparkles,
			lucideBadgeCheck,
			lucideCreditCard,
			lucideBell,
			lucideLogOut,
			lucideEllipsis,
			lucideFolder,
			lucideShare,
			lucideTrash2,
		}),
	],
	encapsulation: ViewEncapsulation.None,
	styleUrl: 'sidebar-default.css',
	template: `
		<div hlmSidebarWrapper>
			<hlm-sidebar collapsible="icon">
				<hlm-sidebar-header>
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
				</hlm-sidebar-header>
				<hlm-sidebar-content>
					<hlm-sidebar-group>
						<div hlmSidebarGroupLabel>Platform</div>
						<ul hlmSidebarMenu>
							@for (item of _platforms; track $index) {
								<hlm-collapsible [expanded]="item.isActive ?? false" class="group/collapsible">
									<li hlmSidebarMenuItem>
										<button hlmSidebarMenuButton hlmCollapsibleTrigger>
											<ng-icon [name]="item.icon" />
											{{ item.title }}
											<ng-icon
												name="lucideChevronRight"
												class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
											/>
										</button>

										<hlm-collapsible-content>
											<ul hlmSidebarMenuSub>
												@for (subItem of item.items; track $index) {
													<li hlmSidebarMenuSubItem>
														<a hlmSidebarMenuSubButton [routerLink]="subItem.url">{{ subItem.title }}</a>
													</li>
												}
											</ul>
										</hlm-collapsible-content>
									</li>
								</hlm-collapsible>
							}
						</ul>
					</hlm-sidebar-group>
					<hlm-sidebar-group class="group-data-[collapsible=icon]:hidden">
						<div hlmSidebarGroupLabel>Projects</div>
						<ul hlmSidebarMenu>
							@for (project of _projects; track $index) {
								<li hlmSidebarMenuItem>
									<a hlmSidebarMenuButton [routerLink]="project.url">
										<ng-icon [name]="project.icon" />
										{{ project.name }}
									</a>
									<button
										hlmSidebarMenuAction
										showOnHover
										[hlmDropdownMenuTrigger]="projectMenu"
										[hlmDropdownMenuTriggerData]="{ $implicit: { project } }"
										[side]="_menuSide()"
										[align]="_menuAlign()"
									>
										<ng-icon name="lucideEllipsis" />
										<span class="sr-only">More</span>
									</button>
								</li>
							}
							<li hlmSidebarMenuItem>
								<button hlmSidebarMenuButton>
									<ng-icon name="lucideEllipsis" />
									More
								</button>
							</li>
						</ul>
					</hlm-sidebar-group>

					<ng-template #projectMenu let-ctx>
						<hlm-dropdown-menu class="w-48">
							<hlm-dropdown-menu-group>
								<hlm-dropdown-menu-label>{{ ctx.project.name }}</hlm-dropdown-menu-label>
							</hlm-dropdown-menu-group>
							<hlm-dropdown-menu-separator />
							<button hlmDropdownMenuItem>
								<ng-icon name="lucideFolder" />
								View Project
							</button>
							<button hlmDropdownMenuItem>
								<ng-icon name="lucideShare" />
								Share Project
							</button>
							<hlm-dropdown-menu-separator />
							<button hlmDropdownMenuItem>
								<ng-icon name="lucideTrash2" />
								Delete Project
							</button>
						</hlm-dropdown-menu>
					</ng-template>
				</hlm-sidebar-content>
				<hlm-sidebar-footer>
					<ul hlmSidebarMenu>
						<li hlmSidebarMenuItem>
							<button
								hlmSidebarMenuButton
								size="lg"
								[hlmDropdownMenuTrigger]="avatarMenu"
								[side]="_menuSide()"
								align="end"
							>
								<hlm-avatar class="rounded-lg">
									<img src="/assets/avatar.png" alt="spartan" hlmAvatarImage />
									<span class="rounded-lg bg-[#FD005B] text-white" hlmAvatarFallback>RG</span>
								</hlm-avatar>
								<div class="grid flex-1 text-left text-sm leading-tight">
									<span class="truncate font-medium">spartan</span>
									<span class="truncate text-xs">hello@spartan.com</span>
								</div>
								<ng-icon name="lucideChevronsUpDown" class="ml-auto text-base" />
							</button>
						</li>
					</ul>

					<ng-template #avatarMenu>
						<hlm-dropdown-menu class="min-w-56 rounded-lg">
							<hlm-dropdown-menu-label>
								<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<hlm-avatar class="rounded-lg">
										<img src="/assets/avatar.png" alt="spartan" hlmAvatarImage />
										<span class="rounded-lg bg-[#FD005B] text-white" hlmAvatarFallback>RG</span>
									</hlm-avatar>
									<div class="grid flex-1 text-left text-sm leading-tight">
										<span class="truncate font-medium">spartan</span>
										<span class="truncate text-xs">hello@spartan.com</span>
									</div>
								</div>
							</hlm-dropdown-menu-label>
							<hlm-dropdown-menu-separator />
							<hlm-dropdown-menu-group>
								<button hlmDropdownMenuItem>
									<ng-icon name="lucideSparkles" />
									Upgrade to Pro
								</button>
							</hlm-dropdown-menu-group>
							<hlm-dropdown-menu-separator />
							<hlm-dropdown-menu-group>
								<button hlmDropdownMenuItem>
									<ng-icon name="lucideBadgeCheck" />
									Account
								</button>
								<button hlmDropdownMenuItem>
									<ng-icon name="lucideCreditCard" />
									Billing
								</button>
								<button hlmDropdownMenuItem>
									<ng-icon name="lucideBell" />
									Notifications
								</button>
							</hlm-dropdown-menu-group>
							<hlm-dropdown-menu-separator />
							<button hlmDropdownMenuItem>
								<ng-icon name="lucideLogOut" />
								Log out
							</button>
						</hlm-dropdown-menu>
					</ng-template>
				</hlm-sidebar-footer>
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
					<div class="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min"></div>
				</div>
			</main>
		</div>
	`,
})
export default class SidebarCollapsableIconsPage {
	private readonly _sidebarService = inject(HlmSidebarService);
	protected readonly _menuSide = computed(() => (this._sidebarService.isMobile() ? 'top' : 'right'));
	protected readonly _menuAlign = computed(() => (this._sidebarService.isMobile() ? 'end' : 'start'));
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

	protected readonly _projects = [
		{
			name: 'Design Engineering',
			url: '.',
			icon: 'lucideFrame',
		},
		{
			name: 'Sales & Marketing',
			url: '.',
			icon: 'lucideChartPie',
		},
		{
			name: 'Travel',
			url: '.',
			icon: 'lucideMap',
		},
	];
}
