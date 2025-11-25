import { NgIcon } from '@ng-icons/core';

import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmMenubar, HlmMenubarImports } from '@spartan-ng/helm/menubar';
import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

const meta: Meta<HlmMenubar> = {
	title: 'Menubar',
	component: HlmMenubar,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmMenubarImports, HlmDropdownMenuImports, HlmButton, NgIcon, HlmIcon],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmMenubar>;

export const Default: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
    <hlm-menubar >
      <button [hlmMenubarTrigger]='file'>File</button>
      <button [hlmMenubarTrigger]='edit'>Edit</button>
      <button [hlmMenubarTrigger]='view'>View</button>
      <button [hlmMenubarTrigger]='profiles'>Profiles</button>
    </hlm-menubar>

    <ng-template #file>
      <hlm-dropdown-menu ${argsToTemplate(args)} class='w-48'>
        <hlm-dropdown-menu-group>
          <button hlmDropdownMenuItem>
            New Tab
            <hlm-dropdown-menu-shortcut>⌘T</hlm-dropdown-menu-shortcut>
          </button>
          <button hlmDropdownMenuItem>
            New Window
            <hlm-dropdown-menu-shortcut>⌘N</hlm-dropdown-menu-shortcut>
          </button>
          <button hlmDropdownMenuItem disabled>New Incognito Window</button>

        </hlm-dropdown-menu-group>

        <hlm-dropdown-menu-separator />

        <button hlmDropdownMenuItem [hlmDropdownMenuTrigger]='share'>
          Share
          <hlm-dropdown-menu-item-sub-indicator />
        </button>

        <hlm-dropdown-menu-separator />

        <button hlmDropdownMenuItem>
          Print...
          <hlm-dropdown-menu-shortcut>⌘P</hlm-dropdown-menu-shortcut>
        </button>

      </hlm-dropdown-menu>
    </ng-template>
    <ng-template #share>
      <hlm-dropdown-menu-sub>
        <button hlmDropdownMenuItem>
          Email link
        </button>
        <button hlmDropdownMenuItem>
          Messages
        </button>
        <button hlmDropdownMenuItem>
          Notes
        </button>
      </hlm-dropdown-menu-sub>
    </ng-template>

    <ng-template #edit>
      <hlm-dropdown-menu ${argsToTemplate(args)} class='w-48'>
        <hlm-dropdown-menu-group>
          <button hlmDropdownMenuItem>
            Undo
            <hlm-dropdown-menu-shortcut>⌘Z</hlm-dropdown-menu-shortcut>
          </button>
          <button hlmDropdownMenuItem>
            Redo
            <hlm-dropdown-menu-shortcut>⇧⌘Z</hlm-dropdown-menu-shortcut>
          </button>
        </hlm-dropdown-menu-group>

        <hlm-dropdown-menu-separator />

        <button hlmDropdownMenuItem [hlmDropdownMenuTrigger]='find'>
          Share
          <hlm-dropdown-menu-item-sub-indicator />
        </button>

        <hlm-dropdown-menu-separator />

        <button hlmDropdownMenuItem>Cut</button>
        <button hlmDropdownMenuItem>Copy</button>
        <button hlmDropdownMenuItem>Paste</button>

      </hlm-dropdown-menu>
    </ng-template>
    <ng-template #find>
      <hlm-dropdown-menu-sub>
        <button hlmDropdownMenuItem>
          Search the web
        </button>
        <hlm-dropdown-menu-separator />
        <button hlmDropdownMenuItem>
          Find...
        </button>
        <button hlmDropdownMenuItem>
          Find Next
        </button>
        <button hlmDropdownMenuItem>
          Find Previous
        </button>
      </hlm-dropdown-menu-sub>
    </ng-template>

    <ng-template #view>
      <hlm-dropdown-menu ${argsToTemplate(args)}>
        <button hlmDropdownMenuCheckbox>
          <hlm-dropdown-menu-checkbox-indicator />
          Always Show Bookmarks Bar
        </button>
        <button hlmDropdownMenuCheckbox checked>
          <hlm-dropdown-menu-checkbox-indicator />
          Always Show Full URLs
        </button>
        <hlm-dropdown-menu-separator />
        <button inset hlmDropdownMenuItem>
          Reload
          <hlm-dropdown-menu-shortcut>⌘R</hlm-dropdown-menu-shortcut>
        </button>
        <button inset disabled hlmDropdownMenuItem>
          Force Reload
          <hlm-dropdown-menu-shortcut>⇧⌘R</hlm-dropdown-menu-shortcut>
        </button>
        <hlm-dropdown-menu-separator />
        <button inset hlmDropdownMenuItem>
          Toggle Fullscreen
        </button>
        <hlm-dropdown-menu-separator />
        <button inset hlmDropdownMenuItem>
          Hide Sidebar
        </button>
      </hlm-dropdown-menu>
    </ng-template>

    <ng-template #profiles>
      <hlm-dropdown-menu ${argsToTemplate(args)} class='w-48'>
        <button hlmDropdownMenuRadio>
          <hlm-dropdown-menu-radio-indicator />
          Andy
        </button>
        <button hlmDropdownMenuRadio checked>
          <hlm-dropdown-menu-radio-indicator />
          Benoit
        </button>
        <button hlmDropdownMenuRadio>
          <hlm-dropdown-menu-radio-indicator />
          Lewis
        </button>
        <hlm-dropdown-menu-separator />
        <button inset hlmDropdownMenuItem>
          Edit...
        </button>
        <hlm-dropdown-menu-separator />
        <button inset hlmDropdownMenuItem>
          Add Profile...
        </button>
      </hlm-dropdown-menu>
    </ng-template>
    `,
	}),
};
