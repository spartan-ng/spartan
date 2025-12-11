import { HlmKbd, HlmKbdImports } from '@spartan-ng/helm/kbd';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

export default {
	title: 'Kbd',
	component: HlmKbd,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmKbdImports],
		}),
	],
} as Meta<HlmKbd>;

type Story = StoryObj<HlmKbd>;

export const Default: Story = {
	render: () => ({
		template: `

 <div class="flex flex-col items-center gap-4">
      <kbd hlmKbdGroup>
        <kbd hlmKbd>⌘</kbd>
        <kbd hlmKbd>⇧</kbd>
        <kbd hlmKbd>⌥</kbd>
        <kbd hlmKbd>⌃</kbd>
      </kbd>
         <kbd hlmKbdGroup>
        <kbd hlmKbd>Ctrl</kbd>
        <span>+</span>
        <kbd hlmKbd>B</kbd>
      </kbd>
    </div>
		`,
	}),
};
