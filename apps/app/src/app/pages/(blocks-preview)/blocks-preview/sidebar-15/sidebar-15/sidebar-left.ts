import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHome, lucideInbox, lucidePlus, lucideSearch, lucideSettings2 } from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { data } from '../../shared/sidebar/data';
import { NavFavorites } from '../../shared/sidebar/nav-favorites';
import { NavSecondary } from '../../shared/sidebar/nav-secondary';
import { NavWorkspaces } from '../../shared/sidebar/nav-workspaces';
import { TeamSwitcher } from '../../shared/sidebar/team-switcher';

@Component({
	selector: 'spartan-sidebar-left',
	imports: [HlmSidebarImports, NgIcon, TeamSwitcher, NavFavorites, NavWorkspaces, NavSecondary],
	providers: [provideIcons({ lucidePlus, lucideSearch, lucideInbox, lucideHome, lucideSettings2 })],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<hlm-sidebar class="border-r-0">
			<hlm-sidebar-header>
				<spartan-team-switcher [teams]="data.teams" />
				<hlm-sidebar-group>
					<div hlmSidebarGroupContent>
						<ul hlmSidebarMenu>
							@for (item of flatItems; track item.title) {
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton [isActive]="item.isActive">
										<ng-icon [name]="item.icon" />
										<span>{{ item.title }}</span>
									</button>
								</li>
							}
						</ul>
					</div>
				</hlm-sidebar-group>
			</hlm-sidebar-header>
			<hlm-sidebar-content>
				<spartan-nav-favorites [favorites]="data.favorites" />
				<spartan-nav-workspaces [workspaces]="data.workspaces" />
				<spartan-nav-secondary [items]="data.navSecondary" class="mt-auto" />
			</hlm-sidebar-content>
			<hlm-sidebar-rail />
		</hlm-sidebar>
	`,
})
export class SidebarLeft {
	public readonly data = data;
	public readonly flatItems = [
		{ title: 'Search', icon: 'lucideSearch', isActive: false },
		{ title: 'Inbox', icon: 'lucideInbox', isActive: true },
		{ title: 'Home', icon: 'lucideHome', isActive: false },
		{ title: 'Settings', icon: 'lucideSettings2', isActive: false },
	];
}
