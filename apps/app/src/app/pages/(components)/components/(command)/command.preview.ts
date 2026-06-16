import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
	lucideCalculator,
	lucideCalendar,
	lucideCog,
	lucidePlus,
	lucideSearch,
	lucideSmile,
	lucideUser,
	lucideWallet,
} from '@ng-icons/lucide';
import { HlmCard, HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-command-preview',
	imports: [HlmCommandImports, HlmIconImports, HlmCardImports],
	providers: [
		provideIcons({
			lucideSearch,
			lucideCalendar,
			lucideSmile,
			lucidePlus,
			lucideUser,
			lucideWallet,
			lucideCog,
			lucideCalculator,
		}),
	],
	hostDirectives: [HlmCard],
	host: {
		class: 'w-full py-0',
	},
	template: `
		<div hlmCardContent class="p-0">
			<hlm-command>
				<hlm-command-input placeholder="Type a command or search..." />
				<hlm-command-list>
					<div *hlmCommandEmptyState hlmCommandEmpty>No results found.</div>
					<hlm-command-group>
						<hlm-command-group-label>Suggestions</hlm-command-group-label>
						<button hlm-command-item value="Calendar">
							<ng-icon name="lucideCalendar" />
							Calendar
						</button>
						<button hlm-command-item value="Search Emoji">
							<ng-icon name="lucideSmile" />
							Search Emoji
						</button>
						<button hlm-command-item value="Calculator" disabled>
							<ng-icon name="lucideCalculator" />
							Calculator
						</button>
					</hlm-command-group>

					<hlm-command-separator />

					<hlm-command-group>
						<hlm-command-group-label>Settings</hlm-command-group-label>

						<button hlm-command-item value="Profile">
							<ng-icon name="lucideUser" />
							Profile
							<hlm-command-shortcut>⌘P</hlm-command-shortcut>
						</button>
						<button hlm-command-item value="Billing">
							<ng-icon name="lucideWallet" />
							Billing
							<hlm-command-shortcut>⌘B</hlm-command-shortcut>
						</button>
						<button hlm-command-item value="Settings">
							<ng-icon name="lucideCog" />
							Settings
							<hlm-command-shortcut>⌘S</hlm-command-shortcut>
						</button>
					</hlm-command-group>
				</hlm-command-list>
			</hlm-command>
		</div>
	`,
})
export class CommandPreview {}

export const defaultImports = `
import { HlmCommandImports } from '@spartan-ng/helm/command';
`;

export const defaultSkeleton = `
<hlm-command>
  <hlm-command-input placeholder="Type a command or search..." />
  <hlm-command-list>
  	<div *hlmCommandEmptyState hlmCommandEmpty>No results found.</div>
    <hlm-command-group>
      <hlm-command-group-label>Suggestions</hlm-command-group-label>
      <button hlm-command-item value="Calendar">
        <ng-icon name="lucideCalendar" />
        Calendar
      </button>
    </hlm-command-group>
    <hlm-command-separator />
    <hlm-command-group>
      <hlm-command-group-label>Settings</hlm-command-group-label>
      <button hlm-command-item value="Profile">
        <ng-icon name="lucideUser" />
        Profile
        <hlm-command-shortcut>⌘P</hlm-command-shortcut>
      </button>
    </hlm-command-group>
  </hlm-command-list>
</hlm-command>
`;
