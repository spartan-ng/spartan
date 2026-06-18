import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideBell,
	lucideCalculator,
	lucideCalendar,
	lucideCircleHelp,
	lucideClipboardPaste,
	lucideCode,
	lucideCog,
	lucideCopy,
	lucideCreditCard,
	lucideFileText,
	lucideFolder,
	lucideFolderPlus,
	lucideHouse,
	lucideImage,
	lucideInbox,
	lucideLayoutGrid,
	lucideList,
	lucidePlus,
	lucideScissors,
	lucideTrash2,
	lucideUser,
	lucideZoomIn,
	lucideZoomOut,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCommandImports } from '@spartan-ng/helm/command';

@Component({
	selector: 'spartan-command-scrollable',
	imports: [HlmCommandImports, HlmButton, NgIcon],
	providers: [
		provideIcons({
			lucideHouse,
			lucideInbox,
			lucideFileText,
			lucideFolder,
			lucidePlus,
			lucideFolderPlus,
			lucideCopy,
			lucideScissors,
			lucideClipboardPaste,
			lucideTrash2,
			lucideLayoutGrid,
			lucideList,
			lucideZoomIn,
			lucideZoomOut,
			lucideUser,
			lucideCreditCard,
			lucideCog,
			lucideBell,
			lucideCircleHelp,
			lucideCalculator,
			lucideCalendar,
			lucideImage,
			lucideCode,
		}),
	],

	template: `
		<div class="mx-auto flex max-w-screen-sm items-center justify-center space-x-4 py-20 text-sm">
			<button hlmBtn variant="outline" (click)="stateChanged('open')">Open Menu</button>
		</div>
		<hlm-command-dialog [state]="state()" (stateChange)="stateChanged($event)">
			<hlm-command>
				<hlm-command-input placeholder="Type a command or search..." />

				<hlm-command-list>
					<div *hlmCommandEmptyState hlmCommandEmpty>No results found.</div>

					<!-- Navigation -->
					<hlm-command-group>
						<hlm-command-group-label>Navigation</hlm-command-group-label>

						<button hlm-command-item value="home" (selected)="commandSelected('home')">
							<ng-icon name="lucideHouse" />
							Home
							<hlm-command-shortcut>⌘H</hlm-command-shortcut>
						</button>

						<button hlm-command-item value="inbox" (selected)="commandSelected('inbox')">
							<ng-icon name="lucideInbox" />
							Inbox
							<hlm-command-shortcut>⌘I</hlm-command-shortcut>
						</button>

						<button hlm-command-item value="documents" (selected)="commandSelected('documents')">
							<ng-icon name="lucideFileText" />
							Documents
							<hlm-command-shortcut>⌘D</hlm-command-shortcut>
						</button>

						<button hlm-command-item value="folders" (selected)="commandSelected('folders')">
							<ng-icon name="lucideFolder" />
							Folders
							<hlm-command-shortcut>⌘F</hlm-command-shortcut>
						</button>
					</hlm-command-group>

					<hlm-command-separator />

					<!-- Actions -->
					<hlm-command-group>
						<hlm-command-group-label>Actions</hlm-command-group-label>

						<button hlm-command-item value="new-file" (selected)="commandSelected('new-file')">
							<ng-icon name="lucidePlus" />
							New File
							<hlm-command-shortcut>⌘N</hlm-command-shortcut>
						</button>

						<button hlm-command-item value="new-folder" (selected)="commandSelected('new-folder')">
							<ng-icon name="lucideFolderPlus" />
							New Folder
							<hlm-command-shortcut>⇧⌘N</hlm-command-shortcut>
						</button>

						<button hlm-command-item value="copy" (selected)="commandSelected('copy')">
							<ng-icon name="lucideCopy" />
							Copy
							<hlm-command-shortcut>⌘C</hlm-command-shortcut>
						</button>

						<button hlm-command-item value="cut" (selected)="commandSelected('cut')">
							<ng-icon name="lucideScissors" />
							Cut
							<hlm-command-shortcut>⌘X</hlm-command-shortcut>
						</button>

						<button hlm-command-item value="paste" (selected)="commandSelected('paste')">
							<ng-icon name="lucideClipboardPaste" />
							Paste
							<hlm-command-shortcut>⌘V</hlm-command-shortcut>
						</button>

						<button hlm-command-item value="delete" (selected)="commandSelected('delete')">
							<ng-icon name="lucideTrash2" />
							Delete
							<hlm-command-shortcut>⌫</hlm-command-shortcut>
						</button>
					</hlm-command-group>

					<hlm-command-separator />

					<!-- View -->
					<hlm-command-group>
						<hlm-command-group-label>View</hlm-command-group-label>

						<button hlm-command-item value="grid-view" (selected)="commandSelected('grid-view')">
							<ng-icon name="lucideLayoutGrid" />
							Grid View
						</button>

						<button hlm-command-item value="list-view" (selected)="commandSelected('list-view')">
							<ng-icon name="lucideList" />
							List View
						</button>

						<button hlm-command-item value="zoom-in" (selected)="commandSelected('zoom-in')">
							<ng-icon name="lucideZoomIn" />
							Zoom In
							<hlm-command-shortcut>⌘+</hlm-command-shortcut>
						</button>

						<button hlm-command-item value="zoom-out" (selected)="commandSelected('zoom-out')">
							<ng-icon name="lucideZoomOut" />
							Zoom Out
							<hlm-command-shortcut>⌘-</hlm-command-shortcut>
						</button>
					</hlm-command-group>

					<hlm-command-separator />

					<!-- Account -->
					<hlm-command-group>
						<hlm-command-group-label>Account</hlm-command-group-label>

						<button hlm-command-item value="profile" (selected)="commandSelected('profile')">
							<ng-icon name="lucideUser" />
							Profile
							<hlm-command-shortcut>⌘P</hlm-command-shortcut>
						</button>

						<button hlm-command-item value="billing" (selected)="commandSelected('billing')">
							<ng-icon name="lucideCreditCard" />
							Billing
							<hlm-command-shortcut>⌘B</hlm-command-shortcut>
						</button>

						<button hlm-command-item value="settings" (selected)="commandSelected('settings')">
							<ng-icon name="lucideCog" />
							Settings
							<hlm-command-shortcut>⌘S</hlm-command-shortcut>
						</button>

						<button hlm-command-item value="notifications" (selected)="commandSelected('notifications')">
							<ng-icon name="lucideBell" />
							Notifications
						</button>

						<button hlm-command-item value="help" (selected)="commandSelected('help')">
							<ng-icon name="lucideCircleHelp" />
							Help & Support
						</button>
					</hlm-command-group>

					<hlm-command-separator />

					<!-- Tools -->
					<hlm-command-group>
						<hlm-command-group-label>Tools</hlm-command-group-label>

						<button hlm-command-item value="calculator" (selected)="commandSelected('calculator')">
							<ng-icon name="lucideCalculator" />
							Calculator
						</button>

						<button hlm-command-item value="calendar" (selected)="commandSelected('calendar')">
							<ng-icon name="lucideCalendar" />
							Calendar
						</button>

						<button hlm-command-item value="image-editor" (selected)="commandSelected('image-editor')">
							<ng-icon name="lucideImage" />
							Image Editor
						</button>

						<button hlm-command-item value="code-editor" (selected)="commandSelected('code-editor')">
							<ng-icon name="lucideCode" />
							Code Editor
						</button>
					</hlm-command-group>
				</hlm-command-list>
			</hlm-command>
		</hlm-command-dialog>
	`,
})
export class CommandScrollable {
	public readonly command = signal('');
	public readonly state = signal<'closed' | 'open'>('closed');

	stateChanged(state: 'open' | 'closed') {
		this.state.set(state);
	}

	commandSelected(selected: string) {
		this.state.set('closed');
		this.command.set(selected);
	}
}
