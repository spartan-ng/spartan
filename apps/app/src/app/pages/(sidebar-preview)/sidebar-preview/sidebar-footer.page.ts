import { Component, ViewEncapsulation } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronUp } from '@ng-icons/lucide';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-sidebar-footer',
	encapsulation: ViewEncapsulation.None,
	imports: [HlmSidebarImports, HlmMenuImports, BrnMenuImports, NgIcon, HlmIcon],
	providers: [
		provideIcons({
			lucideChevronUp,
		}),
	],
	styleUrl: 'sidebar-default.css',
	template: `
		<div hlmSidebarWrapper>
			<hlm-sidebar>
				<div hlmSidebarHeader></div>
				<div hlmSidebarContent></div>
				<div hlmSidebarFooter>
					<ul hlmSidebarMenu>
						<li hlmSidebarMenuItem>
							<button hlmSidebarMenuButton [brnMenuTriggerFor]="menu">
								Select Workspace
								<ng-icon hlm name="lucideChevronUp" class="ml-auto" />
							</button>
							<ng-template #menu>
								<hlm-menu class="w-60">
									<button hlmMenuItem>Account</button>
									<button hlmMenuItem>Billing</button>
									<button hlmMenuItem>Sign out</button>
								</hlm-menu>
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
