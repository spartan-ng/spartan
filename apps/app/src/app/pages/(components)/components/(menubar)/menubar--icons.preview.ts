import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFile, lucideFolder, lucideHelpCircle, lucideSave, lucideSettings, lucideTrash } from '@ng-icons/lucide';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';

@Component({
	selector: 'spartan-menubar-icons',
	imports: [HlmMenubarImports, HlmDropdownMenuImports, NgIcon],
	providers: [provideIcons({ lucideFile, lucideFolder, lucideSave, lucideSettings, lucideHelpCircle, lucideTrash })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-menubar>
			<button [hlmMenubarTrigger]="file">File</button>
			<button [hlmMenubarTrigger]="more">More</button>
		</hlm-menubar>

		<ng-template #file>
			<hlm-dropdown-menu sideOffset="2" class="w-48">
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideFile" />
						New File
						<hlm-dropdown-menu-shortcut>⌘N</hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideFolder" />
						Open Folder
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideSave" />
						Save
						<hlm-dropdown-menu-shortcut>⌘S</hlm-dropdown-menu-shortcut>
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>

		<ng-template #more>
			<hlm-dropdown-menu sideOffset="2">
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideSettings" />
						Settings
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideHelpCircle" />
						Help
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem variant="destructive">
						<ng-icon name="lucideTrash" />
						Delete
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class MenubarIcons {}
