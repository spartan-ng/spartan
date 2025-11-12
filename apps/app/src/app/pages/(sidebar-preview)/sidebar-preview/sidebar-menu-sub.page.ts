import { Component, ViewEncapsulation } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-sidebar-menu-sub',
	imports: [HlmSidebarImports],
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
									<li hlmSidebarMenuItem>
										<button hlmSidebarMenuButton>
											<span>{{ item.title }}</span>
										</button>
										<ul hlmSidebarMenuSub>
											@for (subItem of item.items; track subItem.title) {
												<li hlmSidebarMenuSubItem>
													<button hlmSidebarMenuSubButton class="w-full">
														<span>{{ subItem.title }}</span>
													</button>
												</li>
											}
										</ul>
									</li>
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
export default class SidebarMenuSubPage {
	protected readonly _items = [
		{
			title: 'Getting Started',
			items: [{ title: 'Installation' }, { title: 'Project Structure' }],
		},
		{
			title: 'Building Your Application',
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
