import { Component, HostListener, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as lucide from '@ng-icons/lucide';
import { BrnCommand, BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { HlmButton, HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmIcon, HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmCode } from '@spartan-ng/helm/typography';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta<BrnCommand> = {
	title: 'Command',
	component: BrnCommand,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			providers: [provideIcons(lucide)],
			imports: [BrnCommandImports, HlmCommandImports, NgIcon, HlmIcon, HlmButton],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnCommand>;

export const Default: Story = {
	render: () => ({
		template: `
		<hlm-command>
  <hlm-command-search>
    <ng-icon hlm name="lucideSearch" class="inline-flex" />

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
      <button disabled hlm-command-item value="Search Emoji">
        <ng-icon hlm name="lucideSmile" hlmCommandIcon />
        Search Emoji
      </button>
      <button hlm-command-item value="Calculator">
        <ng-icon hlm name="lucidePlus" hlmCommandIcon />
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
	}),
};

@Component({
	selector: 'command-dialog-component',
	imports: [
		BrnCommandImports,
		HlmCommandImports,
		BrnDialogImports,
		HlmDialogImports,
		HlmIconImports,
		HlmButtonImports,
		HlmCode,
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
		<hlm-dialog [state]="state()" (stateChanged)="stateChanged($event)">
			<hlm-command *brnDialogContent="let ctx" hlmCommandDialog class="relative mx-auto sm:w-[400px]">
				<button hlmCommandDialogCloseBtn>
					<ng-icon hlm name="lucideX" />
				</button>

				<hlm-command-search>
					<ng-icon hlm name="lucideSearch" class="inline-flex" />

					<input type="text" hlm-command-search-input placeholder="Type a command or search..." />
				</hlm-command-search>

				<hlm-command-list>
					<hlm-command-group>
						<hlm-command-group-label>Suggestions</hlm-command-group-label>

						<button hlm-command-item value="Calendar">
							<ng-icon hlm name="lucideCalendar" hlmCommandIcon />
							Calendar
						</button>
						<button hlm-command-item disabled value="Search Emoji">
							<ng-icon hlm name="lucideSmile" hlmCommandIcon />
							Search Emoji
						</button>
						<button hlm-command-item value="Calculator">
							<ng-icon hlm name="lucidePlus" hlmCommandIcon />
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
		</hlm-dialog>
	`,
})
class CommandDialog {
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

export const Dialog: Story = {
	decorators: [
		moduleMetadata({
			imports: [CommandDialog],
		}),
	],
	render: () => ({
		template: '<command-dialog-component/>',
	}),
};

@Component({
	selector: 'command-dynamic-component',
	imports: [BrnCommandImports, HlmCommandImports, BrnDialogImports, NgIcon, HlmIcon, HlmButton, FormsModule],
	template: `
		<hlm-command>
			<hlm-command-search>
				<ng-icon hlm name="lucideSearch" class="inline-flex" />

				<input type="text" hlm-command-search-input placeholder="Type a command or search..." [ngModel]="search()" />
			</hlm-command-search>

			<hlm-command-list>
				<hlm-command-group>
					<hlm-command-group-label>Suggestions</hlm-command-group-label>
					@for (item of items(); track item.value) {
						<button hlm-command-item [value]="item.value" data-testid="command-item">
							<ng-icon hlm [name]="item.icon" hlmCommandIcon />
							{{ item.label }}
						</button>
					}
				</hlm-command-group>
			</hlm-command-list>

			<!-- Empty state -->
			<div *brnCommandEmpty hlmCommandEmpty>No results found.</div>
		</hlm-command>
	`,
})
class CommandDynamic {
	protected readonly search = signal('P');
	protected readonly items = signal<{ label: string; value: string; icon: string; shortcut: string }[]>([
		{ label: 'Profile', value: 'Profile', icon: 'lucideUser', shortcut: '⌘P' },
		{ label: 'Billing', value: 'Billing', icon: 'lucideWallet', shortcut: '⌘B' },
		{ label: 'Search Emoji', value: 'Search Emoji', icon: 'lucideSmile', shortcut: '⌘E' },
		{ label: 'Settings', value: 'Settings', icon: 'lucideCog', shortcut: '⌘S' },
	]);
}

export const DynamicOptions: Story = {
	decorators: [
		moduleMetadata({
			imports: [CommandDynamic],
		}),
	],
	render: () => ({
		template: '<command-dynamic-component/>',
	}),
};

@Component({
	selector: 'command-reactive-form-component',
	imports: [BrnCommandImports, HlmCommandImports, NgIcon, HlmIcon, HlmButton, FormsModule, ReactiveFormsModule],
	template: `
		<hlm-command>
			<hlm-command-search>
				<ng-icon hlm name="lucideSearch" class="inline-flex" />

				<input
					type="text"
					hlm-command-search-input
					placeholder="Type a command or search..."
					[formControl]="searchControl"
				/>
			</hlm-command-search>

			<hlm-command-list>
				<hlm-command-group>
					<hlm-command-group-label>Suggestions</hlm-command-group-label>
					@for (item of items(); track item.value) {
						<button hlm-command-item [value]="item.value" data-testid="command-item">
							<ng-icon hlm [name]="item.icon" hlmCommandIcon />
							{{ item.label }}
						</button>
					}
				</hlm-command-group>
			</hlm-command-list>

			<!-- Empty state -->
			<div *brnCommandEmpty hlmCommandEmpty>No results found.</div>
		</hlm-command>
	`,
})
class CommandReactiveForm {
	searchControl = new FormControl('R');
	protected readonly search = signal('P');
	protected readonly items = signal<{ label: string; value: string; icon: string; shortcut: string }[]>([
		{ label: 'Profile', value: 'Profile', icon: 'lucideUser', shortcut: '⌘P' },
		{ label: 'Billing', value: 'Billing', icon: 'lucideWallet', shortcut: '⌘B' },
		{ label: 'Search Emoji', value: 'Search Emoji', icon: 'lucideSmile', shortcut: '⌘E' },
		{ label: 'Settings', value: 'Settings', icon: 'lucideCog', shortcut: '⌘S' },
	]);
	public state = signal<'closed' | 'open'>('closed');
}

export const ReactiveForm: Story = {
	decorators: [
		moduleMetadata({
			imports: [CommandReactiveForm],
		}),
	],
	render: () => ({
		template: '<command-reactive-form-component/>',
	}),
};

@Component({
	selector: 'command-bound-value-component',
	imports: [BrnCommandImports, HlmCommandImports, NgIcon, HlmIcon, HlmButton],
	template: `
		<hlm-command>
			<hlm-command-search>
				<ng-icon hlm name="lucideSearch" class="inline-flex" />

				<input type="text" hlm-command-search-input placeholder="Type a command or search..." [value]="search()" />
			</hlm-command-search>

			<hlm-command-list>
				<hlm-command-group>
					<hlm-command-group-label>Suggestions</hlm-command-group-label>
					@for (item of items(); track item.value) {
						<button hlm-command-item [value]="item.value" data-testid="command-item">
							<ng-icon hlm [name]="item.icon" hlmCommandIcon />
							{{ item.label }}
						</button>
					}
				</hlm-command-group>
			</hlm-command-list>

			<!-- Empty state -->
			<div *brnCommandEmpty hlmCommandEmpty>No results found.</div>
		</hlm-command>
	`,
})
class CommandBoundValue {
	protected readonly search = signal('S');
	protected readonly items = signal<{ label: string; value: string; icon: string; shortcut: string }[]>([
		{ label: 'Profile', value: 'Profile', icon: 'lucideUser', shortcut: '⌘P' },
		{ label: 'Billing', value: 'Billing', icon: 'lucideWallet', shortcut: '⌘B' },
		{ label: 'Search Emoji', value: 'Search Emoji', icon: 'lucideSmile', shortcut: '⌘E' },
		{ label: 'Settings', value: 'Settings', icon: 'lucideCog', shortcut: '⌘S' },
	]);
}

export const BoundValue: Story = {
	decorators: [
		moduleMetadata({
			imports: [CommandBoundValue],
		}),
	],
	render: () => ({
		template: '<command-bound-value-component/>',
	}),
};
