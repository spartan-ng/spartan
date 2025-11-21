import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideChartPie,
	lucideEllipsis,
	lucideFolder,
	lucideFrame,
	lucideMap,
	lucideShare,
	lucideTrash2,
} from '@ng-icons/lucide';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-nav-projects',
	imports: [HlmSidebarImports, NgIcon, RouterLink, HlmDropdownMenuImports],
	providers: [
		provideIcons({ lucideFrame, lucideChartPie, lucideMap, lucideEllipsis, lucideFolder, lucideShare, lucideTrash2 }),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-sidebar-group>
			<div hlmSidebarGroupLabel>Projects</div>
			<ul hlmSidebarMenu>
				@for (project of projects(); track $index) {
					<li hlmSidebarMenuItem>
						<a hlmSidebarMenuButton [routerLink]="project.url">
							<ng-icon [name]="project.icon" />
							{{ project.name }}
						</a>
						<button
							hlmSidebarMenuAction
							showOnHover
							[hlmDropdownMenuTrigger]="menu"
							[hlmDropdownMenuTriggerData]="{ $implicit: { project } }"
							[side]="_menuSide()"
							[align]="_menuAlign()"
						>
							<ng-icon name="lucideEllipsis" />
							<span class="sr-only">More</span>
						</button>
					</li>
				}
				<li hlmSidebarMenuItem>
					<button hlmSidebarMenuButton>
						<ng-icon name="lucideEllipsis" />
						More
					</button>
				</li>
			</ul>
		</hlm-sidebar-group>

		<ng-template #menu let-ctx>
			<hlm-dropdown-menu class="w-48">
				<hlm-dropdown-menu-group>
					<hlm-dropdown-menu-label>{{ ctx.project.name }}</hlm-dropdown-menu-label>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem>
					<ng-icon name="lucideFolder" />
					View Project
				</button>
				<button hlmDropdownMenuItem>
					<ng-icon name="lucideShare" />
					Share Project
				</button>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem>
					<ng-icon name="lucideTrash2" />
					Delete Project
				</button>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class NavProjects {
	private readonly _sidebarService = inject(HlmSidebarService);
	protected readonly _menuSide = computed(() => (this._sidebarService.isMobile() ? 'bottom' : 'right'));
	protected readonly _menuAlign = computed(() => (this._sidebarService.isMobile() ? 'end' : 'start'));

	public readonly projects = input.required<
		{
			name: string;
			url: string;
			icon: string;
		}[]
	>();
}
