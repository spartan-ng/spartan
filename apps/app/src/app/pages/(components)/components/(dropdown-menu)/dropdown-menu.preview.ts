import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
	lucideCircleHelp,
	lucideCirclePlus,
	lucideCircleUser,
	lucideCode,
	lucideCog,
	lucideGithub,
	lucideKeyboard,
	lucideLayers,
	lucideLogOut,
	lucideMail,
	lucideMessageSquare,
	lucidePlus,
	lucideSmile,
	lucideUser,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-dropdown-preview',
	imports: [HlmDropdownMenuImports, HlmButtonImports],
	providers: [
		provideIcons({
			lucideUser,
			lucideLayers,
			lucideCog,
			lucideKeyboard,
			lucideCircleUser,
			lucideSmile,
			lucidePlus,
			lucideGithub,
			lucideCircleHelp,
			lucideCode,
			lucideLogOut,
			lucideMail,
			lucideMessageSquare,
			lucideCirclePlus,
		}),
	],
	template: `
		<button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu">Open</button>

		<ng-template #menu>
			<hlm-dropdown-menu class="w-56">
				<hlm-dropdown-menu-label>My Account</hlm-dropdown-menu-label>

				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						<span>Profile</span>
						<hlm-dropdown-menu-shortcut>⇧⌘P</hlm-dropdown-menu-shortcut>
					</button>

					<button hlmDropdownMenuItem>
						<span>Billing</span>
						<hlm-dropdown-menu-shortcut>⌘B</hlm-dropdown-menu-shortcut>
					</button>

					<button hlmDropdownMenuItem>
						<span>Settings</span>
						<hlm-dropdown-menu-shortcut>⌘S</hlm-dropdown-menu-shortcut>
					</button>

					<button hlmDropdownMenuItem>
						<span>Keyboard shortcuts</span>
						<hlm-dropdown-menu-shortcut>⌘K</hlm-dropdown-menu-shortcut>
					</button>
				</hlm-dropdown-menu-group>

				<hlm-dropdown-menu-separator />

				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						<span>Team</span>
						<hlm-dropdown-menu-shortcut>⌘B</hlm-dropdown-menu-shortcut>
					</button>

					<button hlmDropdownMenuItem side="right" align="start" [hlmDropdownMenuTrigger]="invite">
						<span>Invite Users</span>
						<hlm-dropdown-menu-item-sub-indicator />
					</button>

					<button hlmDropdownMenuItem>
						<span>New Team</span>
						<hlm-dropdown-menu-shortcut>⌘+T</hlm-dropdown-menu-shortcut>
					</button>
				</hlm-dropdown-menu-group>

				<hlm-dropdown-menu-separator />

				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						<span>GitHub</span>
					</button>

					<button hlmDropdownMenuItem>
						<span>Support</span>
					</button>

					<button hlmDropdownMenuItem disabled>
						<span>API</span>
					</button>
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
<button [hlmDropdownMenuTrigger]="menu">Open</button>

<ng-template #menu>
  <hlm-dropdown-menu>
    <hlm-dropdown-menu-label>My Account</hlm-dropdown-menu-label>
    <hlm-dropdown-menu-separator />
    <hlm-dropdown-menu-group>
      <button hlmDropdownMenuItem>
        Profile
        <hlm-dropdown-menu-shortcut>⇧⌘P</hlm-dropdown-menu-shortcut>
      </button>

      <hlm-dropdown-menu-separator />

      <button hlmDropdownMenuItem [hlmDropdownMenuTrigger]="invite">
        Invite Users
        <hlm-dropdown-menu-item-sub-indicator />
      </button>
    </hlm-dropdown-menu-group>
  </hlm-dropdown-menu>
</ng-template>
`;
