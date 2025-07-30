import { Component } from '@angular/core';
import { BrnMenuTrigger } from '@spartan-ng/brain/menu';

import {
	HlmMenu,
	HlmMenuBar,
	HlmMenuBarItem,
	HlmMenuGroup,
	HlmMenuItem,
	HlmMenuItemCheck,
	HlmMenuItemCheckbox,
	HlmMenuItemRadio,
	HlmMenuItemRadioIndicator,
	HlmMenuItemSubIndicator,
	HlmMenuSeparator,
	HlmMenuShortcut,
	HlmSubMenu,
} from '@spartan-ng/helm/menu';

@Component({
	selector: 'spartan-menubar-preview',
	imports: [
		BrnMenuTrigger,
		HlmMenu,
		HlmMenuBar,
		HlmSubMenu,
		HlmMenuItem,
		HlmMenuItemSubIndicator,
		HlmMenuShortcut,
		HlmMenuSeparator,
		HlmMenuBarItem,
		HlmMenuItemCheck,
		HlmMenuItemRadio,
		HlmMenuGroup,
		HlmMenuItemCheckbox,
		HlmMenuItemRadio,
		HlmMenuItemRadioIndicator,
	],
	template: `
		<hlm-menu-bar class="w-fit">
			<button hlmMenuBarItem [brnMenuTriggerFor]="file">File</button>
			<button hlmMenuBarItem [brnMenuTriggerFor]="edit">Edit</button>
			<button hlmMenuBarItem [brnMenuTriggerFor]="view">View</button>
			<button hlmMenuBarItem [brnMenuTriggerFor]="profiles">Profiles</button>
		</hlm-menu-bar>

		<ng-template #file>
			<hlm-menu variant="menubar" class="w-48">
				<hlm-menu-group>
					<button hlmMenuItem>
						New Tab
						<hlm-menu-shortcut>⌘T</hlm-menu-shortcut>
					</button>
					<button hlmMenuItem>
						New Window
						<hlm-menu-shortcut>⌘N</hlm-menu-shortcut>
					</button>
					<button hlmMenuItem disabled>New Incognito Window</button>
				</hlm-menu-group>

				<hlm-menu-separator />

				<button hlmMenuItem [brnMenuTriggerFor]="share">
					Share
					<hlm-menu-item-sub-indicator />
				</button>

				<hlm-menu-separator />

				<button hlmMenuItem>
					Print...
					<hlm-menu-shortcut>⌘P</hlm-menu-shortcut>
				</button>
			</hlm-menu>
		</ng-template>
		<ng-template #share>
			<hlm-sub-menu>
				<button hlmMenuItem>Email link</button>
				<button hlmMenuItem>Messages</button>
				<button hlmMenuItem>Notes</button>
			</hlm-sub-menu>
		</ng-template>

		<ng-template #edit>
			<hlm-menu variant="menubar" class="w-48">
				<hlm-menu-group>
					<button hlmMenuItem>
						Undo
						<hlm-menu-shortcut>⌘Z</hlm-menu-shortcut>
					</button>
					<button hlmMenuItem>
						Redo
						<hlm-menu-shortcut>⇧⌘Z</hlm-menu-shortcut>
					</button>
				</hlm-menu-group>

				<hlm-menu-separator />

				<button hlmMenuItem [brnMenuTriggerFor]="find">
					Share
					<hlm-menu-item-sub-indicator />
				</button>

				<hlm-menu-separator />

				<button hlmMenuItem>Cut</button>
				<button hlmMenuItem>Copy</button>
				<button hlmMenuItem>Paste</button>
			</hlm-menu>
		</ng-template>
		<ng-template #find>
			<hlm-sub-menu>
				<button hlmMenuItem>Search the web</button>
				<hlm-menu-separator />
				<button hlmMenuItem>Find...</button>
				<button hlmMenuItem>Find Next</button>
				<button hlmMenuItem>Find Previous</button>
			</hlm-sub-menu>
		</ng-template>

		<ng-template #view>
			<hlm-menu variant="menubar">
				<button hlmMenuItemCheckbox>
					<hlm-menu-item-check />
					Always Show Bookmarks Bar
				</button>
				<button hlmMenuItemCheckbox checked>
					<hlm-menu-item-check />
					Always Show Full URLs
				</button>
				<hlm-menu-separator />
				<button inset hlmMenuItem>
					Reload
					<hlm-menu-shortcut>⌘R</hlm-menu-shortcut>
				</button>
				<button inset disabled hlmMenuItem>
					Force Reload
					<hlm-menu-shortcut>⇧⌘R</hlm-menu-shortcut>
				</button>
				<hlm-menu-separator />
				<button inset hlmMenuItem>Toggle Fullscreen</button>
				<hlm-menu-separator />
				<button inset hlmMenuItem>Hide Sidebar</button>
			</hlm-menu>
		</ng-template>

		<ng-template #profiles>
			<hlm-menu variant="menubar" class="w-48">
				<button hlmMenuItemRadio>
					<hlm-menu-item-radio />
					Andy
				</button>
				<button hlmMenuItemRadio checked>
					<hlm-menu-item-radio />
					Benoit
				</button>
				<button hlmMenuItemRadio>
					<hlm-menu-item-radio />
					Lewis
				</button>
				<hlm-menu-separator />
				<button inset hlmMenuItem>Edit...</button>
				<hlm-menu-separator />
				<button inset hlmMenuItem>Add Profile...</button>
			</hlm-menu>
		</ng-template>
	`,
})
export class MenubarPreview {}

export const defaultImports = `
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import {
  HlmMenuBar
  HlmMenuBarItem
  HlmMenu
  HlmMenuGroup
  HlmMenuItemCheckbox
  HlmMenuItemCheck
  HlmMenuItem
  HlmMenuItemIcon
  HlmMenuItemRadio
  HlmMenuItemRadio
  HlmMenuItemSubIndicator
  HlmMenuLabel
  HlmMenuSeparator
  HlmMenuShortcut
  HlmSubMenu
} from '@spartan-ng/helm/menu';
`;
export const defaultSkeleton = `
<hlm-menu-bar class='w-fit'>
    <button hlmMenuBarItem brnMenuItem [brnMenuTriggerFor]='file'>File</button>
</div>

<ng-template #file>
  <hlm-menu variant='menubar' class='w-48'>
    <div brnMenuGroup>
      <button hlmMenuItem>
        New Tab
        <hlm-menu-shortcut>⌘T</hlm-menu-shortcut>
      </button>
    </div>

    <hlm-menu-separator />

    <button hlmMenuItem [brnMenuTriggerFor]='share'>
      Share
      <hlm-menu-item-sub-indicator />
    </button>
  </hlm-menu>
</ng-template>
<ng-template #share>
  <hlm-sub-menu>
    <button hlmMenuItem>Email link</button>
  </hlm-sub-menu>
</ng-template>
`;
