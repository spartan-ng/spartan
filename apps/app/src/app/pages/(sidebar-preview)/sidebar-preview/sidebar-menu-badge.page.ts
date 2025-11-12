import { Component, ViewEncapsulation } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChartPie, lucideFrame, lucideLifeBuoy, lucideMap, lucideSend } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-sidebar-menu',
	imports: [HlmSidebarImports, NgIcon, HlmIcon],
	providers: [
		provideIcons({
			lucideFrame,
			lucideChartPie,
			lucideMap,
			lucideLifeBuoy,
			lucideSend,
		}),
	],
	encapsulation: ViewEncapsulation.None,
	styleUrl: 'sidebar-default.css',
	template: `
		<div hlmSidebarWrapper>
			<hlm-sidebar>
				<div hlmSidebarContent>
					<div hlmSidebarGroup>
						<div hlmSidebarGroupLabel>Projects</div>
						<div hlmSidebarGroupContent>
							<ul hlmSidebarMenu>
								@for (project of _projects; track project) {
									<li hlmSidebarMenuItem>
										<button hlmSidebarMenuButton>
											<ng-icon hlm [name]="project.icon" />
											<span>{{ project.name }}</span>
										</button>
										<div hlmSidebarMenuBadge>{{ project.info }}</div>
									</li>
								}
							</ul>
						</div>
					</div>
				</div>
			</hlm-sidebar>
			<main hlmSidebarInset>
				<header class="flex h-12 items-center justify-between px-4">
					<button hlmSidebarTrigger><span class="sr-only"></span></button>
				</header>
			</main>
		</div>
	`,
})
export default class SidebarMenuPage {
	protected readonly _projects = [
		{ info: 24, name: 'Design Engineering', icon: 'lucideFrame' },
		{ info: 12, name: 'Sales & Marketing', icon: 'lucideChartPie' },
		{ info: 3, name: 'Travel', icon: 'lucideMap' },
		{ info: 21, name: 'Support', icon: 'lucideLifeBuoy' },
		{ info: 8, name: 'Feedback', icon: 'lucideSend' },
	];
}
