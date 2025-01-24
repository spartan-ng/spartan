import { Component, HostListener, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
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
import { BrnCommandImports } from '@spartan-ng/brain/command';
import {
	BrnDialogCloseDirective,
	BrnDialogComponent,
	BrnDialogContentDirective,
	BrnDialogOverlayComponent,
	BrnDialogTriggerDirective,
} from '@spartan-ng/brain/dialog';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
import { HlmDialogOverlayDirective } from '@spartan-ng/ui-dialog-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmCodeDirective } from '@spartan-ng/ui-typography-helm';

@Component({
	selector: 'spartan-command-dialog',
	standalone: true,
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
	imports: [
		BrnCommandImports,
		HlmCommandImports,
		NgIcon,
		HlmIconDirective,
		HlmButtonDirective,

		BrnDialogComponent,
		BrnDialogCloseDirective,
		BrnDialogTriggerDirective,
		BrnDialogContentDirective,
		BrnDialogOverlayComponent,
		HlmDialogOverlayDirective,
		HlmCodeDirective,
	],
	template: `
		<div class="mx-auto flex max-w-screen-sm items-center justify-center space-x-4 py-20 text-sm">
			<p>
				Press
				<code hlmCode>⌘ + K</code>
			</p>
			<p>
				Last command:
				<code data-testid="lastCommand" hlmCode>{{ command() || 'none' }}</code>
			</p>
		</div>
		<brn-dialog closeDelay="100" [state]="state()" (stateChanged)="stateChanged($event)">
			<brn-dialog-overlay hlm />
			<hlm-command *brnDialogContent="let ctx" hlmCommandDialog class="mx-auto sm:w-[400px]">
				<hlm-command-search>
					<ng-icon hlm name="lucideSearch" />
					<input placeholder="Type a command or search..." hlm-command-search-input />
					<button hlmCommandDialogCloseBtn>
						<ng-icon hlm name="lucideX" />
					</button>
				</hlm-command-search>
				<div *brnCommandEmpty hlmCommandEmpty>No results found.</div>
				<hlm-command-list hlm>
					<hlm-command-group label="Suggestions">
						<button hlm-command-item value="calendar" (selected)="commandSelected('calendar')">
							<ng-icon hlm name="lucideCalendar" hlmCommandIcon />
							Calendar
						</button>
						<button hlm-command-item value="emojy" (selected)="commandSelected('emojy')">
							<ng-icon hlm name="lucideSmile" hlmCommandIcon />
							Search Emoji
						</button>
						<button hlm-command-item value="calculator" (selected)="commandSelected('calculator')">
							<ng-icon hlm name="lucidePlus" hlmCommandIcon />
							Calculator
						</button>
					</hlm-command-group>
					<hlm-command-separator hlm />
					<hlm-command-group hlm label="Settings">
						<button hlm-command-item value="profile" (selected)="commandSelected('profile')">
							<ng-icon hlm name="lucideUser" hlmCommandIcon />
							Profile
							<hlm-command-shortcut>⌘P</hlm-command-shortcut>
						</button>
						<button hlm-command-item value="billing" (selected)="commandSelected('billing')">
							<ng-icon hlm name="lucideLayers" hlmCommandIcon />
							Billing
							<hlm-command-shortcut>⌘B</hlm-command-shortcut>
						</button>
						<button hlm-command-item value="settings" (selected)="commandSelected('settings')">
							<ng-icon hlm name="lucideCog" hlmCommandIcon />
							Settings
							<hlm-command-shortcut>⌘S</hlm-command-shortcut>
						</button>
					</hlm-command-group>
				</hlm-command-list>
			</hlm-command>
		</brn-dialog>
	`,
})
export class CommandDialogComponent {
	public command = signal('');
	public state = signal<'closed' | 'open'>('closed');
	@HostListener('window:keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && (event.key === 'k' || event.key === 'K')) {
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
export const commandDialogCode = `
`;
