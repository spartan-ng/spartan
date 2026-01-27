import { Component, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
	lucideCalendar,
	lucideCog,
	lucideLayers,
	lucidePlus,
	lucideSearch,
	lucideSmile,
	lucideUser,
	lucideX,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmKbdImports } from '@spartan-ng/helm/kbd';

@Component({
	selector: 'spartan-command-dialog',
	imports: [HlmCommandImports, HlmIconImports, HlmButtonImports, HlmKbdImports],
	providers: [
		provideIcons({
			lucideX,
			lucideCalendar,
			lucideSmile,
			lucidePlus,
			lucideUser,
			lucideLayers,
			lucideCog,
			lucideSearch,
		}),
	],
	host: {
		'(window:keydown)': 'onKeyDown($event)',
	},
	template: `
		<div class="mx-auto flex max-w-screen-sm items-center justify-center space-x-4 py-20 text-sm">
			<p>
				Press
				<kbd hlmKbd>⌘ + J</kbd>
			</p>
			<p>
				Last command:
				<code data-testid="lastCommand" hlmCode>{{ command() || 'none' }}</code>
			</p>
		</div>
		<hlm-command-dialog [state]="state()" (stateChange)="stateChanged($event)">
			<hlm-command>
				<hlm-command-input placeholder="Type a command or search..." />
				<div *hlmCommandEmptyState hlmCommandEmpty>No results found.</div>
				<hlm-command-list>
					<hlm-command-group>
						<hlm-command-group-label>Suggestions</hlm-command-group-label>
						<button hlm-command-item value="calendar" (selected)="commandSelected('calendar')">
							<ng-icon name="lucideCalendar" />
							Calendar
						</button>
						<button hlm-command-item value="emojy" (selected)="commandSelected('emojy')">
							<ng-icon name="lucideSmile" />
							Search Emoji
						</button>
						<button hlm-command-item value="calculator" (selected)="commandSelected('calculator')">
							<ng-icon name="lucidePlus" />
							Calculator
						</button>
					</hlm-command-group>
					<hlm-command-separator />
					<hlm-command-group>
						<hlm-command-group-label>Settings</hlm-command-group-label>
						<button hlm-command-item value="profile" (selected)="commandSelected('profile')">
							<ng-icon name="lucideUser" />
							Profile
							<hlm-command-shortcut>⌘P</hlm-command-shortcut>
						</button>
						<button hlm-command-item value="billing" (selected)="commandSelected('billing')">
							<ng-icon name="lucideLayers" />
							Billing
							<hlm-command-shortcut>⌘B</hlm-command-shortcut>
						</button>
						<button hlm-command-item value="settings" (selected)="commandSelected('settings')">
							<ng-icon name="lucideCog" />
							Settings
							<hlm-command-shortcut>⌘S</hlm-command-shortcut>
						</button>
					</hlm-command-group>
				</hlm-command-list>
			</hlm-command>
		</hlm-command-dialog>
	`,
})
export class CommandDialog {
	public readonly command = signal('');
	public readonly state = signal<'closed' | 'open'>('closed');

	onKeyDown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && (event.key === 'j' || event.key === 'J')) {
			this.state.set('open');
		}
	}

	stateChanged(state: 'open' | 'closed') {
		this.state.set(state);
	}

	commandSelected(selected: string) {
		this.state.set('closed');
		this.command.set(selected);
	}
}
