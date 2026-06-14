import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideBookOpen,
	lucideBot,
	lucideGalleryVerticalEnd,
	lucideSettings2,
	lucideSquareTerminal,
} from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-nav-main-flat',
	imports: [HlmSidebarImports, NgIcon, RouterLink],
	providers: [
		provideIcons({
			lucideSquareTerminal,
			lucideBot,
			lucideBookOpen,
			lucideSettings2,
			lucideGalleryVerticalEnd,
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-sidebar-group>
			<div hlmSidebarGroupLabel>{{ groupLabel() }}</div>
			<ul hlmSidebarMenu>
				@for (item of items(); track item.title) {
					<li hlmSidebarMenuItem>
						<a hlmSidebarMenuButton [routerLink]="item.url" [isActive]="item.isActive">
							@if (item.icon) {
								<ng-icon [name]="item.icon" />
							}
							<span>{{ item.title }}</span>
						</a>
						@if (item.items; as subItems) {
							<ul hlm-sidebar-menu-sub class="ml-0 border-l-0 px-1.5">
								@for (subItem of subItems; track subItem.title) {
									<li hlmSidebarMenuSubItem>
										<a hlmSidebarMenuSubButton [routerLink]="subItem.url" [isActive]="subItem.isActive">
											{{ subItem.title }}
										</a>
									</li>
								}
							</ul>
						}
					</li>
				}
			</ul>
		</hlm-sidebar-group>
	`,
})
export class NavMainFlat {
	public readonly groupLabel = input('Getting Started');
	public readonly items = input.required<
		{
			title: string;
			url: string;
			icon?: string;
			isActive?: boolean;
			items?: {
				title: string;
				url: string;
				isActive?: boolean;
			}[];
		}[]
	>();
}
