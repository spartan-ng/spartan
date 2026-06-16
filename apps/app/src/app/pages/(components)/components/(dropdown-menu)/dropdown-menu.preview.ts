import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-dropdown-preview',
	imports: [HlmDropdownMenuImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu" align="start">Open</button>

		<ng-template #menu>
			<hlm-dropdown-menu class="w-40">
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
						Team
						<hlm-dropdown-menu-shortcut>⌘B</hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuItem side="right" align="start" [hlmDropdownMenuSubTrigger]="invite">
						Invite Users
						<hlm-dropdown-menu-item-sub-indicator />
					</button>
					<button hlmDropdownMenuItem>
						New Team
						<hlm-dropdown-menu-shortcut>⌘+T</hlm-dropdown-menu-shortcut>
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>GitHub</button>
					<button hlmDropdownMenuItem>Support</button>
					<button hlmDropdownMenuItem disabled>API</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem>
					Log out
					<hlm-dropdown-menu-shortcut>⇧⌘Q</hlm-dropdown-menu-shortcut>
				</button>
			</hlm-dropdown-menu>
		</ng-template>

		<ng-template #invite>
			<hlm-dropdown-menu-sub>
				<button hlmDropdownMenuItem>Email</button>
				<button hlmDropdownMenuItem>Message</button>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem>More...</button>
			</hlm-dropdown-menu-sub>
		</ng-template>
	`,
})
export class DropdownPreview {}

export const defaultImports = `
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
`;

export const defaultSkeleton = `
<button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu">Open</button>

<ng-template #menu>
  <hlm-dropdown-menu>
    <hlm-dropdown-menu-group>
      <hlm-dropdown-menu-label>My Account</hlm-dropdown-menu-label>
      <button hlmDropdownMenuItem>Profile</button>
      <button hlmDropdownMenuItem>Billing</button>
    </hlm-dropdown-menu-group>
    <hlm-dropdown-menu-separator />
    <hlm-dropdown-menu-group>
      <button hlmDropdownMenuItem>Team</button>
      <button hlmDropdownMenuItem>Subscription</button>
    </hlm-dropdown-menu-group>
  </hlm-dropdown-menu>
</ng-template>
`;
