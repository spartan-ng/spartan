import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as lucide from '@ng-icons/lucide';

import { HlmButton, HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenu, HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon, HlmIconImports } from '@spartan-ng/helm/icon';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmDropdownMenu> = {
	title: 'Dropdown Menu',
	component: HlmDropdownMenu,
	tags: ['autodocs'],
	args: {
		sideOffset: '1',
	},
	argTypes: {
		sideOffset: {
			options: ['1', '1.5', '2'],
			control: {
				type: 'select',
			},
		},
	},
	decorators: [
		moduleMetadata({
			providers: [provideIcons(lucide)],
			imports: [HlmDropdownMenuImports, HlmButton, NgIcon, HlmIcon],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmDropdownMenu>;

export const Default: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
    <div class='w-full flex justify-center items-center'>
      <button hlmBtn variant='outline' align='end' [hlmDropdownMenuTrigger]='menu'>Open</button>
    </div>
    <ng-template #menu>
      <hlm-dropdown-menu ${argsToTemplate(args)} class='w-56'>
        <hlm-dropdown-menu-label>My Account</hlm-dropdown-menu-label>
        <hlm-dropdown-menu-separator />
        <hlm-dropdown-menu-group>
          <button hlmDropdownMenuItem>
            <ng-icon hlm name='lucideUser' size="sm" />
            <span>Profile</span>
            <hlm-dropdown-menu-shortcut>⇧⌘P</hlm-dropdown-menu-shortcut>
          </button>

          <button hlmDropdownMenuItem>
            <ng-icon hlm name='lucideCreditCard' size="sm" />
            <span>Billing</span>
            <hlm-dropdown-menu-shortcut>⌘B</hlm-dropdown-menu-shortcut>
          </button>

          <button hlmDropdownMenuItem>
            <ng-icon hlm name='lucideSettings' size="sm" />
            <span>Settings</span>
            <hlm-dropdown-menu-shortcut>⌘S</hlm-dropdown-menu-shortcut>
          </button>

          <button hlmDropdownMenuItem>
            <ng-icon hlm name='lucideKeyboard' size="sm" />
            <span>Keyboard Shortcuts</span>
            <hlm-dropdown-menu-shortcut>⌘K</hlm-dropdown-menu-shortcut>
          </button>
        </hlm-dropdown-menu-group>

        <hlm-dropdown-menu-separator />

        <hlm-dropdown-menu-group>
          <button hlmDropdownMenuItem>
            <ng-icon hlm name='lucideUsers' size="sm" />
            <span>Team</span>
            <hlm-dropdown-menu-shortcut>⌘B</hlm-dropdown-menu-shortcut>
          </button>

          <button hlmDropdownMenuItem [hlmDropdownMenuTrigger]='invite' side="right" align="start">
            <ng-icon hlm name='lucideUserPlus' size="sm" />
            <span>Invite Users</span>
            <hlm-dropdown-menu-item-sub-indicator />
          </button>

          <button hlmDropdownMenuItem>
            <ng-icon hlm name='lucidePlus' size="sm" />
            <span>New Team</span>
            <hlm-dropdown-menu-shortcut>⌘+T</hlm-dropdown-menu-shortcut>
          </button>
        </hlm-dropdown-menu-group>

        <hlm-dropdown-menu-separator />

        <hlm-dropdown-menu-group>
          <button hlmDropdownMenuItem [disabled]='false'>
            <ng-icon hlm name='lucideGithub' size="sm" />
            <span>Github</span>
          </button>

          <button hlmDropdownMenuItem [disabled]='true'>
            <ng-icon hlm name='lucideLifeBuoy' size="sm" />
            <span>Support</span>
          </button>

          <button hlmDropdownMenuItem disabled>
            <ng-icon hlm name='lucideCloud' size="sm" />
            <span>API</span>
          </button>
        </hlm-dropdown-menu-group>

        <hlm-dropdown-menu-separator />

        <button hlmDropdownMenuItem>
          <ng-icon hlm name='lucideLogOut' size="sm" />
          <span>Logout</span>
          <hlm-dropdown-menu-shortcut>⇧⌘Q</hlm-dropdown-menu-shortcut>
        </button>

      </hlm-dropdown-menu>
    </ng-template>

    <ng-template #invite>
      <hlm-dropdown-menu-sub>
        <button hlmDropdownMenuItem>
          <ng-icon hlm name='lucideMail' size="sm" />
          Email
        </button>

        <button hlmDropdownMenuItem>
          <ng-icon hlm name='lucideMessageSquare' size="sm" />
          Message
        </button>
        <hlm-dropdown-menu-separator />
        <button hlmDropdownMenuItem>
          <ng-icon hlm name='lucideCirclePlus' size="sm" />
          <span>More</span>
        </button>
      </hlm-dropdown-menu-sub>
    </ng-template>
    `,
	}),
};

@Component({
	selector: 'stateful-dropdown-story',
	imports: [HlmDropdownMenuImports, HlmButtonImports, HlmIconImports],
	template: `
		<div class="flex w-full items-center justify-center pt-[20%]">
			<button hlmBtn variant="outline" align="center" [hlmDropdownMenuTrigger]="menu">Open</button>
		</div>
		<ng-template #menu>
			<hlm-dropdown-menu class="w-56">
				<hlm-dropdown-menu-group>
					<hlm-dropdown-menu-label>Appearance</hlm-dropdown-menu-label>

					<button hlmDropdownMenuCheckbox [checked]="isPanel" (triggered)="isPanel = !isPanel">
						<hlm-dropdown-menu-checkbox-indicator />
						<span>Panel</span>
					</button>

					<button
						hlmDropdownMenuCheckbox
						disabled
						[checked]="isActivityBar"
						(triggered)="isActivityBar = !isActivityBar"
					>
						<hlm-dropdown-menu-checkbox-indicator />
						<span>Activity Bar</span>
					</button>

					<button hlmDropdownMenuCheckbox [checked]="isStatusBar" (triggered)="isStatusBar = !isStatusBar">
						<hlm-dropdown-menu-checkbox-indicator />
						<span>Status Bar</span>
					</button>
				</hlm-dropdown-menu-group>

				<hlm-dropdown-menu-separator />

				<hlm-dropdown-menu-label>Panel Position</hlm-dropdown-menu-label>

				<hlm-dropdown-menu-group>
					@for (size of panelPositions; track size) {
						<button hlmDropdownMenuRadio [checked]="size === selectedPosition" (triggered)="selectedPosition = size">
							<hlm-dropdown-menu-radio-indicator />
							<span>{{ size }}</span>
						</button>
					}
				</hlm-dropdown-menu-group>

				<hlm-dropdown-menu-separator />

				<button hlmDropdownMenuItem (triggered)="reset()">
					<ng-icon hlm name="lucideUndo2" size="sm" />
					Reset
				</button>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
class StatefulStory {
	isStatusBar = false;
	isPanel = false;
	isActivityBar = false;

	panelPositions = ['Top', 'Bottom', 'Right', 'Left'] as const;
	selectedPosition: (typeof this.panelPositions)[number] | undefined = 'Bottom';

	reset() {
		this.isStatusBar = false;
		this.isPanel = false;
		this.isActivityBar = false;
		this.selectedPosition = 'Bottom';
	}
}

export const Stateful: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [StatefulStory],
		},
		template: '<stateful-dropdown-story/>',
	}),
};
