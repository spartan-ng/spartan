import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLifeBuoy, lucideSend } from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-nav-secondary',
	imports: [HlmSidebarImports, NgIcon],
	providers: [provideIcons({ lucideLifeBuoy, lucideSend })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-sidebar-group>
			<div hlmSidebarGroupContent>
				<ul hlmSidebarMenu>
					<li hlmSidebarMenuItem>
						<a hlmSidebarMenuButton size="sm" href="#">
							<ng-icon name="lucideLifeBuoy" />
							Support
						</a>
					</li>
					<li hlmSidebarMenuItem>
						<a hlmSidebarMenuButton size="sm" href="#">
							<ng-icon name="lucideSend" />
							Feedback
						</a>
					</li>
				</ul>
			</div>
		</hlm-sidebar-group>
	`,
})
export class NavSecondary {}
