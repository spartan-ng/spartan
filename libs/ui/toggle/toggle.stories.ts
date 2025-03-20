import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';
import { BrnToggleDirective } from '@spartan-ng/brain/toggle';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

import { HlmIconDirective } from '../icon/helm/src';
import { HlmToggleDirective } from './helm/src';

const meta: Meta<HlmToggleDirective> = {
	title: 'Toggle',
	component: HlmToggleDirective,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmToggleDirective, BrnToggleDirective, NgIcon, HlmIconDirective],
			providers: [provideIcons({ lucideItalic })],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmToggleDirective>;

export const Default: Story = {
	render: () => ({
		template: `
    <div class='space-x-3'>
    <button aria-label='Italic Toggle' size='sm' hlmToggle><ng-icon hlm name='lucideItalic'/></button>
    <button aria-label='Italic Toggle' hlmToggle><ng-icon hlm name='lucideItalic'/></button>
    <button aria-label='Italic Toggle' size='lg' hlmToggle><ng-icon hlm name='lucideItalic'/></button>
    <button aria-label='Italic Toggle' variant='outline' hlmToggle><ng-icon hlm name='lucideItalic'/></button>
    <button aria-label='Italic Toggle' disabled hlmToggle><ng-icon hlm name='lucideItalic'/></button>
    </div>
    `,
	}),
};

export const WithText: Story = {
	name: 'With Text',
	render: () => ({
		template: `
    <div class='space-x-3'>
    <button size='sm' hlmToggle><ng-icon hlm name='lucideItalic'/> <span class='ml-2'>Italic</span></button>
    <button hlmToggle><ng-icon hlm name='lucideItalic'/> <span class='ml-2'>Italic</span></button>
    <button size='lg' hlmToggle><ng-icon hlm name='lucideItalic'/> <span class='ml-2'>Italic</span></button>
    <button variant='outline' hlmToggle><ng-icon hlm name='lucideItalic'/> <span class='ml-2'>Italic</span></button>
    <button disabled hlmToggle><ng-icon hlm name='lucideItalic'/> <span class='ml-2'>Italic</span></button>
    </div>
`,
	}),
};