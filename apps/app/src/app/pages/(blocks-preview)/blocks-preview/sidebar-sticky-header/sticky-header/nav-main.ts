import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBookOpen, lucideBot, lucideChevronRight, lucideSettings2, lucideSquareTerminal } from '@ng-icons/lucide';
import { BrnCollapsibleImports } from '@spartan-ng/brain/collapsible';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-nav-main',
	imports: [HlmSidebarImports, NgIcon, BrnCollapsibleImports],
	providers: [provideIcons({ lucideSquareTerminal, lucideBot, lucideBookOpen, lucideSettings2, lucideChevronRight })],
	template: `
		<hlm-sidebar-group>
			<div hlmSidebarGroupLabel>Platform</div>
			<ul hlmSidebarMenu>
				@for (item of items(); track $index) {
					<brn-collapsible [expanded]="item.isActive ?? false">
						<li hlmSidebarMenuItem>
							<a hlmSidebarMenuButton [href]="item.url">
								<ng-icon [name]="item.icon" />
								{{ item.title }}
							</a>
							@if (item.items; as subItems) {
								<button brnCollapsibleTrigger hlmSidebarMenuAction class="data-[state=open]:rotate-90">
									<ng-icon name="lucideChevronRight" />
								</button>
								<brn-collapsible-content>
									<ul hlmSidebarMenuSub>
										@for (subItem of subItems; track $index) {
											<li hlmSidebarMenuSubItem>
												<a hlmSidebarMenuSubButton [href]="subItem.url">{{ subItem.title }}</a>
											</li>
										}
									</ul>
								</brn-collapsible-content>
							}
						</li>
					</brn-collapsible>
				}
			</ul>
		</hlm-sidebar-group>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
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
