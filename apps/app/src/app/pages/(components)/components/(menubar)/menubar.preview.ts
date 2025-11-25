import { Component } from '@angular/core';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';

@Component({
	selector: 'spartan-menubar-preview',
	imports: [HlmMenubarImports, HlmDropdownMenuImports],
	template: `
		<hlm-menubar>
			<button [hlmMenubarTrigger]="file">File</button>
			<button [hlmMenubarTrigger]="edit">Edit</button>
			<button [hlmMenubarTrigger]="view">View</button>
			<button [hlmMenubarTrigger]="profiles">Profiles</button>
		</hlm-menubar>

		<ng-template #file>
			<hlm-dropdown-menu sideOffset="1.5">
				<button hlmDropdownMenuItem>
					New Tab
					<hlm-dropdown-menu-shortcut>⌘</hlm-dropdown-menu-shortcut>
				</button>
				<button hlmDropdownMenuItem>New Window</button>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem>Share</button>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem>Print</button>
			</hlm-dropdown-menu>
		</ng-template>
		<ng-template #share>
			<hlm-dropdown-menu-sub>
				<button hlmDropdownMenuItem>Email link</button>
				<button hlmDropdownMenuItem>Messages</button>
				<button hlmDropdownMenuItem>Notes</button>
			</hlm-dropdown-menu-sub>
		</ng-template>

		<ng-template #edit>
			<hlm-dropdown-menu sideOffset="1.5" class="w-48">
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						Undo
						<hlm-dropdown-menu-shortcut>⌘Z</hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuItem>
						Redo
						<hlm-dropdown-menu-shortcut>⇧⌘Z</hlm-dropdown-menu-shortcut>
					</button>
				</hlm-dropdown-menu-group>

				<hlm-dropdown-menu-separator />

				<button hlmDropdownMenuItem align="start" side="right" [hlmDropdownMenuTrigger]="find">
					Share
					<hlm-dropdown-menu-item-sub-indicator />
				</button>

				<hlm-dropdown-menu-separator />

				<button hlmDropdownMenuItem>Cut</button>
				<button hlmDropdownMenuItem>Copy</button>
				<button hlmDropdownMenuItem>Paste</button>
			</hlm-dropdown-menu>
		</ng-template>
		<ng-template #find>
			<hlm-dropdown-menu-sub>
				<button hlmDropdownMenuItem>Search the web</button>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem>Find...</button>
				<button hlmDropdownMenuItem>Find Next</button>
				<button hlmDropdownMenuItem>Find Previous</button>
			</hlm-dropdown-menu-sub>
		</ng-template>

		<ng-template #view>
			<hlm-dropdown-menu sideOffset="1.5">
				<button hlmDropdownMenuCheckbox>
					<hlm-dropdown-menu-checkbox-indicator />
					Always Show Bookmarks Bar
				</button>
				<button hlmDropdownMenuCheckbox checked>
					<hlm-dropdown-menu-checkbox-indicator />
					Always Show Full URLs
				</button>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem inset>
					Reload
					<hlm-dropdown-menu-shortcut>⌘R</hlm-dropdown-menu-shortcut>
				</button>
				<button hlmDropdownMenuItem inset disabled>
					Force Reload
					<hlm-dropdown-menu-shortcut>⇧⌘R</hlm-dropdown-menu-shortcut>
				</button>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem inset>Toggle Fullscreen</button>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem inset>Hide Sidebar</button>
			</hlm-dropdown-menu>
		</ng-template>

		<ng-template #profiles>
			<hlm-dropdown-menu sideOffset="1.5" class="w-48">
				<button hlmDropdownMenuRadio>
					<hlm-dropdown-menu-radio-indicator />
					Andy
				</button>
				<button hlmDropdownMenuRadio checked>
					<hlm-dropdown-menu-radio-indicator />
					Benoit
				</button>
				<button hlmDropdownMenuRadio>
					<hlm-dropdown-menu-radio-indicator />
					Lewis
				</button>
				<hlm-dropdown-menu-separator />
				<button inset hlmDropdownMenuItem>Edit...</button>
				<hlm-dropdown-menu-separator />
				<button inset hlmDropdownMenuItem>Add Profile...</button>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class MenubarPreview {}

export const defaultImports = `
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';
`;

export const defaultSkeleton = `
<hlm-menubar>
  <button [hlmMenubarTrigger]="file">File</button>
</hlm-menubar>

<ng-template #file>
  <hlm-dropdown-menu sideOffset="1.5">
    <button hlmDropdownMenuItem>
      New Tab
      <hlm-dropdown-menu-shortcut>⌘</hlm-dropdown-menu-shortcut>
    </button>
    <button hlmDropdownMenuItem>New Window</button>
    <hlm-dropdown-menu-separator />
    <button hlmDropdownMenuItem>Share</button>
    <hlm-dropdown-menu-separator />
    <button hlmDropdownMenuItem>Print</button>
  </hlm-dropdown-menu>
</ng-template>
`;
