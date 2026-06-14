import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { data } from '../../shared/sidebar/data';
import { NavMain } from '../../shared/sidebar/nav-main';
import { NavProjects } from '../../shared/sidebar/nav-projects';
import { NavUser } from '../../shared/sidebar/nav-user';
import { TeamSwitcher } from '../../shared/sidebar/team-switcher';

@Component({
	selector: 'spartan-sidebar-07',
	imports: [HlmSidebarImports, TeamSwitcher, NavMain, NavProjects, NavUser],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<hlm-sidebar collapsible="icon">
			<hlm-sidebar-header>
				<spartan-team-switcher [teams]="data.teams" />
			</hlm-sidebar-header>
			<hlm-sidebar-content>
				<spartan-nav-main [items]="data.navMain" />
				<spartan-nav-projects [projects]="data.projects" />
			</hlm-sidebar-content>
			<hlm-sidebar-footer>
				<spartan-nav-user [user]="data.user" />
			</hlm-sidebar-footer>
			<hlm-sidebar-rail />
		</hlm-sidebar>
	`,
})
export class AppSidebar07 {
	public readonly data = data;
}
