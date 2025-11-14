import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCommand } from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { data } from '../../shared/sidebar/data';
import { NavMain } from '../../shared/sidebar/nav-main';
import { NavProjects } from '../../shared/sidebar/nav-projects';
import { NavSecondary } from '../../shared/sidebar/nav-secondary';
import { NavUser } from '../../shared/sidebar/nav-user';

@Component({
	selector: 'spartan-app-sidebar-inset',
	imports: [HlmSidebarImports, NgIcon, NavMain, NavProjects, NavUser, NavSecondary],
	providers: [provideIcons({ lucideCommand })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div hlmSidebarWrapper>
			<hlm-sidebar variant="inset">
				<hlm-sidebar-header>
					<ul hlmSidebarMenu>
						<li hlmSidebarMenuItem>
							<a hlmSidebarMenuButton size="lg" href="#">
								<div
									class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
								>
									<ng-icon name="lucideCommand" class="text-base" />
								</div>
								<div class="grid flex-1 text-left text-sm leading-tight">
									<span class="truncate font-medium">Acme Inc</span>
									<span class="truncate text-xs">Enterprise</span>
								</div>
							</a>
						</li>
					</ul>
				</hlm-sidebar-header>

				<hlm-sidebar-content>
					<spartan-nav-main [items]="data.navMain" />
					<spartan-nav-projects [projects]="data.projects" />
					<spartan-nav-secondary class="mt-auto" [items]="data.navSecondary" />
				</hlm-sidebar-content>
				<hlm-sidebar-footer>
					<spartan-nav-user [user]="data.user" />
				</hlm-sidebar-footer>
			</hlm-sidebar>
			<ng-content />
		</div>
	`,
})
export class AppSidebarInset {
	public readonly data = data;
}
