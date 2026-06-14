import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { Calendars } from '../../shared/sidebar/calendars';
import { data } from '../../shared/sidebar/data';
import { DatePicker } from '../../shared/sidebar/date-picker';
import { NavUser } from '../../shared/sidebar/nav-user';

@Component({
	selector: 'spartan-sidebar-12',
	imports: [HlmSidebarImports, NgIcon, Calendars, DatePicker, NavUser],
	providers: [provideIcons({ lucidePlus })],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<hlm-sidebar>
			<hlm-sidebar-header class="border-sidebar-border h-16 border-b">
				<spartan-nav-user [user]="data.user" />
			</hlm-sidebar-header>
			<hlm-sidebar-content>
				<spartan-date-picker />
				<hlm-sidebar-separator class="mx-0" />
				<spartan-calendars [calendars]="data.calendars" />
			</hlm-sidebar-content>
			<hlm-sidebar-footer>
				<ul hlmSidebarMenu>
					<li hlmSidebarMenuItem>
						<button hlmSidebarMenuButton>
							<ng-icon name="lucidePlus" />
							<span>New Calendar</span>
						</button>
					</li>
				</ul>
			</hlm-sidebar-footer>
			<hlm-sidebar-rail />
		</hlm-sidebar>
	`,
})
export class AppSidebar12 {
	public readonly data = data;
}
