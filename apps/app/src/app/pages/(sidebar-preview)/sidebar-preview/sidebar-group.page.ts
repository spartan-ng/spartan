import { Component, ViewEncapsulation } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLifeBuoy, lucideSend } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-sidebar-group',
	imports: [HlmSidebarImports, NgIcon, HlmIcon],
	providers: [
		provideIcons({
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
						<div hlmSidebarGroupLabel>Help</div>
						<div hlmSidebarGroupContent>
							<ul hlmSidebarMenu>
								<li hlmSidebarMenuItem>
									<a hlmSidebarMenuButton>
										<ng-icon hlm name="lucideLifeBuoy" />
										<span>Support</span>
									</a>
								</li>
								<li hlmSidebarMenuItem>
									<a hlmSidebarMenuButton>
										<ng-icon hlm name="lucideSend" />
										<span>Feedback</span>
									</a>
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
export default class SidebarGroupPage {}
