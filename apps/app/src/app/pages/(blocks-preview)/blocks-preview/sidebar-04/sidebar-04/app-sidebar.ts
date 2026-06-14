import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { NavMainFlat } from '../../shared/sidebar/nav-main-flat';

@Component({
	selector: 'spartan-sidebar-04',
	imports: [HlmSidebarImports, NavMainFlat],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div hlmSidebarWrapper>
			<hlm-sidebar variant="floating">
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
			</hlm-sidebar>
			<ng-content />
		</div>
	`,
})
export class AppSidebar04 {
	public readonly flatNavItems = [
		{
			title: 'Getting Started',
			url: '.',
			items: [
				{ title: 'Installation', url: '.' },
				{ title: 'Project Structure', url: '.' },
			],
		},
		{
			title: 'Build Your Application',
			url: '.',
			items: [
				{ title: 'Routing', url: '.' },
				{ title: 'Data Fetching', url: '.', isActive: true },
				{ title: 'Rendering', url: '.' },
				{ title: 'Caching', url: '.' },
				{ title: 'Styling', url: '.' },
				{ title: 'Optimizing', url: '.' },
				{ title: 'Configuring', url: '.' },
				{ title: 'Testing', url: '.' },
				{ title: 'Authentication', url: '.' },
				{ title: 'Deploying', url: '.' },
				{ title: 'Upgrading', url: '.' },
				{ title: 'Examples', url: '.' },
			],
		},
		{
			title: 'API Reference',
			url: '.',
			items: [
				{ title: 'Components', url: '.' },
				{ title: 'File Conventions', url: '.' },
				{ title: 'Functions', url: '.' },
				{ title: 'next.config.js Options', url: '.' },
				{ title: 'CLI', url: '.' },
				{ title: 'Edge Runtime', url: '.' },
			],
		},
		{
			title: 'Community',
			url: '.',
			items: [{ title: 'Contribution Guide', url: '.' }],
		},
	];
}
