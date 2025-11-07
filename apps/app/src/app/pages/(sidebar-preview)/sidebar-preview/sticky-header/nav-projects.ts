import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChartPie, lucideEllipsis, lucideFrame, lucideMap } from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'nav-projects',
	imports: [HlmSidebarImports, NgIcon],
	providers: [provideIcons({ lucideFrame, lucideChartPie, lucideMap, lucideEllipsis })],
	template: `
		<hlm-sidebar-group>
			<div hlmSidebarGroupLabel>Projects</div>
			<ul hlmSidebarMenu>
				<li hlmSidebarMenuItem>
					<a hlmSidebarMenuButton href="#">
						<ng-icon name="lucideFrame" />
						Desgin Engineering
					</a>
					<a hlmSidebarMenuButton href="#">
						<ng-icon name="lucideChartPie" />
						Sales & Marketing
					</a>
					<a hlmSidebarMenuButton href="#">
						<ng-icon name="lucideMap" />
						Travel
					</a>
					<button hlmSidebarMenuButton href="#">
						<ng-icon name="lucideEllipsis" />
						More
					</button>
				</li>
			</ul>
		</hlm-sidebar-group>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavProjects {}
