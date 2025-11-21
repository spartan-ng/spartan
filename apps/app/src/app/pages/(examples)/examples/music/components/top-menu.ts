import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideGlobe, lucideMicVocal } from '@ng-icons/lucide';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';

@Component({
	selector: 'spartan-music-top-menu',
	imports: [HlmMenubarImports, HlmDropdownMenuImports, HlmMenuImports, HlmIconImports],
	providers: [provideIcons({ lucideMicVocal, lucideGlobe })],
	host: {
		class: 'block',
	},
	template: `
		<hlm-menubar class="w-fill border-0">
			<button [hlmMenubarTrigger]="music" class="px-3 font-bold">Music</button>
			<button [hlmMenubarTrigger]="file" class="px-3 font-medium">File</button>
			<button [hlmMenubarTrigger]="edit" class="px-3 font-medium">Edit</button>
			<button [hlmMenubarTrigger]="view" class="px-3 font-medium">View</button>
			<button [hlmMenubarTrigger]="account" class="px-3 font-medium">Account</button>
		</hlm-menubar>

		<ng-template #music>
			<hlm-dropdown-menu sideOffset="1.5" class="w-48">
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						About Music
						<hlm-dropdown-menu-shortcut>⌘W</hlm-dropdown-menu-shortcut>
					</button>
					<hlm-dropdown-menu-separator />

					<button hlmDropdownMenuItem>
						Preferences...
						<hlm-dropdown-menu-shortcut>⌘,</hlm-dropdown-menu-shortcut>
					</button>
					<hlm-dropdown-menu-separator />

					<button hlmDropdownMenuItem>
						Hide Music...
						<hlm-dropdown-menu-shortcut>⌘H</hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuItem>
						Hide Others...
						<hlm-dropdown-menu-shortcut>⇧⌘H</hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuItem>
						Quit Music
						<hlm-dropdown-menu-shortcut>⌘Q</hlm-dropdown-menu-shortcut>
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>

		<ng-template #file>
			<hlm-dropdown-menu sideOffset="1.5" class="w-48">
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem [hlmDropdownMenuTrigger]="new">
						New
						<hlm-dropdown-menu-item-sub-indicator />
						<ng-template #new>
							<hlm-dropdown-menu-sub>
								<button hlmDropdownMenuItem>
									Playlist
									<hlm-dropdown-menu-shortcut>⌘N</hlm-dropdown-menu-shortcut>
								</button>
								<button hlmDropdownMenuItem disabled>
									Playlist from Selection
									<hlm-dropdown-menu-shortcut>⇧⌘N</hlm-dropdown-menu-shortcut>
								</button>
								<button hlmDropdownMenuItem>
									Smart Playlist...
									<hlm-dropdown-menu-shortcut>⌥⌘N</hlm-dropdown-menu-shortcut>
								</button>
								<button hlmDropdownMenuItem>Playlist Folder</button>
								<button hlmDropdownMenuItem disabled>Genius Playlist</button>
							</hlm-dropdown-menu-sub>
						</ng-template>
					</button>
					<button hlmDropdownMenuItem>
						Open Stream URL...
						<hlm-dropdown-menu-shortcut>⌘U</hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuItem>
						Close Window
						<hlm-dropdown-menu-shortcut>⌘W</hlm-dropdown-menu-shortcut>
					</button>

					<hlm-dropdown-menu-separator />

					<button hlmDropdownMenuItem [hlmDropdownMenuTrigger]="library">
						Library
						<hlm-dropdown-menu-item-sub-indicator />
						<ng-template #library>
							<hlm-dropdown-menu-sub>
								<button hlmDropdownMenuItem>Update Cloud Library</button>
								<button hlmDropdownMenuItem>Update Genius</button>

								<hlm-dropdown-menu-separator />

								<button hlmDropdownMenuItem>Organize Library...</button>
								<button hlmDropdownMenuItem>Export Library...</button>

								<hlm-dropdown-menu-separator />

								<button hlmDropdownMenuItem>Import Playlist...</button>
								<button hlmDropdownMenuItem disabled>Export Playlist...</button>
								<button hlmDropdownMenuItem>Show Duplicated Items</button>

								<hlm-dropdown-menu-separator />

								<button hlmDropdownMenuItem>Get Album Artwork</button>
								<button hlmDropdownMenuItem disabled>Get Track Names</button>
							</hlm-dropdown-menu-sub>
						</ng-template>
					</button>
					<button hlmDropdownMenuItem>
						Import...
						<hlm-dropdown-menu-shortcut>⌘O</hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuItem disabled>Burn Playlist to Disc...</button>

					<hlm-dropdown-menu-separator />

					<button hlmDropdownMenuItem>
						Show in Finder
						<hlm-dropdown-menu-shortcut>⇧⌘R</hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuItem>Convert</button>

					<hlm-dropdown-menu-separator />

					<button hlmDropdownMenuItem>Page Setup...</button>
					<button hlmDropdownMenuItem disabled>
						Print...
						<hlm-dropdown-menu-shortcut>⌘P</hlm-dropdown-menu-shortcut>
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>

		<ng-template #edit>
			<hlm-dropdown-menu sideOffset="1.5" class="w-48">
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem disabled>
						Undo
						<hlm-dropdown-menu-shortcut>⌘Z</hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuItem disabled>
						Redo
						<hlm-dropdown-menu-shortcut>⇧⌘Z</hlm-dropdown-menu-shortcut>
					</button>
					<hlm-dropdown-menu-separator />

					<button hlmDropdownMenuItem disabled>
						Cut
						<hlm-dropdown-menu-shortcut>⌘X</hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuItem disabled>
						Copy
						<hlm-dropdown-menu-shortcut>⌘C</hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuItem disabled>
						Paste
						<hlm-dropdown-menu-shortcut>⌘V</hlm-dropdown-menu-shortcut>
					</button>
					<hlm-dropdown-menu-separator />

					<button hlmDropdownMenuItem>
						Select All
						<hlm-dropdown-menu-shortcut>⌘A</hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuItem disabled>
						Deselect All
						<hlm-dropdown-menu-shortcut>⇧⌘A</hlm-dropdown-menu-shortcut>
					</button>
					<hlm-dropdown-menu-separator />

					<button hlmDropdownMenuItem>
						Smart Dictation...
						<hlm-dropdown-menu-shortcut><ng-icon hlm size="sm" name="lucideMicVocal" /></hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuItem>
						Emoji & Symbols
						<hlm-dropdown-menu-shortcut><ng-icon hlm size="sm" name="lucideGlobe" /></hlm-dropdown-menu-shortcut>
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
		<ng-template #view>
			<hlm-dropdown-menu sideOffset="1.5" class="w-48">
				<hlm-dropdown-menu-group>
					<button inset hlmDropdownMenuItem>Show Playing Next</button>
					<button hlmDropdownMenuCheckbox checked>
						<hlm-dropdown-menu-checkbox-indicator />
						Show Lyrics
					</button>
					<hlm-dropdown-menu-separator />

					<button inset hlmDropdownMenuItem disabled>Show Status Bar</button>
					<hlm-dropdown-menu-separator />

					<button inset hlmDropdownMenuItem>Hide Sidebar</button>
					<button inset hlmDropdownMenuItem disabled>Enter Full Screen</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>

		<ng-template #account>
			<hlm-dropdown-menu sideOffset="1.5" class="w-48">
				<hlm-dropdown-menu-group>
					<button inset hlmDropdownMenuItem class="font-semibold">Switch Account</button>
					<button inset hlmDropdownMenuItem>Andy</button>
					<button hlmDropdownMenuRadio checked>
						<hlm-dropdown-menu-radio-indicator />
						Benoit
					</button>
					<button inset hlmDropdownMenuItem>Luis</button>
					<hlm-dropdown-menu-separator />

					<button inset hlmDropdownMenuItem>Manage Family...</button>
					<hlm-dropdown-menu-separator />

					<button inset hlmDropdownMenuItem>Add Account...</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class TopMusicMenu {}
