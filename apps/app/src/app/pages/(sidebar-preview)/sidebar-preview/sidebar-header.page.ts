import { Component, ViewEncapsulation } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-sidebar-header',
	encapsulation: ViewEncapsulation.None,
	imports: [HlmSidebarImports, HlmMenuImports, BrnMenuImports, NgIcon, HlmIcon],
	template: `
		<div hlmSidebarWrapper>
			<hlm-sidebar>
				<div hlmSidebarHeader>
					<ul hlmSidebarMenu>
						<li hlmSidebarMenuItem>
							<button hlmSidebarMenuButton [brnMenuTriggerFor]="menu">
								Select Workspace
								<ng-icon hlm name="lucideChevronDown" class="ml-auto" />
							</button>
							<ng-template #menu>
								<hlm-menu class="w-60">
									<hlm-menu-label>Acme Inc</hlm-menu-label>
									<hlm-menu-label>Acme Corp.</hlm-menu-label>
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
	providers: [
		provideIcons({
			lucideChevronDown,
		}),
	],
	styles: `
		#spartan-header,
		#spartan-footer {
			display: none !important;
		}
	`,
})
export default class SidebarHeaderPage {}
