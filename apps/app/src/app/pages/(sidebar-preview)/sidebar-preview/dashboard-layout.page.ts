import { Component, ViewEncapsulation } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	tablerCamera,
	tablerChartBar,
	tablerCirclePlus,
	tablerCreditCard,
	tablerDashboard,
	tablerDatabase,
	tablerDots,
	tablerDotsVertical,
	tablerFileAi,
	tablerFileDescription,
	tablerFileWord,
	tablerFolder,
	tablerFolders,
	tablerHelp,
	tablerInnerShadowTop,
	tablerListDetails,
	tablerLogout,
	tablerNotification,
	tablerReport,
	tablerSearch,
	tablerSettings,
	tablerShare3,
	tablerTrash,
	tablerUserCircle,
	tablerUsers,
} from '@ng-icons/tabler-icons';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { DashboardCardSection } from '../../(home)/components/dashboard/components/card-section';
import { DashboardTableSection } from '../../(home)/components/dashboard/components/table-section';

@Component({
	selector: 'spartan-dashboard-layout',
	imports: [
		HlmSidebarImports,
		NgIcon,
		HlmIcon,
		HlmDropdownMenuImports,
		HlmAvatarImports,
		HlmButton,
		DashboardCardSection,
		DashboardTableSection,
	],
	providers: [
		provideIcons({
			tablerInnerShadowTop,
			tablerDashboard,
			tablerListDetails,
			tablerChartBar,
			tablerFolder,
			tablerUsers,
			tablerCamera,
			tablerFileDescription,
			tablerFileAi,
			tablerSettings,
			tablerHelp,
			tablerSearch,
			tablerDatabase,
			tablerReport,
			tablerFileWord,
			tablerDots,
			tablerFolders,
			tablerShare3,
			tablerTrash,
			tablerDotsVertical,
			tablerUserCircle,
			tablerCreditCard,
			tablerNotification,
			tablerLogout,
			tablerCirclePlus,
		}),
	],
	encapsulation: ViewEncapsulation.None,
	styles: [
		`
			[hlmSidebarWrapper] {
				--sidebar-width: calc(var(--spacing) * 64);
				--header-height: calc(var(--spacing) * 12 + 1px);
			}
		`,
	],
	styleUrl: 'sidebar-default.css',
	template: `
		<div hlmSidebarWrapper>
			<hlm-sidebar>
				<div hlmSidebarHeader class="border-b">
					<ul hlmSidebarMenu>
						<a hlmSidebarMenuButton class="!p-1.5">
							<ng-icon hlm name="tablerInnerShadowTop" class="!size-5" />
							<span class="text-base font-semibold">Acme Inc.</span>
						</a>
					</ul>
				</div>
				<div hlmSidebarContent>
					<div hlmSidebarGroup>
						<div hlmSidebarGroupLabel>Home</div>
						<div hlmSidebarGroupContent>
							<ul hlmSidebarMenu>
								@for (item of _items.navMain; track item.title) {
									<li hlmSidebarMenuItem>
										<a hlmSidebarMenuButton>
											<ng-icon hlm [name]="item.icon" />
											<span>{{ item.title }}</span>
										</a>
									</li>
								}
							</ul>
						</div>
					</div>
					<div hlmSidebarGroup>
						<div hlmSidebarGroupLabel>Home</div>
						<div hlmSidebarGroupContent>
							<ul hlmSidebarMenu>
								@for (item of _items.documents; track item.name) {
									<li hlmSidebarMenuItem>
										<a hlmSidebarMenuButton>
											<ng-icon hlm [name]="item.icon" />
											<span>{{ item.name }}</span>
										</a>
										<button hlmSidebarMenuAction [showOnHover]="true" [hlmDropdownMenuTrigger]="menu">
											<ng-icon hlm name="tablerDots" />
											<span class="sr-only">More</span>
										</button>
									</li>
								}
								<li hlmSidebarMenuItem>
									<a hlmSidebarMenuButton class="text-sidebar-foreground/70">
										<ng-icon hlm name="tablerDots" class="text-sidebar-foreground/70" />
										<span>More</span>
									</a>
								</li>
								<ng-template #menu>
									<hlm-dropdown-menu class="w-24 rounded-lg">
										<button hlmDropdownMenuItem>
											<ng-icon hlm name="tablerFolder" size="sm" />
											<span>Open</span>
										</button>

										<button hlmDropdownMenuItem>
											<ng-icon hlm name="tablerShare3" size="sm" />
											<span>Share</span>
										</button>
										<hlm-dropdown-menu-separator />
										<button hlmDropdownMenuItem variant="destructive">
											<ng-icon hlm name="tablerTrash" size="sm" />
											<span>Delete</span>
										</button>
									</hlm-dropdown-menu>
								</ng-template>
							</ul>
						</div>
					</div>
					<div hlmSidebarGroup class="mt-auto">
						<div hlmSidebarGroupContent>
							<ul hlmSidebarMenu>
								@for (item of _items.navSecondary; track item.title) {
									<li hlmSidebarMenuItem>
										<a hlmSidebarMenuButton>
											<ng-icon hlm [name]="item.icon" />
											<span>{{ item.title }}</span>
										</a>
									</li>
								}
							</ul>
						</div>
					</div>
				</div>
				<div hlmSidebarFooter>
					<ul hlmSidebarMenu>
						<li hlmSidebarMenuItem>
							<a
								hlmSidebarMenuButton
								size="lg"
								class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								[hlmDropdownMenuTrigger]="userMenu"
							>
								<hlm-avatar class="size-8 rounded-lg grayscale">
									<img [src]="_items.user.avatar" alt="spartan logo. Resembling a spartanic shield" hlmAvatarImage />
									<span class="rounded-lg bg-[#FD005B] text-white" hlmAvatarFallback>SP</span>
								</hlm-avatar>
								<div class="grid flex-1 text-left text-sm leading-tight">
									<span class="truncate font-medium">{{ _items.user.name }}</span>
									<span class="text-muted-foreground truncate text-xs">
										{{ _items.user.email }}
									</span>
								</div>
								<ng-icon hlm name="tablerDotsVertical" class="ml-auto size-4" />
							</a>
						</li>
					</ul>
					<ng-template #userMenu>
						<hlm-dropdown-menu class="min-w-56 rounded-lg">
							<hlm-dropdown-menu-label class="p-0 font-normal">
								<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<hlm-avatar class="size-8 rounded-lg">
										<img [src]="_items.user.avatar" alt="spartan logo. Resembling a spartanic shield" hlmAvatarImage />
										<span class="rounded-lg bg-[#FD005B] text-white" hlmAvatarFallback>SP</span>
									</hlm-avatar>
									<div class="grid flex-1 text-left text-sm leading-tight">
										<span class="truncate font-medium">{{ _items.user.name }}</span>
										<span class="text-muted-foreground truncate text-xs">
											{{ _items.user.email }}
										</span>
									</div>
								</div>
							</hlm-dropdown-menu-label>
							<hlm-dropdown-menu-separator />
							<hlm-dropdown-menu-group>
								<button hlmDropdownMenuItem>
									<ng-icon hlm name="tablerUserCircle" size="sm" />
									<span>Account</span>
								</button>
								<button hlmDropdownMenuItem>
									<ng-icon hlm name="tablerCreditCard" size="sm" />
									<span>Billing</span>
								</button>
								<button hlmDropdownMenuItem>
									<ng-icon hlm name="tablerNotification" size="sm" />
									<span>Notifications</span>
								</button>
							</hlm-dropdown-menu-group>
							<hlm-dropdown-menu-separator />
							<button hlmDropdownMenuItem>
								<ng-icon hlm name="tablerLogout" size="sm" />
								<span>Logout</span>
							</button>
						</hlm-dropdown-menu>
					</ng-template>
				</div>
			</hlm-sidebar>
			<main hlmSidebarInset>
				<header
					class="bg-background/90 sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
				>
					<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
						<h1 class="text-base font-medium">Documents</h1>
						<div class="ml-auto flex items-center gap-2">
							<button hlmBtn size="sm" class="hidden h-7 sm:flex">
								<ng-icon hlm name="tablerCirclePlus" size="sm" />
								<span>Quick Create</span>
							</button>
						</div>
					</div>
				</header>
				<div class="flex flex-1 flex-col">
					<div class="@container/main flex flex-1 flex-col gap-2">
						<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
							<spartan-dashboard-card-section />
							<spartan-dashboard-table-section />
						</div>
					</div>
				</div>
			</main>
		</div>
	`,
})
export default class DashboardLayoutPage {
	protected readonly _items = {
		user: {
			name: 'spartan',
			email: 'me@spartan.ng',
			avatar: '/assets/avatar.png',
		},
		navMain: [
			{
				title: 'Dashboard',
				url: '#',
				icon: 'tablerDashboard',
			},
			{
				title: 'Lifecycle',
				url: '#',
				icon: 'tablerListDetails',
			},
			{
				title: 'Analytics',
				url: '#',
				icon: 'tablerChartBar',
			},
			{
				title: 'Projects',
				url: '#',
				icon: 'tablerFolder',
			},
			{
				title: 'Team',
				url: '#',
				icon: 'tablerUsers',
			},
		],
		navClouds: [
			{
				title: 'Capture',
				icon: 'tablerCamera',
				isActive: true,
				url: '#',
				items: [
					{
						title: 'Active Proposals',
						url: '#',
					},
					{
						title: 'Archived',
						url: '#',
					},
				],
			},
			{
				title: 'Proposal',
				icon: 'tablerFileDescription',
				url: '#',
				items: [
					{
						title: 'Active Proposals',
						url: '#',
					},
					{
						title: 'Archived',
						url: '#',
					},
				],
			},
			{
				title: 'Prompts',
				icon: 'tablerFileAi',
				url: '#',
				items: [
					{
						title: 'Active Proposals',
						url: '#',
					},
					{
						title: 'Archived',
						url: '#',
					},
				],
			},
		],
		navSecondary: [
			{
				title: 'Settings',
				url: '#',
				icon: 'tablerSettings',
			},
			{
				title: 'Get Help',
				url: '#',
				icon: 'tablerHelp',
			},
			{
				title: 'Search',
				url: '#',
				icon: 'tablerSearch',
			},
		],
		documents: [
			{
				name: 'Data Library',
				url: '#',
				icon: 'tablerDatabase',
			},
			{
				name: 'Reports',
				url: '#',
				icon: 'tablerReport',
			},
			{
				name: 'Word Assistant',
				url: '#',
				icon: 'tablerFileWord',
			},
		],
	};
}
