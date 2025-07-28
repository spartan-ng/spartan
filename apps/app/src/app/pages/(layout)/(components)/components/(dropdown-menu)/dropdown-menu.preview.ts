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
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import {
	HlmMenuComponent,
	HlmMenuGroupComponent,
	HlmMenuItemDirective,
	HlmMenuItemSubIndicatorComponent,
	HlmMenuLabelComponent,
	HlmMenuSeparatorComponent,
	HlmMenuShortcutComponent,
	HlmSubMenuComponent,
} from '@spartan-ng/helm/menu';

@Component({
	selector: 'spartan-dropdown-preview',
	imports: [
		BrnMenuTriggerDirective,
		HlmMenuComponent,
		HlmSubMenuComponent,
		HlmMenuItemDirective,
		HlmMenuItemSubIndicatorComponent,
		HlmMenuLabelComponent,
		HlmMenuShortcutComponent,
		HlmMenuSeparatorComponent,
		HlmMenuGroupComponent,
		HlmButtonDirective,
	],
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
		<div class="flex w-full items-center justify-center pt-[20%]">
			<button hlmBtn variant="outline" align="end" [brnMenuTriggerFor]="menu">Open</button>
		</div>
		<ng-template #menu>
			<hlm-menu class="w-56">
				<hlm-menu-label>My Account</hlm-menu-label>

				<hlm-menu-group>
					<button hlmMenuItem>
						<span>Profile</span>
						<hlm-menu-shortcut>⇧⌘P</hlm-menu-shortcut>
					</button>

					<button hlmMenuItem>
						<span>Billing</span>
						<hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
					</button>

					<button hlmMenuItem>
						<span>Settings</span>
						<hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
					</button>

					<button hlmMenuItem>
						<span>Keyboard shortcuts</span>
						<hlm-menu-shortcut>⌘K</hlm-menu-shortcut>
					</button>
				</hlm-menu-group>

				<hlm-menu-separator />

				<hlm-menu-group>
					<button hlmMenuItem>
						<span>Team</span>
						<hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
					</button>

					<button hlmMenuItem [brnMenuTriggerFor]="invite">
						<span>Invite Users</span>
						<hlm-menu-item-sub-indicator />
					</button>

					<button hlmMenuItem>
						<span>New Team</span>
						<hlm-menu-shortcut>⌘+T</hlm-menu-shortcut>
					</button>
				</hlm-menu-group>

				<hlm-menu-separator />

				<hlm-menu-group>
					<button hlmMenuItem>
						<span>GitHub</span>
					</button>

					<button hlmMenuItem>
						<span>Support</span>
					</button>

					<button hlmMenuItem disabled>
						<span>API</span>
					</button>
				</hlm-menu-group>

				<hlm-menu-separator />

				<button hlmMenuItem>
					Log out
					<hlm-menu-shortcut>⇧⌘Q</hlm-menu-shortcut>
				</button>
			</hlm-menu>
		</ng-template>

		<ng-template #invite>
			<hlm-sub-menu>
				<button hlmMenuItem>Email</button>

				<button hlmMenuItem>Message</button>
				<hlm-menu-separator />
				<button hlmMenuItem>More...</button>
			</hlm-sub-menu>
		</ng-template>
	`,
})
export class DropdownPreviewComponent {}

export const defaultImports = `
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import {
  HlmMenuComponent,
  HlmMenuGroupComponent,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent,
  HlmSubMenuComponent,
} from '@spartan-ng/helm/menu';
`;

export const defaultSkeleton = `
<button [brnMenuTriggerFor]="menu">Open</button>

<ng-template #menu>
  <hlm-menu>
    <hlm-menu-label>My Account</hlm-menu-label>
    <hlm-menu-separator />
    <hlm-menu-group>
      <button hlmMenuItem>
        Profile
        <hlm-menu-shortcut>⇧⌘P</hlm-menu-shortcut>
      </button>

      <hlm-menu-separator />

      <button hlmMenuItem [brnMenuTriggerFor]="invite">
        Invite Users
        <hlm-menu-item-sub-indicator />
      </button>
    </hlm-menu-group>
  </hlm-menu>
</ng-template>
`;
