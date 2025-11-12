import { Component, ViewEncapsulation } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChartPie, lucideEllipsis, lucideFrame, lucideLifeBuoy, lucideMap, lucideSend } from '@ng-icons/lucide';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-sidebar-dropdown-menu',
	encapsulation: ViewEncapsulation.None,
	imports: [HlmSidebarImports, BrnMenuImports, NgIcon, HlmIcon, HlmMenuImports],
	providers: [
		provideIcons({
			lucideFrame,
			lucideChartPie,
			lucideMap,
			lucideLifeBuoy,
			lucideSend,
			lucideEllipsis,
		}),
	],
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
										<button hlmSidebarMenuAction [brnMenuTriggerFor]="menu">
											<ng-icon hlm name="lucideEllipsis" />
											<span class="sr-only">More</span>
										</button>

										<ng-template #menu>
											<hlm-menu>
												<button hlmMenuItem>Edit Project</button>
												<button hlmMenuItem>Delete Project</button>
											</hlm-menu>
										</ng-template>
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
export default class SidebarDropdownMenuPage {
	protected readonly _projects = [
		{ name: 'Design Engineering', icon: 'lucideFrame' },
		{ name: 'Sales & Marketing', icon: 'lucideChartPie' },
		{ name: 'Travel', icon: 'lucideMap' },
		{ name: 'Support', icon: 'lucideLifeBuoy' },
		{ name: 'Feedback', icon: 'lucideSend' },
	];
}
