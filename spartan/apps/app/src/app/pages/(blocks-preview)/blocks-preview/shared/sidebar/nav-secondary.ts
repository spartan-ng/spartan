import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLifeBuoy, lucideSend } from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-nav-secondary',
	imports: [HlmSidebarImports, NgIcon, RouterLink],
	providers: [provideIcons({ lucideLifeBuoy, lucideSend })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-sidebar-group>
			<div hlmSidebarGroupContent>
				<ul hlmSidebarMenu>
					@for (item of items(); track $index) {
						<li hlmSidebarMenuItem>
							<a hlmSidebarMenuButton size="sm" [routerLink]="item.url">
								<ng-icon [name]="item.icon" />
								{{ item.title }}
							</a>
						</li>
					}
				</ul>
			</div>
		</hlm-sidebar-group>
	`,
})
export class NavSecondary {
	public readonly items = input.required<
		{
			title: string;
			url: string;
			icon: string;
		}[]
	>();
}
