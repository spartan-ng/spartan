import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBookOpen, lucideBot, lucideChevronRight, lucideSettings2, lucideSquareTerminal } from '@ng-icons/lucide';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-nav-main',
	imports: [HlmSidebarImports, NgIcon, HlmCollapsibleImports, RouterLink],
	providers: [provideIcons({ lucideSquareTerminal, lucideBot, lucideBookOpen, lucideSettings2, lucideChevronRight })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-sidebar-group>
			<div hlmSidebarGroupLabel>Platform</div>
			<ul hlmSidebarMenu>
				@for (item of items(); track $index) {
					<hlm-collapsible [expanded]="item.isActive ?? false">
						<li hlmSidebarMenuItem>
							<a hlmSidebarMenuButton [routerLink]="item.url">
								<ng-icon [name]="item.icon" />
								{{ item.title }}
							</a>
							@if (item.items; as subItems) {
								<button hlmCollapsibleTrigger hlmSidebarMenuAction class="data-[state=open]:rotate-90">
									<ng-icon name="lucideChevronRight" />
								</button>
								<hlm-collapsible-content>
									<ul hlmSidebarMenuSub>
										@for (subItem of subItems; track $index) {
											<li hlmSidebarMenuSubItem>
												<a hlmSidebarMenuSubButton [routerLink]="subItem.url">{{ subItem.title }}</a>
											</li>
										}
									</ul>
								</hlm-collapsible-content>
							}
						</li>
					</hlm-collapsible>
				}
			</ul>
		</hlm-sidebar-group>
	`,
})
export class NavMain {
	public readonly items = input.required<
		{
			title: string;
			url: string;
			icon: string;
			isActive?: boolean;
			items?: {
				title: string;
				url: string;
			}[];
		}[]
	>();
}
