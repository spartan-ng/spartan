import { Component, ViewEncapsulation } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-sidebar-menu-sub-collapsable',
	imports: [HlmSidebarImports, HlmCollapsibleImports, NgIcon, HlmIcon],
	providers: [provideIcons({ lucideChevronRight })],
	encapsulation: ViewEncapsulation.None,
	styleUrl: 'sidebar-default.css',
	template: `
		<div hlmSidebarWrapper>
			<hlm-sidebar>
				<div hlmSidebarContent>
					<div hlmSidebarGroup>
						<div hlmSidebarGroupContent>
							<ul hlmSidebarMenu>
								@for (item of _items; track item.title) {
									<hlm-collapsible [expanded]="item.defaultOpen" class="group/collapsible">
										<li hlmSidebarMenuItem>
											<button
												hlmCollapsibleTrigger
												hlmSidebarMenuButton
												class="flex w-full items-center justify-between"
											>
												<span>{{ item.title }}</span>
												<ng-icon
													name="lucideChevronRight"
													class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
													hlm
												/>
											</button>
											<hlm-collapsible-content>
												<ul hlmSidebarMenuSub>
													@for (subItem of item.items; track subItem.title) {
														<li hlmSidebarMenuSubItem>
															<button hlmSidebarMenuSubButton class="w-full">
																<span>{{ subItem.title }}</span>
															</button>
														</li>
													}
												</ul>
											</hlm-collapsible-content>
										</li>
									</hlm-collapsible>
								}
							</ul>
						</div>
					</div>
				</div>
			</hlm-sidebar>
			<main hlmSidebarInset>
				<header class="flex h-12 items-center justify-between px-4">
					<button hlmSidebarTrigger><span class="sr-only"></span></button>
				</header>
			</main>
		</div>
	`,
})
export default class SidebarMenuSubPageCollapsable {
	protected readonly _items = [
		{
			title: 'Getting Started',
			defaultOpen: true,
			items: [{ title: 'Installation' }, { title: 'Project Structure' }],
		},
		{
			title: 'Building Your Application',
			defaultOpen: false,
			items: [
				{ title: 'Routing' },
				{ title: 'Data Fetching', isActive: true },
				{ title: 'Rendering' },
				{ title: 'Caching' },
				{ title: 'Styling' },
				{ title: 'Optimizing' },
				{ title: 'Configuring' },
				{ title: 'Testing' },
				{ title: 'Authentication' },
				{ title: 'Deploying' },
				{ title: 'Upgrading' },
				{ title: 'Examples' },
			],
		},
		{
			title: 'API Reference',
			defaultOpen: false,
			items: [
				{ title: 'Components' },
				{ title: 'File Conventions' },
				{ title: 'Functions' },
				{ title: 'next.config.js Options' },
				{ title: 'CLI' },
				{ title: 'Edge Runtime' },
			],
		},
		{
			title: 'Architecture',
			defaultOpen: false,
			items: [
				{ title: 'Accessibility' },
				{ title: 'Fast Refresh' },
				{ title: 'Next.js Compiler' },
				{ title: 'Supported Browsers' },
				{ title: 'Turbopack' },
			],
		},
	];
}
