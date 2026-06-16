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

@Component({
	selector: 'spartan-command-basic',
	imports: [HlmCommandImports, HlmButtonImports],
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

	template: `
		<div class="mx-auto flex max-w-screen-sm items-center justify-center space-x-4 py-20 text-sm">
			<button hlmBtn variant="outline" (click)="stateChanged('open')">Open Menu</button>
		</div>
		<hlm-command-dialog [state]="state()" (stateChange)="stateChanged($event)">
			<hlm-command>
				<hlm-command-input placeholder="Type a command or search..." />
				<hlm-command-list>
					<div *hlmCommandEmptyState hlmCommandEmpty>No results found.</div>
					<hlm-command-group>
						<hlm-command-group-label>Suggestions</hlm-command-group-label>
						<button hlm-command-item value="calendar" (selected)="commandSelected('calendar')">Calendar</button>
						<button hlm-command-item value="emoji" (selected)="commandSelected('emoji')">Search Emoji</button>
						<button hlm-command-item value="calculator" (selected)="commandSelected('calculator')">Calculator</button>
					</hlm-command-group>
				</hlm-command-list>
			</hlm-command>
		</hlm-command-dialog>
	`,
})
export class CommandBasic {
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
