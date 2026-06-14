import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideBlocks,
	lucideCalendar,
	lucideEllipsis,
	lucideGalleryVerticalEnd,
	lucideHome,
	lucideInbox,
	lucideLifeBuoy,
	lucideMessageCircleQuestion,
	lucidePlus,
	lucideSearch,
	lucideSend,
	lucideSparkles,
	lucideTrash2,
} from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { data } from '../../shared/sidebar/data';
import { NavFavorites } from '../../shared/sidebar/nav-favorites';
import { NavSecondary } from '../../shared/sidebar/nav-secondary';
import { NavWorkspaces } from '../../shared/sidebar/nav-workspaces';
import { TeamSwitcher } from '../../shared/sidebar/team-switcher';
import { NavMainFlatItems } from './nav-main-flat-items';

@Component({
	selector: 'spartan-sidebar-10',
	imports: [HlmSidebarImports, NgIcon, TeamSwitcher, NavMainFlatItems, NavFavorites, NavWorkspaces, NavSecondary],
	providers: [
		provideIcons({
			lucideGalleryVerticalEnd,
			lucidePlus,
			lucideEllipsis,
			lucideHome,
			lucideInbox,
			lucideMessageCircleQuestion,
			lucideSearch,
			lucideSparkles,
			lucideTrash2,
			lucideCalendar,
			lucideBlocks,
			lucideLifeBuoy,
			lucideSend,
		}),
	],
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
				<spartan-nav-main-flat-items />
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
export class AppSidebar10 {
	public readonly data = data;
}
