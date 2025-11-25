import { NgIcon } from '@ng-icons/core';

import { HlmButton } from '@spartan-ng/helm/button';
import { HlmContextMenuImports } from '@spartan-ng/helm/context-menu';
import { HlmDropdownMenu, HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmDropdownMenu> = {
	title: 'Context Menu',
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
			imports: [HlmDropdownMenuImports, HlmContextMenuImports, HlmButton, NgIcon, HlmIcon],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmDropdownMenu>;

export const Default: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
        <div [hlmContextMenuTrigger]='menu'
         class='border-border flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm'>
      Right click here
    </div>

    <ng-template #menu>
      <hlm-dropdown-menu ${argsToTemplate(args)} class='w-64'>
        <hlm-dropdown-menu-group>
          <button inset hlmDropdownMenuItem>
            Back
            <hlm-dropdown-menu-shortcut>⌘[</hlm-dropdown-menu-shortcut>
          </button>

          <button disabled inset hlmDropdownMenuItem>
            Forward
            <hlm-dropdown-menu-shortcut>⌘]</hlm-dropdown-menu-shortcut>
          </button>

          <button disabled inset hlmDropdownMenuItem>
            Reload
            <hlm-dropdown-menu-shortcut>⌘R</hlm-dropdown-menu-shortcut>
          </button>

          <button inset hlmDropdownMenuItem [hlmDropdownMenuTrigger]='moreTools'>
            More Tools
            <hlm-dropdown-menu-item-sub-indicator />
          </button>
        </hlm-dropdown-menu-group>

        <hlm-dropdown-menu-separator />

        <hlm-dropdown-menu-group>
          <button hlmDropdownMenuCheckbox checked>
            <hlm-dropdown-menu-checkbox-indicator />
            Show Booksmarks Bar
            <hlm-dropdown-menu-shortcut>⌘⇧B</hlm-dropdown-menu-shortcut>
          </button>
          <button hlmDropdownMenuCheckbox>
            <hlm-dropdown-menu-checkbox-indicator />
            Show full URLs
          </button>
        </hlm-dropdown-menu-group>

        <hlm-dropdown-menu-separator />
        <hlm-dropdown-menu-label inset>People</hlm-dropdown-menu-label>
        <hlm-dropdown-menu-separator />
        <hlm-dropdown-menu-group>
          <button hlmDropdownMenuRadio checked>
            <hlm-dropdown-menu-radio-indicator />
            Pedro Duarte
          </button>
          <button hlmDropdownMenuRadio>
            <hlm-dropdown-menu-radio-indicator />
            Colm Tuite
          </button>
        </hlm-dropdown-menu-group>
      </hlm-dropdown-menu>
    </ng-template>

    <ng-template #moreTools>
      <hlm-dropdown-menu-sub class='w-48'>
        <button hlmDropdownMenuItem>
          Save Page as...
          <hlm-dropdown-menu-shortcut>⇧⌘S</hlm-dropdown-menu-shortcut>
        </button>
        <button hlmDropdownMenuItem>
          Create Shortcut...
        </button>
        <button hlmDropdownMenuItem>
          Name Window...
        </button>
        <hlm-dropdown-menu-separator />
        <button hlmDropdownMenuItem>Developer Tools</button>
      </hlm-dropdown-menu-sub>
    </ng-template>
    `,
	}),
};
