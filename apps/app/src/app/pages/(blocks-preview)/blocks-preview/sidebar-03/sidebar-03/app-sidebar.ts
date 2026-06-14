import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { NavMainFlat } from '../../shared/sidebar/nav-main-flat';

@Component({
	selector: 'spartan-sidebar-03',
	imports: [HlmSidebarImports, NavMainFlat],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div hlmSidebarWrapper>
			<hlm-sidebar>
				<hlm-sidebar-header>
					<ul hlmSidebarMenu>
						<li hlmSidebarMenuItem>
							<a hlmSidebarMenuButton size="lg" href="#">
								<div
									class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
								>
									<span class="text-base">&#9670;</span>
								</div>
								<div class="grid flex-1 text-left text-sm leading-tight">
									<span class="truncate font-medium">Documentation</span>
									<span class="truncate text-xs">v1.0.0</span>
								</div>
							</a>
						</li>
					</ul>
				</hlm-sidebar-header>
				<hlm-sidebar-content>
					<spartan-nav-main-flat groupLabel="Getting Started" [items]="flatNavItems" />
				</hlm-sidebar-content>
				<hlm-sidebar-rail />
			</hlm-sidebar>
			<ng-content />
		</div>
	`,
})
export class AppSidebar03 {
	public readonly flatNavItems = [
		{
			title: 'Getting Started',
			url: '.',
			items: [
				{ title: 'Installation', url: '.', isActive: false },
				{ title: 'Project Structure', url: '.', isActive: false },
			],
		},
		{
			title: 'Build Your Application',
			url: '.',
			items: [
				{ title: 'Routing', url: '.', isActive: false },
				{ title: 'Data Fetching', url: '.', isActive: true },
				{ title: 'Rendering', url: '.', isActive: false },
				{ title: 'Caching', url: '.', isActive: false },
				{ title: 'Styling', url: '.', isActive: false },
				{ title: 'Optimizing', url: '.', isActive: false },
				{ title: 'Configuring', url: '.', isActive: false },
				{ title: 'Testing', url: '.', isActive: false },
				{ title: 'Authentication', url: '.', isActive: false },
				{ title: 'Deploying', url: '.', isActive: false },
				{ title: 'Upgrading', url: '.', isActive: false },
				{ title: 'Examples', url: '.', isActive: false },
			],
		},
		{
			title: 'API Reference',
			url: '.',
			items: [
				{ title: 'Components', url: '.', isActive: false },
				{ title: 'File Conventions', url: '.', isActive: false },
				{ title: 'Functions', url: '.', isActive: false },
				{ title: 'next.config.js Options', url: '.', isActive: false },
				{ title: 'CLI', url: '.', isActive: false },
				{ title: 'Edge Runtime', url: '.', isActive: false },
			],
		},
		{
			title: 'Community',
			url: '.',
			items: [{ title: 'Contribution Guide', url: '.', isActive: false }],
		},
	];
}
