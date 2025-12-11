import { Component, ViewEncapsulation } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChartPie, lucideFrame, lucideMap, lucidePlus } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { toast } from 'ngx-sonner';

@Component({
	selector: 'spartan-sidebar-group-action',
	imports: [HlmSidebarImports, NgIcon, HlmIcon, HlmToasterImports],
	providers: [
		provideIcons({
			lucideFrame,
			lucideChartPie,
			lucideMap,
			lucidePlus,
		}),
	],
	encapsulation: ViewEncapsulation.None,
	styleUrl: 'sidebar-default.css',
	template: `
		<hlm-toaster />
		<div hlmSidebarWrapper>
			<hlm-sidebar>
				<div hlmSidebarContent>
					<div hlmSidebarGroup>
						<div hlmSidebarGroupLabel>Projects</div>
						<button hlmSidebarGroupAction title="Add Project" (click)="_onAddProject()">
							<ng-icon hlm name="lucidePlus" />
							<span class="sr-only">Add Project</span>
						</button>
						<div hlmSidebarGroupContent>
							<ul hlmSidebarMenu>
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton>
										<ng-icon hlm name="lucideFrame" />
										<span>Design Engineering</span>
									</button>
								</li>
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton>
										<ng-icon hlm name="lucideChartPie" />
										<span>Sales & Marketing</span>
									</button>
								</li>
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton>
										<ng-icon hlm name="lucideMap" />
										<span>Travel</span>
									</button>
								</li>
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
export default class SidebarGroupActionPage {
	protected _onAddProject(): void {
		toast.info('You clicked the group action!');
	}
}
