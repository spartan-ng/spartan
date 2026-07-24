import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideCalendar,
	lucideEllipsis,
	lucideHouse,
	lucideInbox,
	lucideMenu,
	lucideSearch,
	lucideSettings,
} from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

const meta: Meta<{}> = {
	title: 'Sidebar',
	tags: ['autodocs'],

	decorators: [
		moduleMetadata({
			imports: [FormsModule, ReactiveFormsModule, HlmSidebarImports],
		}),
	],
};

export default meta;
type Story = StoryObj<{}>;

@Component({
	selector: 'sidebar',
	imports: [HlmSidebarImports, NgIcon],
	providers: [
		provideIcons({
			lucideHouse,
			lucideInbox,
			lucideCalendar,
			lucideSearch,
			lucideSettings,
			lucideMenu,
			lucideEllipsis,
		}),
	],
	template: `
		<div hlmSidebarWrapper>
			<hlm-sidebar side="left">
				<div hlmSidebarHeader>
					<h1 class="text-2xl font-bold">My app</h1>
					<div hlmSidebarGroup>
						<div hlmSidebarGroupContent class="relative">
							<input hlmSidebarInput placeholder="Search" class="pl-8" />
							<ng-icon
								name="lucideSearch"
								class="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none"
							></ng-icon>
						</div>
					</div>
				</div>
				<div hlmSidebarContent>
					<div hlmSidebarGroup>
						<div hlmSidebarGroupLabel>Application</div>
						<button hlmSidebarGroupAction>
							<ng-icon name="lucideEllipsis" />
						</button>

						<div hlmSidebarGroupContent>
							<ul hlmSidebarMenu>
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton aria-describedby="Home" [isActive]="true">
										<ng-icon name="lucideHouse" />
										<span>Home</span>
									</button>
									<ul hlmSidebarMenuSub>
										<li>
											<a hlmSidebarMenuSubButton>
												<ng-icon name="lucideHouse" />
												<span>Home</span>
											</a>
										</li>
										<li>
											<a hlmSidebarMenuSubButton>
												<ng-icon name="lucideHouse" />
												<span>Home</span>
											</a>
										</li>
									</ul>
								</li>

								<!-- Home -->
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton aria-describedby="Home">
										<ng-icon name="lucideHouse" />
										<span>Home</span>
									</button>
									<button hlmSidebarMenuAction aria-describedby="Home">
										<ng-icon name="lucideEllipsis" />
									</button>
								</li>

								<!-- Inbox -->
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton tooltip="Inbox" aria-describedby="Inbox">
										<ng-icon name="lucideInbox" />
										<span>Inbox</span>
									</button>
								</li>

								<!-- Calendar -->
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton tooltip="Calendar" aria-describedby="Calendar">
										<ng-icon name="lucideCalendar" />
										<span>Calendar</span>
									</button>
								</li>
								<hlm-sidebar-separator />

								<!-- Search -->
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton tooltip="Search" aria-describedby="Search">
										<ng-icon name="lucideSearch" />
										<span>Search</span>
										<div hlmSidebarMenuBadge>10</div>
									</button>
								</li>

								<!-- Settings -->
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton tooltip="Settings" aria-describedby="Settings">
										<ng-icon name="lucideSettings" />
										<span>Settings</span>
									</button>
								</li>
							</ul>
						</div>
					</div>
					<div hlmSidebarGroup collapsible="icon">
						<div hlmSidebarGroupLabel>Application1</div>
						<div hlmSidebarGroupContent>
							<ul hlmSidebarMenu>
								<!-- Home -->
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton tooltip="Home" aria-describedby="Home">
										<ng-icon name="lucideHouse" />
										<span>Home</span>
									</button>
								</li>

								<!-- Inbox -->
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton tooltip="Inbox" aria-describedby="Inbox">
										<ng-icon name="lucideInbox" />
										<span>Inbox</span>
									</button>
								</li>

								<!-- Calendar -->
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton tooltip="Calendar" aria-describedby="Calendar">
										<ng-icon name="lucideCalendar" />
										<span>Calendar</span>
									</button>
								</li>

								<!-- Search -->
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton tooltip="Search" aria-describedby="Search">
										<ng-icon name="lucideSearch" />
										<span>Search</span>
									</button>
								</li>

								<!-- Settings -->
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton tooltip="Settings" aria-describedby="Settings">
										<ng-icon name="lucideSettings" />
										<span>Settings</span>
									</button>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div hlmSidebarFooter>
					<button hlmSidebarMenuButton tooltip="Settings" aria-describedby="Settings">
						<ng-icon name="lucideSettings" />
						<span>Settings</span>
					</button>
				</div>

				<!-- Rail for resizing -->
				<button hlmSidebarRail></button>
			</hlm-sidebar>
			<main hlmSidebarInset>
				<div class="flex h-screen w-full flex-col items-center justify-center">
					<button hlmSidebarTrigger><span class="sr-only"></span></button>
					<h1 class="text-2xl font-bold">Hello World</h1>
				</div>
			</main>
		</div>
	`,
})
class Sidebar {}

export const Default: Story = {
	decorators: [
		moduleMetadata({
			imports: [Sidebar],
		}),
	],
	render: () => ({
		template: '<sidebar/>',
	}),
};

@Component({
	selector: 'sidebar',
	imports: [HlmSidebarImports, NgIcon],
	providers: [
		provideIcons({
			lucideHouse,
			lucideInbox,
			lucideCalendar,
			lucideSearch,
			lucideSettings,
			lucideMenu,
			lucideEllipsis,
		}),
	],
	template: `
		<div hlmSidebarWrapper>
			<main hlmSidebarInset>
				<div class="flex h-screen w-full flex-col items-center justify-center">
					<button hlmSidebarTrigger><span class="sr-only"></span></button>
					<h1 class="text-2xl font-bold">Hello World</h1>
				</div>
			</main>
			<hlm-sidebar side="right">
				<div hlmSidebarHeader>
					<h1 class="text-2xl font-bold">My app</h1>
					<div hlmSidebarGroup>
						<div hlmSidebarGroupContent class="relative">
							<input hlmSidebarInput placeholder="Search" class="pl-8" />
							<ng-icon
								name="lucideSearch"
								class="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none"
							></ng-icon>
						</div>
					</div>
				</div>
				<div hlmSidebarContent>
					<div hlmSidebarGroup>
						<div hlmSidebarGroupLabel>Application</div>
						<button hlmSidebarGroupAction>
							<ng-icon name="lucideEllipsis" />
						</button>

						<div hlmSidebarGroupContent>
							<ul hlmSidebarMenu>
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton aria-describedby="Home" [isActive]="true">
										<ng-icon name="lucideHouse" />
										<span>Home</span>
									</button>
									<ul hlmSidebarMenuSub>
										<li>
											<a hlmSidebarMenuSubButton>
												<ng-icon name="lucideHouse" />
												<span>Home</span>
											</a>
										</li>
										<li>
											<a hlmSidebarMenuSubButton>
												<ng-icon name="lucideHouse" />
												<span>Home</span>
											</a>
										</li>
									</ul>
								</li>

								<!-- Home -->
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton aria-describedby="Home">
										<ng-icon name="lucideHouse" />
										<span>Home</span>
									</button>
									<button hlmSidebarMenuAction aria-describedby="Home">
										<ng-icon name="lucideEllipsis" />
									</button>
								</li>

								<!-- Inbox -->
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton tooltip="Inbox" aria-describedby="Inbox">
										<ng-icon name="lucideInbox" />
										<span>Inbox</span>
									</button>
								</li>

								<!-- Calendar -->
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton tooltip="Calendar" aria-describedby="Calendar">
										<ng-icon name="lucideCalendar" />
										<span>Calendar</span>
									</button>
								</li>
								<hlm-sidebar-separator />

								<!-- Search -->
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton tooltip="Search" aria-describedby="Search">
										<ng-icon name="lucideSearch" />
										<span>Search</span>
										<div hlmSidebarMenuBadge>10</div>
									</button>
								</li>

								<!-- Settings -->
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton tooltip="Settings" aria-describedby="Settings">
										<ng-icon name="lucideSettings" />
										<span>Settings</span>
									</button>
								</li>
							</ul>
						</div>
					</div>
					<div hlmSidebarGroup collapsible="icon">
						<div hlmSidebarGroupLabel>Application1</div>
						<div hlmSidebarGroupContent>
							<ul hlmSidebarMenu>
								<!-- Home -->
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton tooltip="Home" aria-describedby="Home">
										<ng-icon name="lucideHouse" />
										<span>Home</span>
									</button>
								</li>

								<!-- Inbox -->
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton tooltip="Inbox" aria-describedby="Inbox">
										<ng-icon name="lucideInbox" />
										<span>Inbox</span>
									</button>
								</li>

								<!-- Calendar -->
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton tooltip="Calendar" aria-describedby="Calendar">
										<ng-icon name="lucideCalendar" />
										<span>Calendar</span>
									</button>
								</li>

								<!-- Search -->
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton tooltip="Search" aria-describedby="Search">
										<ng-icon name="lucideSearch" />
										<span>Search</span>
									</button>
								</li>

								<!-- Settings -->
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton tooltip="Settings" aria-describedby="Settings">
										<ng-icon name="lucideSettings" />
										<span>Settings</span>
									</button>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div hlmSidebarFooter>
					<button hlmSidebarMenuButton tooltip="Settings" aria-describedby="Settings">
						<ng-icon name="lucideSettings" />
						<span>Settings</span>
					</button>
				</div>

				<!-- Rail for resizing -->
				<button hlmSidebarRail></button>
			</hlm-sidebar>
		</div>
	`,
})
class SidebarRight {}

export const RightSide: Story = {
	decorators: [
		moduleMetadata({
			imports: [SidebarRight],
		}),
	],
	render: () => ({
		template: '<sidebar/>',
	}),
};
