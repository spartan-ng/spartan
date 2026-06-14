import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideGalleryVerticalEnd, lucideMinus, lucidePlus } from '@ng-icons/lucide';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { SearchForm } from '../../shared/sidebar/search-form';

@Component({
	selector: 'spartan-sidebar-05',
	imports: [HlmSidebarImports, NgIcon, HlmCollapsibleImports, SearchForm],
	providers: [provideIcons({ lucideGalleryVerticalEnd, lucidePlus, lucideMinus, lucideChevronRight })],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<hlm-sidebar>
			<hlm-sidebar-header>
				<ul hlmSidebarMenu>
					<li hlmSidebarMenuItem>
						<a hlmSidebarMenuButton size="lg" href="#">
							<div
								class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
							>
								<ng-icon name="lucideGalleryVerticalEnd" class="text-base" />
							</div>
							<div class="flex flex-col gap-0.5 leading-none">
								<span class="font-medium">Documentation</span>
								<span>v1.0.0</span>
							</div>
						</a>
					</li>
				</ul>
				<spartan-search-form />
			</hlm-sidebar-header>
			<hlm-sidebar-content>
				<hlm-sidebar-group>
					<ul hlmSidebarMenu>
						@for (group of navGroups; track group.title; let idx = $index) {
							<hlm-collapsible [expanded]="idx === 1" class="group/collapsible">
								<li hlmSidebarMenuItem>
									<button hlmCollapsibleTrigger hlmSidebarMenuButton>
										{{ group.title }}
										<ng-icon name="lucidePlus" class="ml-auto group-data-[state=open]/collapsible:hidden" />
										<ng-icon name="lucideMinus" class="ml-auto group-data-[state=closed]/collapsible:hidden" />
									</button>
									<hlm-collapsible-content>
										<ul hlmSidebarMenuSub class="ml-0 border-l-0 px-1.5">
											@for (item of group.items; track item.title) {
												<li hlmSidebarMenuSubItem>
													<a
														hlmSidebarMenuSubButton
														href="#"
														[class]="item.isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''"
													>
														{{ item.title }}
													</a>
												</li>
											}
										</ul>
									</hlm-collapsible-content>
								</li>
							</hlm-collapsible>
						}
					</ul>
				</hlm-sidebar-group>
			</hlm-sidebar-content>
			<hlm-sidebar-rail />
		</hlm-sidebar>
	`,
})
export class AppSidebar05 {
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
	];
}
