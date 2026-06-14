import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { data } from '../../shared/sidebar/data';
import { SearchForm } from '../../shared/sidebar/search-form';
import { VersionSwitcher } from '../../shared/sidebar/version-switcher';

@Component({
	selector: 'spartan-sidebar-01',
	imports: [HlmSidebarImports, SearchForm, VersionSwitcher],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<hlm-sidebar>
			<hlm-sidebar-header>
				<spartan-version-switcher [versions]="data.versions" />
				<spartan-search-form />
			</hlm-sidebar-header>
			<hlm-sidebar-content>
				@for (group of navGroups; track group.title) {
					<hlm-sidebar-group>
						<div hlmSidebarGroupLabel>{{ group.title }}</div>
						<div hlmSidebarGroupContent>
							<ul hlmSidebarMenu>
								@for (item of group.items; track item.title) {
									<li hlmSidebarMenuItem>
										<a
											hlmSidebarMenuButton
											href="#"
											[class]="item.isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''"
										>
											{{ item.title }}
										</a>
									</li>
								}
							</ul>
						</div>
					</hlm-sidebar-group>
				}
			</hlm-sidebar-content>
			<hlm-sidebar-rail />
		</hlm-sidebar>
	`,
})
export class AppSidebar01 {
	public readonly data = data;
	public readonly navGroups = [
		{
			title: 'Getting Started',
			items: [
				{ title: 'Installation', url: '.' },
				{ title: 'Project Structure', url: '.' },
			],
		},
		{
			title: 'Build Your Application',
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
			title: 'Architecture',
			items: [
				{ title: 'Accessibility', url: '.' },
				{ title: 'Fast Refresh', url: '.' },
				{ title: 'Compiler', url: '.' },
				{ title: 'Supported Browsers', url: '.' },
				{ title: 'Turbopack', url: '.' },
			],
		},
	];
}
