import { NgIcon } from '@ng-icons/core';
import { BrnMenuTrigger } from '@spartan-ng/brain/menu';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmMenu, HlmMenuImports } from '@spartan-ng/helm/menu';
import { HlmMenubar, HlmMenubarImports } from '@spartan-ng/helm/menubar';
import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

const meta: Meta<HlmMenubar> = {
	title: 'Menubar',
	component: HlmMenubar,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [BrnMenuTrigger, HlmMenubarImports, HlmMenuImports, HlmButton, NgIcon, HlmIcon],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmMenu>;

export const Default: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
        <hlm-menubar class='w-fit'>
      <button hlmMenubarItem [brnMenuTriggerFor]='file'>File</button>
      <button hlmMenubarItem [brnMenuTriggerFor]='edit'>Edit</button>
      <button hlmMenubarItem [brnMenuTriggerFor]='view'>View</button>
      <button hlmMenubarItem [brnMenuTriggerFor]='profiles'>Profiles</button>
    </hlm-menubar>

    <ng-template #file>
      <hlm-menu ${argsToTemplate(args)} class='w-48'>
        <hlm-menu-group>
          <button hlmMenuItem>
            New Tab
            <hlm-menu-shortcut>⌘T</hlm-menu-shortcut>
          </button>
          <button hlmMenuItem>
            New Window
            <hlm-menu-shortcut>⌘N</hlm-menu-shortcut>
          </button>
          <button hlmMenuItem disabled>New Incognito Window</button>

        </hlm-menu-group>

        <hlm-menu-separator />

        <button hlmMenuItem [brnMenuTriggerFor]='share'>
          Share
          <hlm-menu-item-sub-indicator />
        </button>

        <hlm-menu-separator />

        <button hlmMenuItem>
          Print...
          <hlm-menu-shortcut>⌘P</hlm-menu-shortcut>
        </button>

      </hlm-menu>
    </ng-template>
    <ng-template #share>
      <hlm-sub-menu>
        <button hlmMenuItem>
          Email link
        </button>
        <button hlmMenuItem>
          Messages
        </button>
        <button hlmMenuItem>
          Notes
        </button>
      </hlm-sub-menu>
    </ng-template>

    <ng-template #edit>
      <hlm-menu ${argsToTemplate(args)} class='w-48'>
        <hlm-menu-group>
          <button hlmMenuItem>
            Undo
            <hlm-menu-shortcut>⌘Z</hlm-menu-shortcut>
          </button>
          <button hlmMenuItem>
            Redo
            <hlm-menu-shortcut>⇧⌘Z</hlm-menu-shortcut>
          </button>
        </hlm-menu-group>

        <hlm-menu-separator />

        <button hlmMenuItem [brnMenuTriggerFor]='find'>
          Share
          <hlm-menu-item-sub-indicator />
        </button>

        <hlm-menu-separator />

        <button hlmMenuItem>Cut</button>
        <button hlmMenuItem>Copy</button>
        <button hlmMenuItem>Paste</button>

      </hlm-menu>
    </ng-template>
    <ng-template #find>
      <hlm-sub-menu>
        <button hlmMenuItem>
          Search the web
        </button>
        <hlm-menu-separator />
        <button hlmMenuItem>
          Find...
        </button>
        <button hlmMenuItem>
          Find Next
        </button>
        <button hlmMenuItem>
          Find Previous
        </button>
      </hlm-sub-menu>
    </ng-template>

    <ng-template #view>
      <hlm-menu ${argsToTemplate(args)}>
        <button hlmMenuItemCheckbox>
          <hlm-menu-item-check />
          Always Show Bookmarks Bar
        </button>
        <button hlmMenuItemCheckbox checked>
          <hlm-menu-item-check />
          Always Show Full URLs
        </button>
        <hlm-menu-separator />
        <button inset hlmMenuItem>
          Reload
          <hlm-menu-shortcut>⌘R</hlm-menu-shortcut>
        </button>
        <button inset disabled hlmMenuItem>
          Force Reload
          <hlm-menu-shortcut>⇧⌘R</hlm-menu-shortcut>
        </button>
        <hlm-menu-separator />
        <button inset hlmMenuItem>
          Toggle Fullscreen
        </button>
        <hlm-menu-separator />
        <button inset hlmMenuItem>
          Hide Sidebar
        </button>
      </hlm-menu>
    </ng-template>

    <ng-template #profiles>
      <hlm-menu ${argsToTemplate(args)} class='w-48'>
        <button hlmMenuItemRadio>
          <hlm-menu-item-radio />
          Andy
        </button>
        <button hlmMenuItemRadio checked>
          <hlm-menu-item-radio />
          Benoit
        </button>
        <button hlmMenuItemRadio>
          <hlm-menu-item-radio />
          Lewis
        </button>
        <hlm-menu-separator />
        <button inset hlmMenuItem>
          Edit...
        </button>
        <hlm-menu-separator />
        <button inset hlmMenuItem>
          Add Profile...
        </button>
      </hlm-menu>
    </ng-template>
    `,
	}),
};
