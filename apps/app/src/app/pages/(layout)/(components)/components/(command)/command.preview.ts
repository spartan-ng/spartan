import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
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
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmIconDirective } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-command-preview',
	imports: [BrnCommandImports, HlmCommandImports, NgIcon, HlmIconDirective],
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
	template: `
		<hlm-command class="rounded-lg border shadow-md md:min-w-[450px]">
			<hlm-command-search>
				<ng-icon hlm name="lucideSearch" class="shrink-0 opacity-50" />

				<input type="text" hlm-command-search-input placeholder="Type a command or search..." />
			</hlm-command-search>

			<hlm-command-list>
				<hlm-command-group>
					<hlm-command-group-label>Suggestions</hlm-command-group-label>

					<button hlm-command-item value="Calendar">
						<ng-icon hlm name="lucideCalendar" hlmCommandIcon />
						Calendar
					</button>
					<button hlm-command-item value="Search Emoji">
						<ng-icon hlm name="lucideSmile" hlmCommandIcon />
						Search Emoji
					</button>
					<button hlm-command-item value="Calculator" disabled>
						<ng-icon hlm name="lucideCalculator" hlmCommandIcon />
						Calculator
					</button>
				</hlm-command-group>

				<hlm-command-separator />

				<hlm-command-group>
					<hlm-command-group-label>Settings</hlm-command-group-label>

					<button hlm-command-item value="Profile">
						<ng-icon hlm name="lucideUser" hlmCommandIcon />
						Profile
						<hlm-command-shortcut>⌘P</hlm-command-shortcut>
					</button>
					<button hlm-command-item value="Billing">
						<ng-icon hlm name="lucideWallet" hlmCommandIcon />
						Billing
						<hlm-command-shortcut>⌘B</hlm-command-shortcut>
					</button>
					<button hlm-command-item value="Settings">
						<ng-icon hlm name="lucideCog" hlmCommandIcon />
						Settings
						<hlm-command-shortcut>⌘S</hlm-command-shortcut>
					</button>
				</hlm-command-group>
			</hlm-command-list>

			<!-- Empty state -->
			<div *brnCommandEmpty hlmCommandEmpty>No results found.</div>
		</hlm-command>
	`,
})
export class CommandPreviewComponent {}

export const defaultCode = `import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
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
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmIconDirective } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-command-preview',
	imports: [BrnCommandImports, HlmCommandImports, NgIcon, HlmIconDirective],
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
	template: \`
		<hlm-command class="rounded-lg border shadow-md md:min-w-[450px]">
			<hlm-command-search>
				<ng-icon hlm name="lucideSearch" class="shrink-0 opacity-50" />

				<input type="text" hlm-command-search-input placeholder="Type a command or search..." />
			</hlm-command-search>

			<hlm-command-list>
				<hlm-command-group>
					<hlm-command-group-label>Suggestions</hlm-command-group-label>

					<button hlm-command-item value="Calendar">
						<ng-icon hlm name="lucideCalendar" hlmCommandIcon />
						Calendar
					</button>
					<button hlm-command-item value="Search Emoji">
						<ng-icon hlm name="lucideSmile" hlmCommandIcon />
						Search Emoji
					</button>
					<button hlm-command-item value="Calculator" disabled>
						<ng-icon hlm name="lucideCalculator" hlmCommandIcon />
						Calculator
					</button>
				</hlm-command-group>

				<hlm-command-separator />

				<hlm-command-group>
					<hlm-command-group-label>Settings</hlm-command-group-label>

					<button hlm-command-item value="Profile">
						<ng-icon hlm name="lucideUser" hlmCommandIcon />
						Profile
						<hlm-command-shortcut>⌘P</hlm-command-shortcut>
					</button>
					<button hlm-command-item value="Billing">
						<ng-icon hlm name="lucideWallet" hlmCommandIcon />
						Billing
						<hlm-command-shortcut>⌘B</hlm-command-shortcut>
					</button>
					<button hlm-command-item value="Settings">
						<ng-icon hlm name="lucideCog" hlmCommandIcon />
						Settings
						<hlm-command-shortcut>⌘S</hlm-command-shortcut>
					</button>
				</hlm-command-group>
			</hlm-command-list>

			<!-- Empty state -->
			<div *brnCommandEmpty hlmCommandEmpty>No results found.</div>
		</hlm-command>
	\`,
})
export class CommandPreviewComponent {}
`;

export const defaultImports = `
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmCommandImports } from '@spartan-ng/helm/command';
`;

export const defaultSkeleton = `
	<hlm-command>
  <hlm-command-search>
    <ng-icon hlm name="lucideSearch" />

    <input
      type="text"
      hlm-command-search-input
      placeholder="Type a command or search..."
    />
  </hlm-command-search>

  <hlm-command-list>
    <hlm-command-group>
      <hlm-command-group-label>Suggestions</hlm-command-group-label>

      <button hlm-command-item value="Calendar">
        <ng-icon hlm name="lucideCalendar" hlmCommandIcon />
        Calendar
      </button>
    </hlm-command-group>

    <hlm-command-separator />

    <hlm-command-group>
      <hlm-command-group-label>Settings</hlm-command-group-label>

      <button hlm-command-item value="Profile">
        <ng-icon hlm name="lucideUser" hlmCommandIcon />
        Profile
        <hlm-command-shortcut>⌘P</hlm-command-shortcut>
      </button>
    </hlm-command-group>
  </hlm-command-list>

  <!-- Empty state -->
  <div *brnCommandEmpty hlmCommandEmpty>No results found.</div>
</hlm-command>
`;
