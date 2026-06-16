import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-dropdown-submenu',
	imports: [HlmDropdownMenuImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu" align="start">Open</button>

		<ng-template #menu>
			<hlm-dropdown-menu>
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>Team</button>
					<button hlmDropdownMenuItem [hlmDropdownMenuSubTrigger]="invite" side="right" align="start">
						Invite users
						<hlm-dropdown-menu-item-sub-indicator />
					</button>
					<button hlmDropdownMenuItem>
						New Team
						<hlm-dropdown-menu-shortcut>⌘+T</hlm-dropdown-menu-shortcut>
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>

		<ng-template #invite>
			<hlm-dropdown-menu-sub>
				<button hlmDropdownMenuItem>Email</button>
				<button hlmDropdownMenuItem>Message</button>
				<button hlmDropdownMenuItem [hlmDropdownMenuSubTrigger]="moreOptions" side="right" align="start">
					More options
					<hlm-dropdown-menu-item-sub-indicator />
				</button>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem>Advanced...</button>
			</hlm-dropdown-menu-sub>
		</ng-template>

		<ng-template #moreOptions>
			<hlm-dropdown-menu-sub>
				<button hlmDropdownMenuItem>Calendly</button>
				<button hlmDropdownMenuItem>Slack</button>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem>Webhook</button>
			</hlm-dropdown-menu-sub>
		</ng-template>
	`,
})
export class DropdownSubmenu {}
