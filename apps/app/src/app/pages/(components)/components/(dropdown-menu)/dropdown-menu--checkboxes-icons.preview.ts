import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideMail, lucideMessageSquare } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-dropdown-checkboxes-icons',
	imports: [HlmDropdownMenuImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideMail, lucideBell, lucideMessageSquare })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu">Open</button>

		<ng-template #menu>
			<hlm-dropdown-menu class="w-52">
				<hlm-dropdown-menu-group>
					<hlm-dropdown-menu-label>Notification Preferences</hlm-dropdown-menu-label>

					<button hlmDropdownMenuCheckbox [checked]="email()" (triggered)="email.set(!email())">
						<ng-icon name="lucideMail" />
						Email notifications
						<hlm-dropdown-menu-checkbox-indicator />
					</button>

					<button hlmDropdownMenuCheckbox [checked]="sms()" (triggered)="sms.set(!sms())">
						<ng-icon name="lucideMessageSquare" />
						SMS notifications
						<hlm-dropdown-menu-checkbox-indicator />
					</button>

					<button hlmDropdownMenuCheckbox [checked]="push()" (triggered)="push.set(!push())">
						<ng-icon name="lucideBell" />
						Push notifications
						<hlm-dropdown-menu-checkbox-indicator />
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class DropdownCheckboxesIcons {
	public readonly email = signal(true);
	public readonly sms = signal(false);
	public readonly push = signal(true);
}
