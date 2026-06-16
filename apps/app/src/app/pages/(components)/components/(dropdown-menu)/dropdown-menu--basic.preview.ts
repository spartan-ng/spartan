import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-dropdown-basic',
	imports: [HlmDropdownMenuImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu" align="start">Open</button>

		<ng-template #menu>
			<hlm-dropdown-menu>
				<hlm-dropdown-menu-group>
					<hlm-dropdown-menu-label>My Account</hlm-dropdown-menu-label>
					<button hlmDropdownMenuItem>Profile</button>
					<button hlmDropdownMenuItem>Billing</button>
					<button hlmDropdownMenuItem>Settings</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>GitHub</button>
					<button hlmDropdownMenuItem>Support</button>
					<button hlmDropdownMenuItem disabled>API</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class DropdownBasic {}
