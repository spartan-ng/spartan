import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-dropdown-shortcuts',
	imports: [HlmDropdownMenuImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu" align="start">Open</button>

		<ng-template #menu>
			<hlm-dropdown-menu>
				<hlm-dropdown-menu-group>
					<hlm-dropdown-menu-label>My Account</hlm-dropdown-menu-label>
					<button hlmDropdownMenuItem>
						Profile
						<hlm-dropdown-menu-shortcut>⇧⌘P</hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuItem>
						Billing
						<hlm-dropdown-menu-shortcut>⌘B</hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuItem>
						Settings
						<hlm-dropdown-menu-shortcut>⌘S</hlm-dropdown-menu-shortcut>
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						Log out
						<hlm-dropdown-menu-shortcut>⇧⌘Q</hlm-dropdown-menu-shortcut>
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class DropdownShortcuts {}
