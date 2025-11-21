import { Component } from '@angular/core';
import { HlmContextMenuImports } from '@spartan-ng/helm/context-menu';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-context-menu-preview',
	imports: [HlmDropdownMenuImports, HlmContextMenuImports],
	template: `
		<div
			[hlmContextMenuTrigger]="menu"
			align="start"
			side="right"
			class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm"
		>
			Right click here
		</div>

		<ng-template #menu>
			<hlm-dropdown-menu class="w-64">
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem inset>
						Back
						<hlm-dropdown-menu-shortcut>⌘[</hlm-dropdown-menu-shortcut>
					</button>

					<button hlmDropdownMenuItem disabled inset>
						Forward
						<hlm-dropdown-menu-shortcut>⌘]</hlm-dropdown-menu-shortcut>
					</button>

					<button hlmDropdownMenuItem disabled inset>
						Reload
						<hlm-dropdown-menu-shortcut>⌘R</hlm-dropdown-menu-shortcut>
					</button>

					<button inset hlmDropdownMenuItem [hlmDropdownMenuTrigger]="moreTools" align="start" side="right">
						More Tools
						<hlm-dropdown-menu-item-sub-indicator />
					</button>
				</hlm-dropdown-menu-group>

				<hlm-dropdown-menu-separator />

				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuCheckbox checked>
						<hlm-dropdown-menu-checkbox-indicator />
						Show Booksmarks Bar
						<hlm-dropdown-menu-shortcut>⌘⇧B</hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuCheckbox>
						<hlm-dropdown-menu-checkbox-indicator />
						Show full URLs
					</button>
				</hlm-dropdown-menu-group>

				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-label inset>People</hlm-dropdown-menu-label>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuRadio checked>
						<hlm-dropdown-menu-radio-indicator />
						Pedro Duarte
					</button>
					<button hlmDropdownMenuRadio>
						<hlm-dropdown-menu-radio-indicator />
						Colm Tuite
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>

		<ng-template #moreTools>
			<hlm-dropdown-menu-sub class="w-48">
				<button hlmDropdownMenuItem>
					Save Page as...
					<hlm-dropdown-menu-shortcut>⇧⌘S</hlm-dropdown-menu-shortcut>
				</button>
				<button hlmDropdownMenuItem>Create Shortcut...</button>
				<button hlmDropdownMenuItem>Name Window...</button>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem>Developer Tools</button>
			</hlm-dropdown-menu-sub>
		</ng-template>
	`,
})
export class ContextMenuPreview {}

export const defaultImports = `
import { HlmContextMenuImports } from '@spartan-ng/helm/context-menu';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
`;

export const defaultSkeleton = `
<div [hlmContextMenuTrigger]="menu">Right click here</div>

<ng-template #menu>
  <hlm-dropdown-menu>
    <hlm-dropdown-menu-group>
      <button hlmDropdownMenuItem>Profile</button>
      <button hlmDropdownMenuItem>Billing</button>
      <button hlmDropdownMenuItem>Team</button>
      <button hlmDropdownMenuItem>Subscription</button>
    </hlm-dropdown-menu-group>
  </hlm-dropdown-menu>
</ng-template>
`;
