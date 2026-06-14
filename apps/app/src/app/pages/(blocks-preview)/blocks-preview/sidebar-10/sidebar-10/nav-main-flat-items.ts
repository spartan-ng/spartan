import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideHome,
	lucideInbox,
	lucideMessageCircleQuestion,
	lucideSearch,
	lucideSettings2,
	lucideSparkles,
	lucideSquareTerminal,
} from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-nav-main-flat-items',
	imports: [HlmSidebarImports, NgIcon],
	providers: [
		provideIcons({
			lucideSquareTerminal,
			lucideHome,
			lucideInbox,
			lucideSearch,
			lucideSettings2,
			lucideSparkles,
			lucideMessageCircleQuestion,
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-sidebar-group>
			<div hlmSidebarGroupContent>
				<ul hlmSidebarMenu>
					<li hlmSidebarMenuItem>
						<button hlmSidebarMenuButton>
							<ng-icon name="lucideSearch" />
							<span>Search</span>
						</button>
					</li>
					<li hlmSidebarMenuItem>
						<button hlmSidebarMenuButton [isActive]="true">
							<ng-icon name="lucideInbox" />
							<span>Inbox</span>
						</button>
					</li>
					<li hlmSidebarMenuItem>
						<button hlmSidebarMenuButton>
							<ng-icon name="lucideHome" />
							<span>Home</span>
						</button>
					</li>
					<li hlmSidebarMenuItem>
						<button hlmSidebarMenuButton>
							<ng-icon name="lucideSettings2" />
							<span>Settings</span>
						</button>
					</li>
				</ul>
			</div>
		</hlm-sidebar-group>
	`,
})
export class NavMainFlatItems {}
