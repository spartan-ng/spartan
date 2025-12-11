import { Component, ViewEncapsulation } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-sidebar-header',
	imports: [HlmSidebarImports, HlmDropdownMenuImports, NgIcon, HlmIcon],
	providers: [
		provideIcons({
			lucideChevronDown,
		}),
	],
	encapsulation: ViewEncapsulation.None,
	styleUrl: 'sidebar-default.css',
	template: `
		<div hlmSidebarWrapper>
			<hlm-sidebar>
				<div hlmSidebarHeader>
					<ul hlmSidebarMenu>
						<li hlmSidebarMenuItem>
							<button hlmSidebarMenuButton [hlmDropdownMenuTrigger]="menu">
								Select Workspace
								<ng-icon hlm name="lucideChevronDown" class="ml-auto" />
							</button>
							<ng-template #menu>
								<hlm-dropdown-menu class="w-60">
									<button hlmDropdownMenuItem>Acme Inc</button>
									<button hlmDropdownMenuItem>Acme Corp.</button>
								</hlm-dropdown-menu>
							</ng-template>
						</li>
					</ul>
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
export default class SidebarHeaderPage {}
