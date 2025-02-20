import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
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
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
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
} from '@spartan-ng/ui-menu-helm';

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
		HlmMenuItemIconDirective,
		HlmMenuGroupComponent,
		HlmButtonDirective,
		NgIcon,
		HlmIconDirective,
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
				<hlm-menu-separator />
				<hlm-menu-group>
					<button hlmMenuItem>
						<ng-icon hlm name="lucideUser" hlmMenuIcon />
						<span>Profile</span>
						<hlm-menu-shortcut>⇧⌘P</hlm-menu-shortcut>
					</button>

					<button hlmMenuItem>
						<ng-icon hlm name="lucideLayers" hlmMenuIcon />
						<span>Billing</span>
						<hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
					</button>

					<button hlmMenuItem>
						<ng-icon hlm name="lucideCog" hlmMenuIcon />
						<span>Settings</span>
						<hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
					</button>

					<button hlmMenuItem>
						<ng-icon hlm name="lucideKeyboard" hlmMenuIcon />
						<span>Keyboard Shortcuts</span>
						<hlm-menu-shortcut>⌘K</hlm-menu-shortcut>
					</button>
				</hlm-menu-group>

				<hlm-menu-separator />

				<hlm-menu-group>
					<button hlmMenuItem>
						<ng-icon hlm name="lucideCircleUser" hlmMenuIcon />
						<span>Team</span>
						<hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
					</button>

					<button hlmMenuItem [brnMenuTriggerFor]="invite">
						<ng-icon hlm name="lucideSmile" hlmMenuIcon />
						<span>Invite Users</span>
						<hlm-menu-item-sub-indicator />
					</button>

					<button hlmMenuItem>
						<ng-icon hlm name="lucidePlus" hlmMenuIcon />
						<span>New Team</span>
						<hlm-menu-shortcut>⌘+T</hlm-menu-shortcut>
					</button>
				</hlm-menu-group>

				<hlm-menu-separator />

				<hlm-menu-group>
					<button hlmMenuItem>
						<ng-icon hlm name="lucideGithub" hlmMenuIcon />
						<span>Github</span>
					</button>

					<button hlmMenuItem>
						<ng-icon hlm name="lucideCircleHelp" hlmMenuIcon />
						<span>Support</span>
					</button>

					<button hlmMenuItem disabled>
						<ng-icon hlm name="lucideCode" hlmMenuIcon />
						<span>API</span>
					</button>
				</hlm-menu-group>

				<hlm-menu-separator />

				<button hlmMenuItem>
					<ng-icon hlm name="lucideLogOut" hlmMenuIcon />
					<span>Logout</span>
					<hlm-menu-shortcut>⇧⌘Q</hlm-menu-shortcut>
				</button>
			</hlm-menu>
		</ng-template>

		<ng-template #invite>
			<hlm-sub-menu>
				<button hlmMenuItem>
					<ng-icon hlm name="lucideMail" hlmMenuIcon />
					Email
				</button>

				<button hlmMenuItem>
					<ng-icon hlm name="lucideMessageSquare" hlmMenuIcon />
					Message
				</button>
				<hlm-menu-separator />
				<button hlmMenuItem>
					<ng-icon hlm name="lucideCirclePlus" hlmMenuIcon />
					<span>More</span>
				</button>
			</hlm-sub-menu>
		</ng-template>
	`,
})
export class DropdownPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCircleUser,
  lucideLayers,
  lucideMessageSquare,
  lucideCode,
  lucideMail,
  lucideLogOut,
  lucideSmile,
  lucideCog,
  lucideGithub,
  lucideKeyboard,
  lucideUser,
  lucidePlus,
  lucideCirclePlus,
  lucideCircleHelp,
} from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
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
} from '@spartan-ng/ui-menu-helm';

@Component({
  selector: 'spartan-dropdown-preview',
  standalone: true,
  imports: [
    BrnMenuTriggerDirective,

    HlmMenuComponent,
    HlmSubMenuComponent,
    HlmMenuItemDirective,
    HlmMenuItemSubIndicatorComponent,
    HlmMenuLabelComponent,
    HlmMenuShortcutComponent,
    HlmMenuSeparatorComponent,
    HlmMenuItemIconDirective,
    HlmMenuGroupComponent,

    HlmButtonDirective,
    HlmIconDirective,
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
  template: \`
    <div class="flex w-full items-center justify-center pt-[20%]">
      <button hlmBtn variant="outline" align="end" [brnMenuTriggerFor]="menu">Open</button>
    </div>
    <ng-template #menu>
      <hlm-menu class="w-56">
        <hlm-menu-label>My Account</hlm-menu-label>
        <hlm-menu-separator />
        <hlm-menu-group>
          <button hlmMenuItem>
            <ng-icon hlm name="lucideUser" hlmMenuIcon />
            <span>Profile</span>
            <hlm-menu-shortcut>⇧⌘P</hlm-menu-shortcut>
          </button>

          <button hlmMenuItem>
            <ng-icon hlm name="lucideLayers" hlmMenuIcon />
            <span>Billing</span>
            <hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
          </button>

          <button hlmMenuItem>
            <ng-icon hlm name="lucideCog" hlmMenuIcon />
            <span>Settings</span>
            <hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
          </button>

          <button hlmMenuItem>
            <ng-icon hlm name="lucideKeyboard" hlmMenuIcon />
            <span>Keyboard Shortcuts</span>
            <hlm-menu-shortcut>⌘K</hlm-menu-shortcut>
          </button>
        </hlm-menu-group>

        <hlm-menu-separator />

        <hlm-menu-group>
          <button hlmMenuItem>
            <ng-icon hlm name="lucideCircleUser" hlmMenuIcon />
            <span>Team</span>
            <hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
          </button>

          <button hlmMenuItem [brnMenuTriggerFor]="invite">
            <ng-icon hlm name="lucideSmile" hlmMenuIcon />
            <span>Invite Users</span>
            <hlm-menu-item-sub-indicator />
          </button>

          <button hlmMenuItem>
            <ng-icon hlm name="lucidePlus" hlmMenuIcon />
            <span>New Team</span>
            <hlm-menu-shortcut>⌘+T</hlm-menu-shortcut>
          </button>
        </hlm-menu-group>

        <hlm-menu-separator />

        <hlm-menu-group>
          <button hlmMenuItem>
            <ng-icon hlm name="lucideGithub" hlmMenuIcon />
            <span>Github</span>
          </button>

          <button hlmMenuItem>
            <ng-icon hlm name="lucideCircleHelp" hlmMenuIcon />
            <span>Support</span>
          </button>

          <button hlmMenuItem disabled>
            <ng-icon hlm name="lucideCode" hlmMenuIcon />
            <span>API</span>
          </button>
        </hlm-menu-group>

        <hlm-menu-separator />

        <button hlmMenuItem>
          <ng-icon hlm name="lucideLogOut" hlmMenuIcon />
          <span>Logout</span>
          <hlm-menu-shortcut>⇧⌘Q</hlm-menu-shortcut>
        </button>
      </hlm-menu>
    </ng-template>

    <ng-template #invite>
      <hlm-sub-menu>
        <button hlmMenuItem>
          <ng-icon hlm name="lucideMail" hlmMenuIcon />
          Email
        </button>

        <button hlmMenuItem>
          <ng-icon hlm name="lucideMessageSquare" hlmMenuIcon />
          Message
        </button>
        <hlm-menu-separator />
        <button hlmMenuItem>
          <ng-icon hlm name="lucideCirclePlus" hlmMenuIcon />
          <span>More</span>
        </button>
      </hlm-sub-menu>
    </ng-template>
  \`,
})
export class DropdownPreviewComponent {}
`;

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
} from '@spartan-ng/ui-menu-helm';
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
