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
					<button hlmMenuItem>
						About Music
						<hlm-menu-shortcut>⌘W</hlm-menu-shortcut>
					</button>
					<hlm-menu-separator />

					<button hlmMenuItem>
						Preferences...
						<hlm-menu-shortcut>⌘,</hlm-menu-shortcut>
					</button>
					<hlm-menu-separator />

					<button hlmMenuItem>
						Hide Music...
						<hlm-menu-shortcut>⌘H</hlm-menu-shortcut>
					</button>
					<button hlmMenuItem>
						Hide Others...
						<hlm-menu-shortcut>⇧⌘H</hlm-menu-shortcut>
					</button>
					<button hlmMenuItem>
						Quit Music
						<hlm-menu-shortcut>⌘Q</hlm-menu-shortcut>
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>

		<ng-template #file>
			<hlm-menu sideOffset="1.5" class="w-48">
				<hlm-menu-group>
					<button hlmMenuItem [hlmDropdownMenuTrigger]="new">
						New
						<hlm-menu-item-sub-indicator />
						<ng-template #new>
							<hlm-sub-menu>
								<button hlmMenuItem>
									Playlist
									<hlm-menu-shortcut>⌘N</hlm-menu-shortcut>
								</button>
								<button hlmMenuItem disabled>
									Playlist from Selection
									<hlm-menu-shortcut>⇧⌘N</hlm-menu-shortcut>
								</button>
								<button hlmMenuItem>
									Smart Playlist...
									<hlm-menu-shortcut>⌥⌘N</hlm-menu-shortcut>
								</button>
								<button hlmMenuItem>Playlist Folder</button>
								<button hlmMenuItem disabled>Genius Playlist</button>
							</hlm-sub-menu>
						</ng-template>
					</button>
					<button hlmMenuItem>
						Open Stream URL...
						<hlm-menu-shortcut>⌘U</hlm-menu-shortcut>
					</button>
					<button hlmMenuItem>
						Close Window
						<hlm-menu-shortcut>⌘W</hlm-menu-shortcut>
					</button>

					<hlm-menu-separator />

					<button hlmMenuItem [hlmDropdownMenuTrigger]="library">
						Library
						<hlm-menu-item-sub-indicator />
						<ng-template #library>
							<hlm-sub-menu>
								<button hlmMenuItem>Update Cloud Library</button>
								<button hlmMenuItem>Update Genius</button>

								<hlm-menu-separator />

								<button hlmMenuItem>Organize Library...</button>
								<button hlmMenuItem>Export Library...</button>

								<hlm-menu-separator />

								<button hlmMenuItem>Import Playlist...</button>
								<button hlmMenuItem disabled>Export Playlist...</button>
								<button hlmMenuItem>Show Duplicated Items</button>

								<hlm-menu-separator />

								<button hlmMenuItem>Get Album Artwork</button>
								<button hlmMenuItem disabled>Get Track Names</button>
							</hlm-sub-menu>
						</ng-template>
					</button>
					<button hlmMenuItem>
						Import...
						<hlm-menu-shortcut>⌘O</hlm-menu-shortcut>
					</button>
					<button hlmMenuItem disabled>Burn Playlist to Disc...</button>

					<hlm-menu-separator />

					<button hlmMenuItem>
						Show in Finder
						<hlm-menu-shortcut>⇧⌘R</hlm-menu-shortcut>
					</button>
					<button hlmMenuItem>Convert</button>

					<hlm-menu-separator />

					<button hlmMenuItem>Page Setup...</button>
					<button hlmMenuItem disabled>
						Print...
						<hlm-menu-shortcut>⌘P</hlm-menu-shortcut>
					</button>
				</hlm-menu-group>
			</hlm-menu>
		</ng-template>

		<ng-template #edit>
			<hlm-menu sideOffset="1.5" class="w-48">
				<hlm-menu-group>
					<button hlmMenuItem disabled>
						Undo
						<hlm-menu-shortcut>⌘Z</hlm-menu-shortcut>
					</button>
					<button hlmMenuItem disabled>
						Redo
						<hlm-menu-shortcut>⇧⌘Z</hlm-menu-shortcut>
					</button>
					<hlm-menu-separator />

					<button hlmMenuItem disabled>
						Cut
						<hlm-menu-shortcut>⌘X</hlm-menu-shortcut>
					</button>
					<button hlmMenuItem disabled>
						Copy
						<hlm-menu-shortcut>⌘C</hlm-menu-shortcut>
					</button>
					<button hlmMenuItem disabled>
						Paste
						<hlm-menu-shortcut>⌘V</hlm-menu-shortcut>
					</button>
					<hlm-menu-separator />

					<button hlmMenuItem>
						Select All
						<hlm-menu-shortcut>⌘A</hlm-menu-shortcut>
					</button>
					<button hlmMenuItem disabled>
						Deselect All
						<hlm-menu-shortcut>⇧⌘A</hlm-menu-shortcut>
					</button>
					<hlm-menu-separator />

					<button hlmMenuItem>
						Smart Dictation...
						<hlm-menu-shortcut><ng-icon hlm size="sm" name="lucideMicVocal" /></hlm-menu-shortcut>
					</button>
					<button hlmMenuItem>
						Emoji & Symbols
						<hlm-menu-shortcut><ng-icon hlm size="sm" name="lucideGlobe" /></hlm-menu-shortcut>
					</button>
				</hlm-menu-group>
			</hlm-menu>
		</ng-template>
		<ng-template #view>
			<hlm-menu sideOffset="1.5" class="w-48">
				<hlm-menu-group>
					<button inset hlmMenuItem>Show Playing Next</button>
					<button hlmMenuItemCheckbox checked>
						<hlm-menu-item-check />
						Show Lyrics
					</button>
					<hlm-menu-separator />

					<button inset hlmMenuItem disabled>Show Status Bar</button>
					<hlm-menu-separator />

					<button inset hlmMenuItem>Hide Sidebar</button>
					<button inset hlmMenuItem disabled>Enter Full Screen</button>
				</hlm-menu-group>
			</hlm-menu>
		</ng-template>

		<ng-template #account>
			<hlm-menu sideOffset="1.5" class="w-48">
				<hlm-menu-group>
					<button inset hlmMenuItem class="font-semibold">Switch Account</button>
					<button inset hlmMenuItem>Andy</button>
					<button hlmMenuItemRadio checked>
						<hlm-menu-item-radio />
						Benoit
					</button>
					<button inset hlmMenuItem>Luis</button>
					<hlm-menu-separator />

					<button inset hlmMenuItem>Manage Family...</button>
					<hlm-menu-separator />

					<button inset hlmMenuItem>Add Account...</button>
				</hlm-menu-group>
			</hlm-menu>
		</ng-template>
	`,
})
export class TopMusicMenu {}
