import { Component } from '@angular/core';

import { BrnContextMenuTrigger, BrnMenuTrigger } from '@spartan-ng/brain/menu';

import {
	HlmMenu,
	HlmMenuGroup,
	HlmMenuItem,
	HlmMenuItemCheck,
	HlmMenuItemCheckbox,
	HlmMenuItemRadio,
	HlmMenuItemRadioIndicator,
	HlmMenuItemSubIndicator,
	HlmMenuLabel,
	HlmMenuSeparator,
	HlmMenuShortcut,
	HlmSubMenu,
} from '@spartan-ng/helm/menu';

@Component({
	selector: 'spartan-context-menu-preview',
	imports: [
		BrnMenuTrigger,
		BrnContextMenuTrigger,
		HlmMenu,
		HlmSubMenu,
		HlmMenuItem,
		HlmMenuItemSubIndicator,
		HlmMenuLabel,
		HlmMenuShortcut,
		HlmMenuSeparator,
		HlmMenuItemCheck,
		HlmMenuItemRadio,
		HlmMenuGroup,
		HlmMenuItemCheckbox,
		HlmMenuItemRadio,
		HlmMenuItemRadioIndicator,
	],
	template: `
		<div
			[brnCtxMenuTriggerFor]="menu"
			class="border-border flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm"
		>
			Right click here
		</div>

		<ng-template #menu>
			<hlm-menu class="w-64">
				<hlm-menu-group>
					<button inset hlmMenuItem>
						Back
						<hlm-menu-shortcut>⌘[</hlm-menu-shortcut>
					</button>

					<button disabled inset hlmMenuItem>
						Forward
						<hlm-menu-shortcut>⌘]</hlm-menu-shortcut>
					</button>

					<button disabled inset hlmMenuItem>
						Reload
						<hlm-menu-shortcut>⌘R</hlm-menu-shortcut>
					</button>

					<button inset hlmMenuItem [brnMenuTriggerFor]="moreTools">
						More Tools
						<hlm-menu-item-sub-indicator />
					</button>
				</hlm-menu-group>

				<hlm-menu-separator />

				<hlm-menu-group>
					<button hlmMenuItemCheckbox checked>
						<hlm-menu-item-check />
						Show Booksmarks Bar
						<hlm-menu-shortcut>⌘⇧B</hlm-menu-shortcut>
					</button>
					<button hlmMenuItemCheckbox>
						<hlm-menu-item-check />
						Show full URLs
					</button>
				</hlm-menu-group>

				<hlm-menu-separator />
				<hlm-menu-label inset>People</hlm-menu-label>
				<hlm-menu-separator />
				<hlm-menu-group>
					<button hlmMenuItemRadio checked>
						<hlm-menu-item-radio />
						Pedro Duarte
					</button>
					<button hlmMenuItemRadio>
						<hlm-menu-item-radio />
						Colm Tuite
					</button>
				</hlm-menu-group>
			</hlm-menu>
		</ng-template>

		<ng-template #moreTools>
			<hlm-sub-menu class="w-48">
				<button hlmMenuItem>
					Save Page as...
					<hlm-menu-shortcut>⇧⌘S</hlm-menu-shortcut>
				</button>
				<button hlmMenuItem>Create Shortcut...</button>
				<button hlmMenuItem>Name Window...</button>
				<hlm-menu-separator />
				<button hlmMenuItem>Developer Tools</button>
			</hlm-sub-menu>
		</ng-template>
	`,
})
export class ContextMenuPreview {}

export const defaultImports = `
import { BrnContextMenuTrigger, BrnMenuTrigger } from '@spartan-ng/brain/menu';
import {
  HlmMenu
  HlmMenuGroup
  HlmMenuItemCheck
  HlmMenuItemCheckbox
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
<div [brnCtxMenuTriggerFor]="menu">Right click here</div>

<ng-template #menu>
  <hlm-menu class="w-64">
    <hlm-menu-group>
      <button inset hlmMenuItem>
        Save
        <hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
      </button>
    </hlm-menu-group>
  </hlm-menu>
</ng-template>
`;
