import { Component, ViewEncapsulation } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideLifeBuoy, lucideSend } from '@ng-icons/lucide';
import { BrnCollapsibleImports } from '@spartan-ng/brain/collapsible';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-sidebar-collapsable',
	encapsulation: ViewEncapsulation.None,
	imports: [HlmIcon, NgIcon, BrnCollapsibleImports, HlmSidebarImports],
	providers: [
		provideIcons({
			lucideLifeBuoy,
			lucideSend,
			lucideChevronDown,
		}),
	],
	styleUrl: 'sidebar-default.css',
	template: `
		<div hlmSidebarWrapper>
			<hlm-sidebar>
				<div hlmSidebarContent>
					<brn-collapsible [expanded]="true" class="group/collapsible">
						<div hlmSidebarGroup>
							<button
								brnCollapsibleTrigger
								hlmSidebarGroupLabel
								class="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
							>
								Help
								<ng-icon
									hlm
									name="lucideChevronDown"
									class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
								/>
							</button>
							<brn-collapsible-content>
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
							</brn-collapsible-content>
						</div>
					</brn-collapsible>
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
export default class SidebarCollapsablePage {}
