import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmContextMenuImports } from '@spartan-ng/helm/context-menu';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-context-menu-preview',
	imports: [HlmDropdownMenuImports, HlmContextMenuImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			[hlmContextMenuTrigger]="menu"
			align="start"
			side="right"
			class="flex aspect-video w-full min-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
		>
			<span class="hidden pointer-fine:inline-block">Right click here</span>
			<span class="hidden pointer-coarse:inline-block">Long press here</span>
		</div>

		<ng-template #menu>
			<hlm-dropdown-menu class="w-64">
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						Back
						<hlm-dropdown-menu-shortcut>⌘[</hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuItem disabled>
						Forward
						<hlm-dropdown-menu-shortcut>⌘]</hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuItem>
						Reload
						<hlm-dropdown-menu-shortcut>⌘R</hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuItem [hlmDropdownMenuSubTrigger]="moreTools" align="start" side="right">
						More Tools
						<hlm-dropdown-menu-item-sub-indicator />
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuCheckbox checked>
						Show Booksmarks Bar
						<hlm-dropdown-menu-checkbox-indicator />
					</button>
					<button hlmDropdownMenuCheckbox>
						Show full URLs
						<hlm-dropdown-menu-checkbox-indicator />
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<hlm-dropdown-menu-label>People</hlm-dropdown-menu-label>
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
			<hlm-dropdown-menu-sub class="w-44">
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>Save Page...</button>
					<button hlmDropdownMenuItem>Create Shortcut...</button>
					<button hlmDropdownMenuItem>Name Window...</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>Developer Tools</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem variant="destructive">Delete</button>
				</hlm-dropdown-menu-group>
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
