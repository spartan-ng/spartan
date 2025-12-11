import { Component, ViewEncapsulation } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronUp } from '@ng-icons/lucide';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-sidebar-footer',
	imports: [HlmSidebarImports, HlmDropdownMenuImports, NgIcon, HlmIcon],
	providers: [
		provideIcons({
			lucideChevronUp,
		}),
	],
	encapsulation: ViewEncapsulation.None,
	styleUrl: 'sidebar-default.css',
	template: `
		<div hlmSidebarWrapper>
			<hlm-sidebar>
				<div hlmSidebarHeader></div>
				<div hlmSidebarContent></div>
				<div hlmSidebarFooter>
					<ul hlmSidebarMenu>
						<li hlmSidebarMenuItem>
							<button hlmSidebarMenuButton [hlmDropdownMenuTrigger]="menu">
								Select Workspace
								<ng-icon hlm name="lucideChevronUp" class="ml-auto" />
							</button>
							<ng-template #menu>
								<hlm-dropdown-menu class="w-60">
									<button hlmDropdownMenuItem>Account</button>
									<button hlmDropdownMenuItem>Billing</button>
									<button hlmDropdownMenuItem>Sign out</button>
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
export default class SidebarFooterPage {}
