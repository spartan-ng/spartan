import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { SearchForm } from '../../shared/sidebar/search-form';
import { VersionSwitcher } from '../../shared/sidebar/version-switcher';

@Component({
	selector: 'spartan-sidebar-02',
	imports: [HlmSidebarImports, NgIcon, HlmCollapsibleImports, SearchForm, VersionSwitcher],
	providers: [provideIcons({ lucideChevronRight })],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<hlm-sidebar>
			<hlm-sidebar-header>
				<spartan-version-switcher [versions]="versions" />
				<spartan-search-form />
			</hlm-sidebar-header>
			<hlm-sidebar-content class="gap-0">
				@for (group of navGroups; track group.title) {
					<hlm-collapsible [expanded]="true" class="group/collapsible">
						<hlm-sidebar-group>
							<div
								hlmSidebarGroupLabel
								class="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
							>
								<button hlmCollapsibleTrigger>
									{{ group.title }}
									<ng-icon
										name="lucideChevronRight"
										class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
									/>
								</button>
							</div>
							<hlm-collapsible-content>
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
							</hlm-collapsible-content>
						</hlm-sidebar-group>
					</hlm-collapsible>
				}
			</hlm-sidebar-content>
			<hlm-sidebar-rail />
		</hlm-sidebar>
	`,
})
export class AppSidebar02 {
	public readonly versions = ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'];
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
			title: 'Community',
			items: [{ title: 'Contribution Guide', url: '.' }],
		},
	];
}
