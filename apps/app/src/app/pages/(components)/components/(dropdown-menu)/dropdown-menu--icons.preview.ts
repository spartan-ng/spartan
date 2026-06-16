import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCreditCard, lucideLogOut, lucideSettings, lucideUser } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-dropdown-icons',
	imports: [HlmDropdownMenuImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideUser, lucideCreditCard, lucideSettings, lucideLogOut })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu" align="start">Open</button>

		<ng-template #menu>
			<hlm-dropdown-menu>
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideUser" />
						Profile
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideCreditCard" />
						Billing
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideSettings" />
						Settings
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem variant="destructive">
						<ng-icon name="lucideLogOut" />
						Log out
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class DropdownIcons {}
